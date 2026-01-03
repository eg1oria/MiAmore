'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  cartItemsCount: number;
  cartTotal: number;
}

interface AdminData {
  users: User[];
  total: number;
}

const port = 'https://flower-shop-backend-6hsn.onrender.com';

export default function AdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showId, setShowId] = useState<string | null>(null);

  const handleShowId = (id: string) => {
    setShowId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${port}/admin/check`, {
          credentials: 'include',
        });

        console.log('Response received:', response.status);

        const result = await response.json();
        console.log('Response data:', result);

        setIsAdmin(result.isAdmin);

        if (!result.isAdmin) {
          setError('У вас нет прав администратора');
          setLoading(false);
        }
      } catch (err) {
        console.error('Admin check error:', err);
        setError(`Ошибка проверки прав: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${port}/admin/users`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя ${email}?`)) {
      return;
    }

    try {
      setDeleting(userId);
      const response = await fetch(`${port}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка удаления');
      }

      setData((prev) => ({
        users: prev!.users.filter((u) => u.id !== userId),
        total: prev!.total - 1,
      }));

      alert('Пользователь успешно удален');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600">{error || 'У вас нет прав администратора'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель администратора</h1>
          <p className="text-gray-600">
            Всего пользователей: <span className="font-semibold">{data?.total || 0}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Корзина
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <button onClick={() => handleShowId(user.id)} className="cursor-pointer">
                            {showId === user.id ? (
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                ID: {user.id.slice(0, 10)}...
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.cartItemsCount > 0 ? (
                          <>
                            <span className="font-medium">{user.cartItemsCount}</span> товаров
                            <br />
                            <span className="text-gray-500">{user.cartTotal} ₽</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Пусто</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={deleting === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        {deleting === user.id ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                            Удаление...
                          </span>
                        ) : (
                          '🗑️ Удалить'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data?.users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Пользователей пока нет</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
