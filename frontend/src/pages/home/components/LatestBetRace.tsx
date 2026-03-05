import { useState, useRef } from 'react';
import type { LatestBetsData, BetRecord } from '@/types';

const tabs = ['Latest Bet', 'High Roller', 'High Multiplier'] as const;
type TabKey = 'latest_bet' | 'high_roller' | 'high_multiplier';
const tabKeys: TabKey[] = ['latest_bet', 'high_roller', 'high_multiplier'];

const ROW_HEIGHT = 48;
const VISIBLE_ROWS = 7;
const SPEED_PER_ROW = 1.5; // seconds per row scroll

interface Props {
  data: LatestBetsData;
}

function BetRow({ row }: { row: BetRecord }) {
  const isProfit = row.profit > 0;
  const profitStr = isProfit
    ? `+${row.currency || '\u20B9'} ${Math.abs(row.profit)}`
    : row.profit === 0
    ? '0'
    : `-${row.currency || '\u20B9'} ${Math.abs(row.profit)}`;

  return (
    <div
      className="grid items-center px-4 text-sm shrink-0"
      style={{ gridTemplateColumns: '1fr 1fr auto', borderBottom: '1px solid #2A2D2D', height: `${ROW_HEIGHT}px` }}
    >
      <span className="text-white flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center text-2xs text-brand flex-shrink-0">
          {row.game_initial}
        </span>
        <span className="truncate">{row.game}</span>
      </span>
      <span className="text-txt-secondary">{row.player}</span>
      <span className={`text-right font-semibold ${isProfit ? 'text-brand' : 'text-txt-muted'}`}>
        {profitStr}
      </span>
    </div>
  );
}

export default function LatestBetRace({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rows: BetRecord[] = data[tabKeys[activeTab]] ?? [];

  if (rows.length === 0 && activeTab === 0) return null;

  const shouldScroll = rows.length > VISIBLE_ROWS;
  // Duplicate the list for seamless loop
  const scrollDuration = rows.length * SPEED_PER_ROW;
  const totalHeight = rows.length * ROW_HEIGHT;

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center h-8 mb-1.5">
        <div className="flex items-center text-base font-extrabold text-white">Latest bet & Race</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar rounded-lg" style={{ background: '#232626' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer whitespace-nowrap border-none ${
              activeTab === i ? 'text-white' : 'text-txt-muted'
            }`}
            style={{ background: activeTab === i ? '#323738' : 'transparent' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div
        className="grid items-center px-4 py-2 text-txt-muted text-xs"
        style={{ gridTemplateColumns: '1fr 1fr auto', borderBottom: '1px solid #3A3D3D' }}
      >
        <span>Game</span>
        <span>Player</span>
        <span className="text-right">Profit</span>
      </div>

      {/* Scrolling Table Body */}
      <div
        ref={containerRef}
        style={{ height: `${ROW_HEIGHT * VISIBLE_ROWS}px`, overflow: 'hidden' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {shouldScroll ? (
          <div
            className="bet-scroll-track"
            style={{
              animationDuration: `${scrollDuration}s`,
              animationPlayState: paused ? 'paused' : 'running',
              // Use CSS custom property for the scroll distance
              ['--scroll-distance' as string]: `-${totalHeight}px`,
            }}
          >
            {/* Original list */}
            {rows.map((row, i) => (
              <BetRow key={`a-${i}`} row={row} />
            ))}
            {/* Duplicated list for seamless loop */}
            {rows.map((row, i) => (
              <BetRow key={`b-${i}`} row={row} />
            ))}
          </div>
        ) : (
          rows.map((row, i) => (
            <BetRow key={i} row={row} />
          ))
        )}
      </div>
    </div>
  );
}
