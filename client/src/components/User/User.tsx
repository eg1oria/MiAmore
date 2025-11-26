'use client';

import { useAuth } from '@/contexts/AuthContext';
import DeleteAccountButton from '../Buttons/DeleteAccount';
import styles from './User.module.css';

export default function User() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div className={styles.notAuth}>Вы не авторизованы</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.name}>{user?.name || 'User'}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.textBlock}>
          <p className={styles.text}>
            Добро пожаловать в ваш профиль! Тут будет информация о вас, ваши действия и настройки.
          </p>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          Выйти
        </button>

        <DeleteAccountButton />
      </div>
    </div>
  );
}
