import { Router } from 'express';

import { authorizeRequest } from '../auth.js';
import { Cart, Users } from '../database/index.js';

export const usersRouter = Router();

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

usersRouter.delete('/me', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Cart.clearForUser(userId);

    const deleted = await Users.delete(userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.status(200).json({ message: 'Аккаунт и корзина успешно удалены' });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
