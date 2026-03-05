import type { PageId } from '../../types';
import { useApp, useNavigate, useAuth } from '../../context/AppContext';
import Icon from '../ui/Icon';

interface NavItem {
  id: PageId;
  label: string;
  icon: string;
  badge?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'users', label: 'Users', icon: 'user' },
  { id: 'games', label: 'Games', icon: 'monitor' },
  { id: 'providers', label: 'Providers', icon: 'list' },
  { id: 'transactions', label: 'Transactions', icon: 'dollar' },
  { id: 'withdrawals', label: 'Withdrawals', icon: 'wallet', badge: true },
  { id: 'banners', label: 'Banners', icon: 'calendar' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  const isActive = (id: PageId) =>
    state.currentPage === id || (id === 'users' && state.currentPage === 'user-detail');

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">G</div>
        <div>
          <div className="logo-text">GO PLUS</div>
          <div className="logo-sub">Admin</div>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${isActive(item.id) ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <Icon name={item.icon} size={20} />
            <span className="item-label">{item.label}</span>
            {item.badge && (
              <span className="sidebar-badge">3</span>
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="logout-btn" onClick={logout} title="Sign out">
          <Icon name="logout" size={20} />
          <span className="item-label">Sign Out</span>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{username[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div className="sidebar-user-name">{username}</div>
            <div className="sidebar-user-email">{username}@goplus.com</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
