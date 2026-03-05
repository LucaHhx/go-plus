import { useState } from 'react';
import type { OneGoSelectionData } from '@/types';

interface Props {
  data: OneGoSelectionData;
}

export default function OneGoSelection({ data }: Props) {
  const [activeTab, setActiveTab] = useState(data.active_tab || data.tabs[0] || '1GO');

  return (
    <div className="px-4 mt-4">
      {/* Section header */}
      <div className="flex items-center h-8 mb-1.5">
        <div className="flex items-center text-base font-extrabold text-white">
          <svg className="w-6 h-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="#24EE89" opacity="0.3"/>
            <text x="12" y="16" textAnchor="middle" fill="#24EE89" fontSize="10" fontWeight="800">1GO</text>
          </svg>
          1GO Selection
        </div>
        <div className="flex-1" />
        <span className="text-brand text-sm font-semibold cursor-pointer flex items-center">
          All
          <svg className="w-4 h-4 ml-1 rotate-180 text-txt-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </span>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
        {data.tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap border-none ${
              activeTab === tab
                ? 'bg-brand text-black'
                : 'bg-bg-hover text-txt-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Game icons grid (same layout as GameSectionRow) */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {data.games.map((game) => (
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
