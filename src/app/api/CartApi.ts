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

function hasValidToken(): boolean {
  const token = getToken();
  if (!token) {
    console.warn('⚠️ No auth token found');
    return false;
  }
  return true;
}

function handleAuthError(status: number): void {
  if (status === 401 || status === 403) {
    console.warn('🚫 Auth error, clearing token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

export const api = {
  async get(): Promise<CartItemApi[]> {
    if (!hasValidToken()) {
      return [];
    }

    const response = await fetch(`${port}/cart`, {
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      handleAuthError(response.status);

      if (response.status === 401 || response.status === 403) {
        return [];
      }

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
    if (!hasValidToken()) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${port}/cart/add`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      handleAuthError(response.status);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Session expired. Please login again.');
      }

      throw new Error('Failed to add item');
    }

    return response.json();
  },

  async updateCount(itemId: string, count: number): Promise<void> {
    if (!hasValidToken()) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${port}/cart/update`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ itemId, count }),
    });

    if (!response.ok) {
      handleAuthError(response.status);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Session expired. Please login again.');
      }

      throw new Error('Failed to update count');
    }
  },

  async remove(itemId: string): Promise<void> {
    if (!hasValidToken()) {
      throw new Error('Authentication required');
    }

    console.log('🗑️ DELETE request to:', `${port}/cart/${itemId}`);
    console.log('📋 Headers:', getHeaders());

    const response = await fetch(`${port}/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders(),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      if (response.status === 403) {
        handleAuthError(response.status);
        throw new Error('Session expired. Please login again.');
      }

      handleAuthError(response.status);

      let errorMessage = 'Failed to remove item';
      try {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        console.error('❌ Could not parse error response', e);
      }

      throw new Error(errorMessage);
    }
  },

  async clear(): Promise<void> {
    if (!hasValidToken()) {
      return;
    }

    const response = await fetch(`${port}/cart`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      handleAuthError(response.status);

      if (response.status === 401 || response.status === 403) {
        return;
      }

      throw new Error('Failed to clear cart');
    }
  },

  async getTotal(): Promise<{ total: number; count: number }> {
    if (!hasValidToken()) {
      return { total: 0, count: 0 };
    }

    const response = await fetch(`${port}/cart/total`, {
      credentials: 'include',
      headers: getHeaders(),
    });

    if (!response.ok) {
      handleAuthError(response.status);

      if (response.status === 401 || response.status === 403) {
        return { total: 0, count: 0 };
      }

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
    if (!hasValidToken()) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${port}/cart/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      handleAuthError(response.status);

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
