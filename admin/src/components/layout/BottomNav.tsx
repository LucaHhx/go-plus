import type { PageId } from '../../types';
import { useApp, useNavigate } from '../../context/AppContext';
import Icon from '../ui/Icon';

const navItems: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: 'grid' },
  { id: 'users', label: 'Users', icon: 'user' },
  { id: 'withdrawals', label: 'Withdraw', icon: 'wallet' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function BottomNav() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${state.currentPage === item.id ? 'active' : ''}`}
          onClick={() => navigate(item.id)}
        >
          <Icon name={item.icon} size={22} />
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
