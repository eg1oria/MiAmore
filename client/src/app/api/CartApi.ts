// api/CartApi.ts

const API_URL = 'http://localhost:4000';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  count: number;
}

export const api = {
  // Получить корзину
  async get(): Promise<CartItem[]> {
    const response = await fetch(`${API_URL}/cart`, {
      credentials: 'include', // Важно для отправки cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    const data = await response.json();
    return data.items || [];
  },

  // Добавить товар
  async add(item: {
    productId: string;
    name: string;
    price: number;
    count: number;
  }): Promise<CartItem> {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    return response.json();
  },

  // Обновить количество
  async updateCount(itemId: string, count: number): Promise<void> {
    const response = await fetch(`${API_URL}/cart/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ itemId, count }),
    });

    if (!response.ok) {
      throw new Error('Failed to update count');
    }
  },

  async remove(itemId: string): Promise<void> {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to remove item');
    }
  },

  // Очистить корзину
  async clear(): Promise<void> {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  },

  // Получить общую сумму
  async getTotal(): Promise<{ total: number; count: number }> {
    const response = await fetch(`${API_URL}/cart/total`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch total');
    }

    return response.json();
  },
};

// Удобные функции для использования в компонентах
export async function getCart() {
  return api.get();
}

export async function addToCart(item: {
  productId: string;
  name: string;
  price: number;
  count?: number;
}) {
  return api.add({ ...item, count: item.count || 1 });
}

export async function updateCount(itemId: string, count: number) {
  return api.updateCount(itemId, count);
}

export async function removeCartItem(itemId: string) {
  return api.remove(itemId);
}

export async function clearCart() {
  return api.clear();
}
