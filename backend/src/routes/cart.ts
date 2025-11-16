import { Router } from 'express';
import { z } from 'zod';
import { authorizeRequest } from '../auth.js';
import { Cart } from '../database/index.js';

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
});

// Добавить товар в корзину
cartRouter.post('/add', async (req, res) => {
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

  try {
    const item = await Cart.addItem(userId, productId, name, price, count);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

// Изменить количество товара
cartRouter.post('/update', async (req, res) => {
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
});

// Удалить товар из корзины
cartRouter.delete('/:id', async (req, res) => {
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
});

// Очистить корзину
cartRouter.delete('/', async (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await Cart.clearForUser(userId);
  res.json({ success: true, message: 'Корзина очищена' });
});

// Получить общую сумму корзины
cartRouter.get('/total', async (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const total = await Cart.getTotalForUser(userId);
  const count = await Cart.getCountForUser(userId);

  res.json({ total, count });
});
