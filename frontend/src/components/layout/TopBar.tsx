import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoginButtons from '@/components/TopBar/LoginButtons';
import UserBalanceChip from '@/components/TopBar/UserBalanceChip';

export default function TopBar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header
      className="shrink-0 z-[1000] h-14"
    >
      <div
        className="flex items-center h-full px-4 overflow-hidden"
        style={{
          background: 'rgba(50, 55, 56, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <Link to="/" className="flex items-center no-underline">
          <img
            src="/assets/brand/logo.png"
            alt="GO PLUS"
            className="h-8 w-auto"
            style={{ minWidth: '100px' }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement && !target.parentElement.querySelector('span')) {
                const fallback = document.createElement('span');
                fallback.className = 'text-brand font-extrabold text-xl';
                fallback.textContent = 'GO PLUS';
                target.parentElement.appendChild(fallback);
              }
            }}
          />
        </Link>

        <div className="flex-1" />

        {/* Hot Event icon */}
        <div className="cursor-pointer mr-2 flex items-center justify-center hot-event-icon" style={{ width: '40px', height: '44px' }}>
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF4757" fillOpacity="0.2"/>
            <path d="M13.5 5.5C14 7 15.5 8 15.5 10c0 1.5-1 2.5-2 3-.5-1-1.5-1.5-1.5-3 0-1 .5-2 1.5-4.5zM9.5 10c.5 1 1.5 1.5 1.5 3s-1 2.5-2 3C8 15 7 14 7 12.5c0-1 .5-2 2.5-2.5z" fill="#FF4757"/>
          </svg>
        </div>

        {isAuthenticated ? <UserBalanceChip /> : <LoginButtons />}
      </div>
    </header>
  );
}
