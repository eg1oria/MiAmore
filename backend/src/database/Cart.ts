import { randomUUID } from 'crypto';
import { JSONFilePreset } from 'lowdb/node';

export interface ICartItem {
  id: string; // уникальный ID элемента корзины
  productId: string; // ID товара из магазина
  name: string;
  price: number;
  count: number;
  userId: string;
  createdAt: number;
}

const database = await JSONFilePreset<Record<string, ICartItem>>('cart.json', {});

export class Cart {
  static getAllForUser(userId: string): ICartItem[] {
    return Object.values(database.data)
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt); // Новые сначала
  }

  static getOne(itemId: string): ICartItem | undefined {
    return database.data[itemId];
  }

  static async addItem(
    userId: string,
    productId: string,
    name: string,
    price: number,
    count: number = 1,
  ): Promise<ICartItem> {
    const existingItem = Object.values(database.data).find(
      (item) => item.userId === userId && item.productId === productId,
    );

    if (existingItem) {
      // Увеличиваем количество
      existingItem.count += count;
      await database.update((data) => {
        data[existingItem.id] = existingItem;
      });
      return existingItem;
    }

    // Создаем новый элемент
    const cartItem: ICartItem = {
      id: randomUUID(),
      productId,
      name,
      price,
      count,
      userId,
      createdAt: Date.now(),
    };

    await database.update((data) => {
      data[cartItem.id] = cartItem;
    });

    return cartItem;
  }

  static async updateCount(itemId: string, count: number): Promise<boolean> {
    const item = Cart.getOne(itemId);

    if (!item) {
      return false;
    }

    if (count <= 0) {
      // Удаляем, если количество 0 или меньше
      await Cart.removeItem(itemId);
      return true;
    }

    await database.update((data) => {
      if (data[itemId]) {
        data[itemId].count = count;
      }
    });

    return true;
  }

  static async removeItem(itemId: string): Promise<boolean> {
    const item = Cart.getOne(itemId);

    if (!item) {
      return false;
    }

    await database.update((data) => {
      delete data[itemId];
    });

    return true;
  }

  static async clearForUser(userId: string): Promise<void> {
    await database.update((data) => {
      for (const key in data) {
        if (data[key].userId === userId) {
          delete data[key];
        }
      }
    });
  }

  static async getTotalForUser(userId: string): Promise<number> {
    const items = Cart.getAllForUser(userId);
    return items.reduce((total, item) => total + item.price * item.count, 0);
  }

  static async getCountForUser(userId: string): Promise<number> {
    const items = Cart.getAllForUser(userId);
    return items.reduce((total, item) => total + item.count, 0);
  }
}
