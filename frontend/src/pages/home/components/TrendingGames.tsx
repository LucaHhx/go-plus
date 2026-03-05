import type { TrendingGame } from '@/types';

interface Props {
  games: TrendingGame[];
}

export default function TrendingGames({ games }: Props) {
  if (games.length === 0) return null;

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center h-8 mb-1.5">
        <div className="flex items-center text-base font-extrabold text-white">Trending Games</div>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {games.map((game) => (
          <div key={game.id} className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105" style={{ width: '142px' }}>
            <img
              src={game.thumbnail_url}
              alt={game.name}
              className="rounded-lg object-cover"
              style={{ width: '142px', height: '96px' }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="142" height="96" viewBox="0 0 142 96"><rect fill="%23323738" width="142" height="96" rx="8"/></svg>'
                )}`;
              }}
            />
            <div className="text-white text-xs mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{game.name}</div>
            <div className="text-txt-muted text-2xs">{game.provider_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
