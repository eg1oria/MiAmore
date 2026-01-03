import { CartItemApi } from '@/types/IFlower';

const port = 'https://flower-shop-backend-6hsn.onrender.com';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const api = {
  async get(): Promise<CartItemApi[]> {
    const response = await fetch(`${port}/cart`, {
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    const data = await response.json();
    return data.items || [];
  },

  async add(item: {
    productId: string;
    name: string;
    price: number;
    image?: string;
    count: number;
  }): Promise<CartItemApi> {
    const response = await fetch(`${port}/cart/add`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    return response.json();
  },

  async updateCount(itemId: string, count: number): Promise<void> {
    const response = await fetch(`${port}/cart/update`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ itemId, count }),
    });

    if (!response.ok) {
      throw new Error('Failed to update count');
    }
  },

  async remove(itemId: string): Promise<void> {
    const response = await fetch(`${port}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove item');
    }
  },

  async clear(): Promise<void> {
    const response = await fetch(`${port}/cart`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  },

  async getTotal(): Promise<{ total: number; count: number }> {
    const response = await fetch(`${port}/cart/total`, {
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch total');
    }

    return response.json();
  },

  async checkout(data: {
    phone: string;
    name: string;
    adres: string;
    postCard: boolean;
    postCardText: string;
  }): Promise<{ success: boolean; message: string; orderId?: number }> {
    const response = await fetch(`${port}/cart/checkout`, {
      method: 'POST',
      headers: getHeaders(), // ← Важно: используем getHeaders с токеном
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Ошибка при отправке заказа' }));
      throw new Error(error.error || 'Ошибка при отправке заказа');
    }

    return response.json();
  },
};

export async function getCart() {
  return api.get();
}

export async function addToCart(item: {
  productId: string;
  name: string;
  price: number;
  image: string;
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

export async function checkout(data: {
  phone: string;
  name: string;
  adres: string;
  postCard: boolean;
  postCardText: string;
}) {
  return api.checkout(data);
}
