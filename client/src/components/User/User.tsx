'use client';

import { useAuth } from '@/contexts/AuthContext';
import DeleteAccountButton from '../Buttons/DeleteAccount';

export default function User() {
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-semibold">
        Вы не авторизованы
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="my-4 h-px bg-gray-200" />

        <div className="space-y-3">
          <p className="text-gray-600">
            Добро пожаловать в ваш профиль! Тут будет информация о вас, ваши действия и настройки.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-5 w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 cursor-pointer transition-colors duration-200">
          Выйти
        </button>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
