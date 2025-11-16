import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { usersRouter, authRouter, cartRouter } from './routes/index.js';
import { sleep } from './sleep.js';

import flowersData from '../db.json';

const server = express();

const PORT = process.env.PORT || 4000;

// Middleware
server.use(
  json(),
  cookieParser(),
  cors({
    origin: 'http://localhost:3000', // URL вашего фронтенда
    credentials: true, // Важно для cookie
  }),
  sleep([400, 1500]),
);

// Routes
server.use('/users', usersRouter);
server.use('/auth', authRouter);
server.use('/cart', cartRouter);

// --- Добавляем маршруты для цветов ---
server.get('/flowers', (req, res) => {
  res.json(flowersData.flowers);
});

// Получить цветок по id
server.get('/flowers/:id', (req, res) => {
  const id = Number(req.params.id);
  const flower = flowersData.flowers.find((f) => f.id === id);
  if (!flower) return res.status(404).json({ error: 'Не найдено' });
  res.json(flower);
});
// --- Конец добавления ---

// Health check
server.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
server.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
server.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
