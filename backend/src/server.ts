import express, { json, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { z } from 'zod';
import fetch from 'node-fetch';

import { usersRouter, authRouter, cartRouter } from './routes/index.js';
import { sleep } from './sleep.js';
import flowersData from '../db.json';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 4000;

// ----------------- Helpers -----------------
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

// ----------------- Validation -----------------
const contactSchema = z.object({
  name: z.string().max(50).optional(),
  email: z.string().email('Неверный email').or(z.literal('')).optional(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Неверный формат телефона'),
  message: z.string().min(5, 'Сообщение слишком короткое').max(1000),
});

// ----------------- Rate Limiters -----------------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте позже',
  standardHeaders: true,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Слишком много запросов, попробуйте позже',
  standardHeaders: true,
});

// ----------------- Middleware -----------------
server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

server.use(json({ limit: '10kb' }));
server.use(mongoSanitize());
server.use(cookieParser());

server.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

server.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

server.use(generalLimiter);

server.use(sleep([400, 1500]));

// ----------------- Additional Logging -----------------
server.use(
  morgan('combined', {
    skip: (req) => req.url.startsWith('/flowers'),
  }),
);

// ----------------- Routes -----------------

// --- Contact Form ---
interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

server.post('/contact', contactLimiter, async (req: Request, res: Response) => {
  try {
    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }

    const { name, email, phone, message } = result.data;

    const text = `
💐Новое сообщение с сайта:

${name ? `Имя: ${escapeHtml(name)}` : 'Имя: Не указано'}
${email ? `Email: ${escapeHtml(email)}` : 'Email: Не указано'}
Телефон: ${escapeHtml(sanitizePhone(phone))}
Сообщение: ${escapeHtml(message)}
`;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    const telegramResult = (await response.json()) as TelegramResponse;

    if (!telegramResult.ok) {
      return res.status(500).json({ error: 'Ошибка при отправке сообщения' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('CONTACT FORM ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Users / Auth / Cart ---
server.use('/users', usersRouter);
server.use('/auth', authRouter);
server.use('/cart', cartRouter);

// --- Flowers ---
server.get('/flowers', (req: Request, res: Response) => {
  res.json(flowersData.flowers);
});

server.get('/flowers/:id', (req: Request, res: Response) => {
  // 🔒 Строгая проверка ID
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const id = Number(req.params.id);
  const flower = flowersData.flowers.find((f) => f.id === id);

  if (!flower) {
    return res.status(404).json({ error: 'Цветок не найден' });
  }

  res.json(flower);
});

// --- Health check ---
server.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- 404 handler ---
server.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Error handler ---
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ----------------- Start Server -----------------
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🔒 Security: Helmet, Rate Limiting, CORS enabled');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
