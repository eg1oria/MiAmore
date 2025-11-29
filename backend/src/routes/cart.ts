import { Router } from 'express';
import { z } from 'zod';
import { authorizeRequest } from '../auth.js';
import { Cart } from '../database/index.js';
import fetch from 'node-fetch';

export const cartRouter = Router();

const AddItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  count: z.number().int().positive().default(1),
});

const UpdateCountSchema = z.object({
  itemId: z.string(),
  count: z.number().int().min(0),
});

// Получить корзину пользователя
cartRouter.get('/', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const items = Cart.getAllForUser(userId);
    const total = await Cart.getTotalForUser(userId);
    const count = await Cart.getCountForUser(userId);

    res.json({
      items,
      total,
      count,
    });
  } catch (error) {
    console.error('GET cart error:', error);
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
});

// Добавить товар в корзину
cartRouter.post('/add', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parseResult = AddItemSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0].message,
      });
    }

    const { productId, name, price, count } = parseResult.data;

    const item = await Cart.addItem(userId, productId, name, price, count);
    res.status(201).json(item);
  } catch (error) {
    console.error('ADD cart error:', error);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

// Изменить количество товара
cartRouter.post('/update', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parseResult = UpdateCountSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0].message,
      });
    }

    const { itemId, count } = parseResult.data;

    // Проверяем, принадлежит ли товар пользователю
    const item = Cart.getOne(itemId);

    if (!item || item.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const success = await Cart.updateCount(itemId, count);

    if (!success) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('UPDATE cart error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
});

// Удалить товар из корзины
cartRouter.delete('/:id', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const itemId = req.params.id;

    // Проверяем, принадлежит ли товар пользователю
    const item = Cart.getOne(itemId);

    if (!item || item.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const success = await Cart.removeItem(itemId);

    if (!success) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('DELETE cart error:', error);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// Оформить заказ
cartRouter.post('/checkout', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const items = Cart.getAllForUser(userId);

    if (items.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }

    const total = await Cart.getTotalForUser(userId);

    const text = `
🛒 Новый заказ!

Пользователь: ${userId}

Товары:
${items
  .map(
    (item) => `• ${item.name} — ${item.count} шт × ${item.price} ₽ = ${item.count * item.price} ₽`,
  )
  .join('\n')}

💰 Итого: ${total} ₽
    `.trim();

    const BOT_TOKEN = process.env.TG_BOT_TOKEN_ORDER;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Telegram credentials missing');
      return res.status(500).json({ error: 'Telegram не настроен' });
    }

    // Отправка в Telegram с таймаутом
    const controller = new AbortController();

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', response.status, errorText);
      return res.status(500).json({ error: 'Ошибка Telegram API' });
    }

    const result: any = await response.json();

    if (!result.ok) {
      console.error('Telegram result not ok:', result);
      return res.status(500).json({ error: 'Ошибка при отправке в Telegram' });
    }

    // Очищаем корзину после успешной отправки
    await Cart.clearForUser(userId);

    res.json({
      success: true,
      message: 'Заказ успешно отправлен',
      orderId: result.result?.message_id,
    });
  } catch (e) {
    console.error('CHECKOUT ERROR:', e);

    res.status(500).json({ error: 'Ошибка при отправке заказа' });
  }
});

// Очистить корзину
cartRouter.delete('/', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Cart.clearForUser(userId);
    res.json({ success: true, message: 'Корзина очищена' });
  } catch (error) {
    console.error('CLEAR cart error:', error);
    res.status(500).json({ error: 'Ошибка при очистке корзины' });
  }
});

// Получить общую сумму корзины
cartRouter.get('/total', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const total = await Cart.getTotalForUser(userId);
    const count = await Cart.getCountForUser(userId);

    res.json({ total, count });
  } catch (error) {
    console.error('GET total error:', error);
    res.status(500).json({ error: 'Ошибка при получении суммы' });
  }
});
