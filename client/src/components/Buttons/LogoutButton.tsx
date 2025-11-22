import { useAuth } from '@/contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
  return (
    <button onClick={handleLogout} className="logout-btn" title="Выйти">
      <FaSignOutAlt size={18} fill="red" />
    </button>
  );
}
