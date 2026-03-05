import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import GameCard from './GameCard';
import GameGridSkeleton from '@/components/shared/GameGridSkeleton';
import EmptyState from '@/components/shared/EmptyState';

export default function GameGrid() {
  const games = useGameStore((s) => s.games);
  const loading = useGameStore((s) => s.loading);
  const loadingMore = useGameStore((s) => s.loadingMore);
  const loadMore = useGameStore((s) => s.loadMore);
  const pagination = useGameStore((s) => s.pagination);
  const filters = useGameStore((s) => s.filters);
  const initialized = useGameStore((s) => s.initialized);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Show skeleton on initial load
  if (loading) {
    return <GameGridSkeleton />;
  }

  // Show empty state after loading completes with no games
  if (initialized && games.length === 0) {
    if (filters.category === 'favorites') {
      return <EmptyState variant="favorites" />;
    }
    if (filters.category === 'recent') {
      return <EmptyState variant="recent" />;
    }
    if (filters.search) {
      return <EmptyState variant="search" />;
    }
    return <EmptyState variant="search" />;
  }

  const hasMore = games.length < pagination.total;

  return (
    <>
      <div className="grid grid-cols-3 gap-x-2 gap-y-3 mt-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Load more sentinel & indicator */}
      <div ref={sentinelRef} className="mt-6 text-center">
        {loadingMore && (
          <div className="inline-flex items-center gap-2 text-txt-muted text-sm">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 9.95 9" />
            </svg>
            Loading more games...
          </div>
        )}
        {!hasMore && games.length > 0 && !loadingMore && (
          <div className="text-txt-muted text-[12px] py-4" />
        )}
      </div>
    </>
  );
}
