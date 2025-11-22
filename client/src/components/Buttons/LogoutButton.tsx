import { useAuth } from '@/contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="logout-btn" title="Выйти">
      <FaSignOutAlt size={18} fill="red" />
    </button>
  );
}
