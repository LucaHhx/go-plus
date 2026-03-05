import { useApp, useAuth } from '../../context/AppContext';
import Icon from '../ui/Icon';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  'user-detail': 'User Detail',
  games: 'Games',
  providers: 'Providers',
  transactions: 'Transactions',
  withdrawals: 'Withdrawals',
  banners: 'Banners',
  settings: 'Settings',
};

export default function MobileHeader() {
  const { state } = useApp();
  const { logout } = useAuth();

  return (
    <div className="mobile-header">
      <div className="mobile-header-title">{pageTitles[state.currentPage] || ''}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="theme-toggle" onClick={logout} title="Sign out">
          <Icon name="logout" size={18} />
        </div>
      </div>
    </div>
  );
}
