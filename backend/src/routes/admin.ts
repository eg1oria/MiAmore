import { Router } from 'express';
import { authorizeRequest } from '../auth.js';
import { Cart, Users } from '../database/index.js';

export const adminRouter = Router();

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'leontevegor57@gmail.com')
  .split(',')
  .map((e) => e.trim());

console.log('🔧 ADMIN_EMAILS loaded:', process.env.ADMIN_EMAILS);
console.log('🔧 ADMIN_EMAILS array:', ADMIN_EMAILS);

function isAdmin(req: any, res: any, next: any) {
  const userId = authorizeRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = Users.getOne(userId);

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
  }

  next();
}

adminRouter.get('/users', isAdmin, async (req, res) => {
  try {
    const users = Users.getAll();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const cartCount = await Cart.getCountForUser(user.id);
        const cartTotal = await Cart.getTotalForUser(user.id);

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          cartItemsCount: cartCount,
          cartTotal: cartTotal,
        };
      }),
    );

    res.json({
      users: usersWithStats,
      total: users.length,
    });
  } catch (error) {
    console.error('GET users error:', error);
    res.status(500).json({ error: 'Ошибка при получении списка пользователей' });
  }
});

adminRouter.delete('/users/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = authorizeRequest(req);

    if (userId === adminId) {
      return res.status(400).json({ error: 'Вы не можете удалить свой собственный аккаунт' });
    }

    const user = Users.getOne(userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await Cart.clearForUser(userId);

    const deleted = await Users.delete(userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      message: `Пользователь ${user.email} успешно удален`,
    });
  } catch (error) {
    console.error('DELETE user error:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

adminRouter.get('/check', async (req, res) => {
  try {
    const userId = authorizeRequest(req);

    console.log('🔍 Admin check - userId:', userId);
    console.log('🔍 Admin emails from env:', ADMIN_EMAILS);

    if (!userId) {
      console.log('❌ No userId - not authenticated');
      return res.json({ isAdmin: false, reason: 'Not authenticated' });
    }

    const user = Users.getOne(userId);
    console.log('🔍 User found:', user?.email);

    if (!user) {
      console.log('❌ User not found in database');
      return res.json({ isAdmin: false, reason: 'User not found' });
    }

    const isAdminUser = ADMIN_EMAILS.includes(user.email);
    console.log('🔍 Is admin?', isAdminUser);

    res.json({
      isAdmin: isAdminUser,
      user: isAdminUser
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
          }
        : undefined,
      debug: {
        userEmail: user.email,
        adminEmails: ADMIN_EMAILS,
        isMatch: isAdminUser,
      },
    });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Ошибка при проверке прав' });
  }
});
