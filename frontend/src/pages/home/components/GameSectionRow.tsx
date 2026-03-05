import { Link } from 'react-router-dom';
import type { GameSection } from '@/types';

const categoryIcons: Record<string, string> = {
  'table-game': '/assets/icons/menu/table-game.svg',
  slots: '/assets/icons/menu/slots.svg',
  live: '/assets/icons/menu/live-casino.svg',
  fishing: '/assets/icons/menu/fishing.svg',
  crash: '/assets/icons/menu/crash.svg',
  lotto: '/assets/icons/menu/lotto.svg',
};

interface Props {
  section: GameSection;
}

export default function GameSectionRow({ section }: Props) {
  const slug = section.category.slug;
  const iconSrc = categoryIcons[slug] || `/assets/icons/menu/${slug}.svg`;

  return (
    <div className="px-4 mt-4">
      {/* Section header */}
      <div className="flex items-center h-8 mb-1.5">
        <img src={iconSrc} alt="" className="w-6 h-6 flex-shrink-0 mr-2" />
        <span className="text-base font-extrabold text-white">{section.category.name}</span>
        <div className="flex-1" />
        <Link
          to={`/explore?category=${slug}`}
          className="text-txt-secondary text-sm font-semibold cursor-pointer flex items-center no-underline"
        >
          All
          <svg className="w-4 h-4 ml-1 rotate-180 text-txt-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </Link>
      </div>

      {/* Horizontal scrolling game icons */}
      <div className="game-scroll hide-scrollbar flex gap-3">
        {section.games.map((game) => (
          <div
            key={game.id}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 transition-transform hover:scale-110"
            style={{ width: '56px' }}
          >
            <img
              src={game.thumbnail_url}
              alt={game.name}
              className="w-14 h-14 rounded-lg object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect fill="%23323738" width="56" height="56" rx="8"/><text x="28" y="32" text-anchor="middle" fill="%236B7070" font-size="10">' + game.name.charAt(0) + '</text></svg>'
                )}`;
              }}
            />
            <span
              className="text-2xs text-txt-secondary text-center whitespace-nowrap overflow-hidden text-ellipsis block"
              style={{ maxWidth: '56px' }}
            >
              {game.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
