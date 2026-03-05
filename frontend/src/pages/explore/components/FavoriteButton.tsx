import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  gameId: number;
  isFavorited: boolean;
}

export default function FavoriteButton({ gameId, isFavorited }: FavoriteButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleFavorite = useGameStore((s) => s.toggleFavorite);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(gameId);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-[6px] right-[6px] z-10 rounded-full w-[28px] h-[28px] flex items-center justify-center border-none cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      {isFavorited ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF4757" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
    </button>
  );
}
