import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';
import SideDrawer from './SideDrawer';
import LiveChatWidget from '@/pages/support/components/LiveChatWidget';
import { useAppStore } from '@/stores/appStore';

export default function AppLayout() {
  const liveChatOpen = useAppStore((s) => s.liveChatOpen);
  const closeLiveChat = useAppStore((s) => s.closeLiveChat);

  return (
    <div className="min-h-dvh flex justify-center" style={{ background: '#1A1D1D' }}>
      <div className="w-full max-w-[430px] flex flex-col overflow-hidden relative" style={{ background: '#232626', height: '100dvh' }}>
        <TopBar />
        <SideDrawer />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomTabBar />
        <LiveChatWidget open={liveChatOpen} onClose={closeLiveChat} />
      </div>
    </div>
  );
}
