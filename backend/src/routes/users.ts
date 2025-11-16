import { Router } from 'express';

import { authorizeRequest } from '../auth.js';
import { Users } from '../database/index.js';

export const usersRouter = Router();

// Получить текущего пользователя
usersRouter.get('/me', (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = Users.getOne(userId);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  });
});

// Обновить профиль
usersRouter.patch('/me', async (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { username, email } = req.body;

  try {
    const updatedUser = await Users.update(userId, { username, email });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.status(200).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при обновлении профиля' });
  }
});

// Удалить аккаунт
usersRouter.delete('/me', async (req, res) => {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const deleted = await Users.delete(userId);

  if (!deleted) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.status(200).json({ message: 'Аккаунт успешно удален' });
});
