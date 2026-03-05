import type { BigWinner } from '@/types';

interface Props {
  winners: BigWinner[];
}

export default function RecentBigWin({ winners }: Props) {
  if (winners.length === 0) return null;

  // Duplicate for seamless marquee loop
  const items = [...winners, ...winners];

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center h-8 mb-1.5">
        <div className="flex items-center text-base font-extrabold text-white">Recent Big Win</div>
      </div>
      <div className="overflow-hidden relative">
        <div className="flex gap-3" style={{ animation: 'marqueeScroll 20s linear infinite', width: 'max-content' }}>
          {items.map((win, i) => (
            <div
              key={`${win.game_name}-${i}`}
              className="flex flex-col items-center gap-1 flex-shrink-0 rounded-lg p-2"
              style={{ width: '140px', background: '#323738' }}
            >
              <img
                src={win.thumbnail_url}
                alt={win.game_name}
                className="w-12 h-12 rounded-lg object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="text-white text-xs font-semibold text-center">{win.game_name}</div>
              <div className="text-brand text-xs font-bold">x {win.multiplier.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
