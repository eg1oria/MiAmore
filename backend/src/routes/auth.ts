import { Router } from 'express';
import { z } from 'zod';

import { authorizeResponse, unauthorizeResponse, authorizeRequest } from '../auth.js';
import { IUser, Users, Passwords } from '../database/index.js';

export const authRouter = Router();

const RegisterSchema = z.object({
  username: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  email: z.string().email({ message: 'Некорректный формат email' }),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

const LoginSchema = z.object({
  email: z.string().email({ message: 'Некорректный формат email' }),
  password: z.string(),
});

// Регистрация
authRouter.post('/register', async (req, res) => {
  const bodyParseResult = RegisterSchema.safeParse(req.body);

  if (!bodyParseResult.success) {
    return res.status(400).json({
      error: bodyParseResult.error.issues[0].message,
    });
  }

  const { username, email, password } = bodyParseResult.data;

  let user: IUser;

  try {
    user = await Users.create(username, email);
  } catch (error) {
    return res.status(409).json({
      error: 'Этот email уже занят',
    });
  }

  await Passwords.create(user.id, password);

  authorizeResponse(res, user.id).status(201).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

// Вход
authRouter.post('/login', (req, res) => {
  const bodyParseResult = LoginSchema.safeParse(req.body);

  if (!bodyParseResult.success) {
    return res.status(400).json({
      error: bodyParseResult.error.issues[0].message,
    });
  }

  const { email, password } = bodyParseResult.data;

  const user = Users.findOne((user) => user.email === email);

  if (!user || !Passwords.verify(user.id, password)) {
    return res.status(401).json({
      error: 'Неверный email или пароль',
    });
  }

  authorizeResponse(res, user.id).status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

// Выход
authRouter.post('/logout', (req, res) => {
  unauthorizeResponse(res).status(200).json({
    message: 'Вы успешно вышли из системы',
  });
});

// Проверка авторизации
authRouter.get('/check', (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({
      isAuthenticated: false,
    });
  }

  const user = Users.getOne(userId);

  if (!user) {
    return res.status(404).json({
      isAuthenticated: false,
    });
  }

  res.status(200).json({
    isAuthenticated: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});