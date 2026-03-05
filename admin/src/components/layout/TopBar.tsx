import { useApp, useAuth } from '../../context/AppContext';
import Icon from '../ui/Icon';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'User Management',
  'user-detail': 'User Detail',
  games: 'Game Management',
  providers: 'Provider Management',
  transactions: 'Transactions',
  withdrawals: 'Withdrawal Review',
  banners: 'Banner Management',
  settings: 'System Settings',
};

export default function TopBar() {
  const { state } = useApp();
  const { username, logout } = useAuth();
  const title = pageTitles[state.currentPage] || '';

  return (
    <div className="top-bar">
      <div>
        <div className="top-bar-title">{title}</div>
      </div>
      <div className="top-bar-right">
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{username}@goplus.com</span>
        <div className="top-btn" onClick={logout} title="Sign out">
          <Icon name="logout" size={18} />
        </div>
      </div>
    </div>
  );
}
