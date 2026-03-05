import { Link } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';

interface MenuItemData {
  key: string;
  label: string;
  icon: string;
  group: 'games' | 'features';
  badge?: string;
  enabled: boolean;
  path?: string;
}

const menuItems: MenuItemData[] = [
  // Games group
  { key: 'favourite', label: 'Favourite!', icon: '/assets/icons/menu/favourite.svg', group: 'games', enabled: false },
  { key: 'weekly-raffle', label: 'Weekly Raffle', icon: '/assets/icons/menu/weekly-raffle.svg', group: 'games', badge: 'Hot', enabled: false },
  { key: 'crash', label: 'Crash', icon: '/assets/icons/menu/crash.svg', group: 'games', badge: 'Hot', enabled: true, path: '/explore?category=crash' },
  { key: 'live', label: 'Live', icon: '/assets/icons/menu/live-casino.svg', group: 'games', enabled: true, path: '/explore?category=live' },
  { key: 'slots', label: 'Slots', icon: '/assets/icons/menu/slots.svg', group: 'games', enabled: true, path: '/explore?category=slots' },
  { key: 'table-game', label: 'Table Game', icon: '/assets/icons/menu/table-game.svg', group: 'games', enabled: true, path: '/explore?category=table-game' },
  { key: 'fishing', label: 'Fishing', icon: '/assets/icons/menu/fishing.svg', group: 'games', enabled: true, path: '/explore?category=fishing' },
  { key: 'lotto', label: 'Lotto', icon: '/assets/icons/menu/lotto.svg', group: 'games', enabled: true, path: '/explore?category=lotto' },
  // Features group
  { key: 'notifications', label: 'Notifications', icon: '/assets/icons/menu/notifications.svg', group: 'features', enabled: false },
  { key: 'hot-event', label: 'Hot Event', icon: '/assets/icons/menu/hot-event.svg', group: 'features', enabled: false },
  { key: 'gift-code', label: 'Gift Code', icon: '/assets/icons/menu/gift-code.svg', group: 'features', enabled: false },
  { key: 'vip-club', label: 'VIP Club', icon: '/assets/icons/menu/vip-club.svg', group: 'features', enabled: false },
  { key: 'affiliate', label: 'Affiliate', icon: '/assets/icons/menu/affiliate.svg', group: 'features', enabled: false },
  { key: 'get-1700', label: 'GET \u20B91700', icon: '/assets/icons/menu/info-circle.svg', group: 'features', enabled: false },
  { key: 'live-support', label: 'Live Support', icon: '/assets/icons/menu/live-support.svg', group: 'features', enabled: true },
];

export default function SideDrawer() {
  const isOpen = useAppStore((s) => s.sideDrawerOpen);
  const closeSideDrawer = useAppStore((s) => s.closeSideDrawer);

  const gamesItems = menuItems.filter((item) => item.group === 'games');
  const featuresItems = menuItems.filter((item) => item.group === 'features');

  return (
    <>
      {/* Overlay */}
      <div
        className={`absolute inset-0 z-[1001] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={closeSideDrawer}
      />

      {/* Panel - positioned within the 430px container */}
      <div
        className="absolute top-0 bottom-0 left-0 z-[1002] w-[280px] overflow-y-auto"
        style={{
          background: '#1A1D1D',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Promo Banner */}
        <Link
          to="/register"
          onClick={closeSideDrawer}
          className="block p-4 pt-6 pb-5 no-underline"
          style={{ background: 'linear-gradient(135deg, #1a5c2e 0%, #0d3a1a 100%)' }}
        >
          <div className="text-white/70 text-xs">Secure and Fast</div>
          <div className="text-white font-extrabold text-lg leading-tight mt-1">Sign up & Get</div>
          <div className="text-white font-extrabold text-2xl leading-tight">100 Bonuses</div>
          <div className="mt-2 inline-flex items-center bg-brand text-black font-extrabold text-xs px-4 py-1.5 rounded-md">
            Join Now
          </div>
        </Link>

        {/* Games Group */}
        <div className="py-2">
          {gamesItems.map((item) => (
            <MenuItem key={item.key} item={item} onClose={closeSideDrawer} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-divider mx-4" />

        {/* Features Group */}
        <div className="py-2">
          {featuresItems.map((item) => (
            <MenuItem key={item.key} item={item} onClose={closeSideDrawer} />
          ))}
        </div>
      </div>
    </>
  );
}

function MenuItem({ item, onClose }: { item: MenuItemData; onClose: () => void }) {
  const openLiveChat = useAppStore((s) => s.openLiveChat);

  const handleClick = () => {
    if (item.key === 'live-support') {
      openLiveChat();
      return;
    }
  };

  const content = (
    <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-bg-hover transition-colors">
      <img src={item.icon} alt={item.label} className="w-6 h-6 mr-3 flex-shrink-0" />
      <span className="text-sm font-semibold text-white flex-1">{item.label}</span>
      {item.badge && (
        <span
          className="text-2xs font-bold px-1.5 py-0.5 rounded mr-2"
          style={{ background: '#FF4757', color: '#fff' }}
        >
          {item.badge}
        </span>
      )}
      <svg className="w-4 h-4 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
    </div>
  );

  if (item.key === 'live-support') {
    return (
      <div onClick={handleClick} className="block">
        {content}
      </div>
    );
  }

  if (item.enabled && item.path) {
    return (
      <Link to={item.path} onClick={onClose} className="no-underline block">
        {content}
      </Link>
    );
  }

  return content;
}
