import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import PageContainer from './PageContainer';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import UserDetailPage from '../pages/UserDetailPage';
import GamesPage from '../pages/GamesPage';
import ProvidersPage from '../pages/ProvidersPage';
import TransactionsPage from '../pages/TransactionsPage';
import WithdrawalsPage from '../pages/WithdrawalsPage';
import BannersPage from '../pages/BannersPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppShell() {
  const pages = [
    { id: 'dashboard' as const, component: <DashboardPage /> },
    { id: 'users' as const, component: <UsersPage /> },
    { id: 'user-detail' as const, component: <UserDetailPage /> },
    { id: 'games' as const, component: <GamesPage /> },
    { id: 'providers' as const, component: <ProvidersPage /> },
    { id: 'transactions' as const, component: <TransactionsPage /> },
    { id: 'withdrawals' as const, component: <WithdrawalsPage /> },
    { id: 'banners' as const, component: <BannersPage /> },
    { id: 'settings' as const, component: <SettingsPage /> },
  ];

  return (
    <>
      <Sidebar />
      <div className="main">
        <TopBar />
        <MobileHeader />
        <PageContainer pages={pages} />
        <BottomNav />
      </div>
    </>
  );
}
