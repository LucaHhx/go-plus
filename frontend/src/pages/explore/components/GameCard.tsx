import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Game } from '@/types';
import FavoriteButton from './FavoriteButton';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  const handleClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/games/${game.id}/play`);
  }, [isAuthenticated, navigate, game.id]);

  const initials = game.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="cursor-pointer relative group" onClick={handleClick}>
      {/* Thumbnail area */}
      <div className="relative overflow-hidden rounded-[8px] transition-transform duration-200 group-hover:scale-105">
        {/* New badge */}
        {game.is_new && (
          <span className="absolute top-[6px] left-[6px] z-10 bg-brand text-[#1A1D1D] text-[8px] font-bold leading-[1.2] rounded-[4px]" style={{ padding: '2px 6px' }}>
            NEW
          </span>
        )}

        {/* Favorite button */}
        <FavoriteButton gameId={game.id} isFavorited={!!game.is_favorited} />

        {/* Image or placeholder */}
        <div ref={imgRef} className="w-full" style={{ aspectRatio: '1' }}>
          {shouldLoad && game.thumbnail_url && !imgError ? (
            <>
              {/* Skeleton placeholder while loading */}
              {!imgLoaded && (
                <div className="skeleton absolute inset-0" />
              )}
              <img
                src={game.thumbnail_url}
                alt={game.name}
                className="w-full h-full object-cover rounded-[8px]"
                style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.2s' }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-bg-card rounded-[8px] flex items-center justify-center">
              <span className="text-[20px] font-extrabold text-txt-muted uppercase">{initials}</span>
            </div>
          )}
        </div>
      </div>

      {/* Game name */}
      <div className="text-[12px] text-white mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {game.name}
      </div>

      {/* Provider name */}
      <div className="text-[10px] text-txt-muted">
        {game.provider?.name || ''}
      </div>
    </div>
  );
}
