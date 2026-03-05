import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';

/* Inline SVG icons matching merge.html exactly */
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 39 39" fill="currentColor">
      <g clipPath="url(#menu-clip)" fillRule="evenodd" clipRule="evenodd">
        <path d="M29.374 38.501a7.927 7.927 0 01-7.879-7.885v-8.353a.56.56 0 01.558-.558h8.353a7.925 7.925 0 017.921 7.836c0 4.948-4.009 8.96-8.953 8.96zm-20.544 0c-4.5 0-8.155-3.652-8.155-8.161.024-4.78 3.9-8.635 8.671-8.635h7.513a.563.563 0 01.6.516v7.735a8.589 8.589 0 01-8.629 8.545zm8.034-20.876H8.506A7.832 7.832 0 01.675 9.788c0-4.947 4.007-8.957 8.95-8.959a7.833 7.833 0 017.798 7.836v8.401a.562.562 0 01-.559.559z"/>
        <path d="M22.053 17.625h7.183c5.016 0 9.084-4.072 9.084-9.091v-.043c0-4.233-3.426-7.662-7.65-7.662a9.178 9.178 0 00-9.133 9.182v6.995a.558.558 0 00.498.612h.018v.007z" fill="#24EE88"/>
      </g>
      <defs><clipPath id="menu-clip"><path fill="#fff" d="M0 0h39v39H0z"/></clipPath></defs>
    </svg>
  );
}

function ExploreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 155.9 132.3" fill="currentColor">
      <rect x="93.3" y="88.4" width="14.4" height="45.6" rx="3.3" ry="3.3" transform="rotate(-42.9 100.567 111.202)" style={{ fill: '#b2bdc0' }}/>
      <path d="M54.9 19.8c-25.2 0-45.6 20.4-45.6 45.6S29.7 111 54.9 111s45.6-20.4 45.6-45.6-20.4-45.6-45.6-45.6zm0 76.1c-16.8 0-30.4-13.6-30.4-30.4s13.6-30.4 30.4-30.4 30.4 13.6 30.4 30.4-13.6 30.4-30.4 30.4z" style={{ fill: '#24ee89', fillRule: 'evenodd' }}/>
      <path d="M116.2 1.5c-5.1 18.3-25.7 25.7-25.7 25.7 17.7 3.9 25.7 22.9 25.7 22.9s8-19 25.7-22.9c0 0-20.6-7.4-25.7-25.7z" style={{ fillRule: 'evenodd', fill: '#b3bec1' }}/>
    </svg>
  );
}

function RaffleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 39" fill="currentColor">
      <g clipPath="url(#raffle-clip)" fillRule="evenodd" clipRule="evenodd">
        <path d="M.434 16.352c.079-.805.753-1.564 1.529-1.792.085-.026.31-.089.387-.089h26.974c.003.051-.019.097-.021.146-.015.416-.026.943 0 1.354.05.788.971.801 1.124.225.081-.305.042-1.221.03-1.579-.002-.049-.025-.095-.021-.146h6.8c.288 0 .785.238 1.021.404 1.285.908.804 2.382.897 3.72.002.03-.001.054-.02.079-.032.043-.243.17-.309.224-1.324 1.107-1.324 2.947 0 4.054.067.055.316.207.327.265v7.227c-.011.057-.26.209-.327.265-1.102.921-1.336 2.42-.455 3.582.219.289.492.5.779.72-.06 1.135.283 2.303-.592 3.209-.276.286-.914.656-1.321.656h-6.78v-.931c0-.717-1.152-.717-1.152 0v.931H2.35c-.077 0-.302-.063-.387-.088-.776-.229-1.45-.988-1.529-1.793v-2.036c.547-.365.989-.908 1.166-1.544.317-1.14-.195-2.261-1.166-2.903v-7.364c.547-.365.989-.908 1.166-1.543.317-1.141-.195-2.262-1.166-2.903.054-.754-.073-1.609 0-2.35z" fill="#B0B3B3"/>
        <path d="M18.547 23.124c-.452-.882-.936-1.748-1.402-2.623l-.791-1.531c-.301-.489-.672-.371-.933.071-.415.708-.786 1.517-1.177 2.247-.322.6-.641 1.203-.984 1.79" fill="#24EE88"/>
      </g>
      <defs><clipPath id="raffle-clip"><path fill="#fff" d="M0 0h40v39H0z"/></clipPath></defs>
    </svg>
  );
}

function QuestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42.5 42.5" fill="currentColor">
      <path d="M32.6 38.5H22.1V22.7h10.1c.6 0 1.5 1 1.5 1.6v13c0 .5-.3.9-.8 1.1h-.4zM10 38.5c-.6-.2-1-.7-1.1-1.3V24.5c0-.7.8-1.8 1.5-1.8h10.1v15.8H10z" fill="#b3bec1"/>
      <path d="M2 20l9.5-6 3.2 5.2-9.5 6-.3-.2c-1-1.5-1.9-3.1-3-4.6V20z" fill="#24ee88"/>
      <path d="M15 4.1c1.6.2 2.4 1.4 2.1 2.9-.8 3.7-7.4 7.8-11 8S1.8 12.3 4 9.9s4.3-1.2 6.3.2" fill="#b3bec1"/>
      <path d="M40.5 20c-1 1.5-1.9 3.1-3 4.6l-.3.2-9.5-6 3.2-5.2 9.5 6v.4z" fill="#24ee88"/>
      <path d="M27.5 4.1c-1.6.2-2.4 1.4-2.1 2.9.8 3.7 7.4 7.8 11 8s4.2-2.7 2-5.1-4.3-1.2-6.3.2" fill="#b3bec1"/>
      <circle cx="21.3" cy="7.5" r="5" fill="#24ee88"/>
    </svg>
  );
}

const tabIcons: Record<string, React.FC<{ className?: string }>> = {
  menu: MenuIcon,
  explore: ExploreIcon,
  raffle: RaffleIcon,
  quest: QuestIcon,
};

interface Tab {
  key: string;
  label: string;
  enabled: boolean;
  path?: string;
  isSpecial?: boolean;
}

const tabs: Tab[] = [
  { key: 'menu', label: 'Menu', enabled: true },
  { key: 'explore', label: 'Explore', enabled: true, path: '/explore' },
  { key: 'get1700', label: 'GET \u20B91700', enabled: false, isSpecial: true },
  { key: 'raffle', label: 'Raffle', enabled: false },
  { key: 'quest', label: 'Quest', enabled: false },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const toggleSideDrawer = useAppStore((s) => s.toggleSideDrawer);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 1500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTabClick = (tab: Tab) => {
    if (tab.key === 'menu') {
      toggleSideDrawer();
      return;
    }
    if (!tab.enabled) {
      setToast(true);
      return;
    }
    if (tab.path) {
      navigate(tab.path);
    }
  };

  const isActive = (tab: Tab) => {
    if (tab.key === 'menu') return location.pathname === '/';
    if (tab.key === 'explore') return location.pathname === '/explore';
    return false;
  };

  return (
    <nav
      className="shrink-0 z-[999] relative"
      style={{ background: '#323738', height: '64px' }}
    >
      <div className="flex items-end justify-around h-full px-2 pb-1">
        {tabs.map((tab) => {
          if (tab.isSpecial) {
            return (
              <div
                key={tab.key}
                className="flex flex-col items-center cursor-pointer"
                style={{ marginTop: '-20px' }}
                onClick={() => handleTabClick(tab)}
              >
                <div className="get1700-wrap">
                  <img
                    src="/assets/icons/get1700-wheel.png"
                    alt="GET 1700"
                  />
                  <div className="get1700-bg" />
                </div>
                <span
                  className="text-2xs font-semibold text-white"
                  style={{ marginTop: '-12px', position: 'relative', zIndex: 10 }}
                >
                  GET <span style={{ color: '#24EE89' }}>{'\u20B9'}</span><span style={{ color: '#FFD700' }}>1700</span>
                </span>
              </div>
            );
          }

          const active = isActive(tab);
          const extraClass = tab.key === 'explore' ? ' mr-3' : tab.key === 'raffle' ? ' ml-3' : '';
          const iconSize = tab.key === 'quest' ? 'w-7 h-7' : tab.key === 'raffle' ? 'w-5 h-5' : 'w-6 h-6';
          const colorClass = active ? 'tab-active' : 'tab-inactive';
          const IconComponent = tabIcons[tab.key];

          return (
            <div
              key={tab.key}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center cursor-pointer pt-1 ${colorClass}${extraClass}`}
            >
              {IconComponent && <IconComponent className={iconSize} />}
              <span className="text-2xs mt-0.5 font-semibold">
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Coming Soon toast */}
      {toast && (
        <div
          className="absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'rgba(50, 55, 56, 0.95)', bottom: '72px' }}
        >
          Coming Soon
        </div>
      )}
    </nav>
  );
}
