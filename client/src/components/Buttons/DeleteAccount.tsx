'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../Modal/DeleteModal';
import './buttons.css';

export default function DeleteAccountButton() {
  const [error, setError] = useState('');
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      setError('');

      const res = await fetch('http://localhost:4000/users/me', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сервера');

      router.push('/');
      window.location.reload();
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setError(error);
    }
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="deleteButton transition-colors duration-200">
        Удалить аккаунт
      </button>

      <Modal open={open} onClose={() => setOpen(false)} onConfirm={handleDelete} />

      {error && <p className="error">{error}</p>}
    </div>
  );
}
