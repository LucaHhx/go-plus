import { useState } from 'react';
import type { LatestBetsData, BetRecord } from '@/types';

const tabs = ['Latest Bet', 'High Roller', 'High Multiplier'] as const;
type TabKey = 'latest_bet' | 'high_roller' | 'high_multiplier';
const tabKeys: TabKey[] = ['latest_bet', 'high_roller', 'high_multiplier'];

interface Props {
  data: LatestBetsData;
}

export default function LatestBetRace({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const rows: BetRecord[] = data[tabKeys[activeTab]] ?? [];

  if (rows.length === 0 && activeTab === 0) return null;

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

      {/* Table Rows */}
      {rows.map((row, i) => {
        const isProfit = row.profit > 0;
        const profitStr = isProfit
          ? `+${row.currency || '\u20B9'} ${Math.abs(row.profit)}`
          : row.profit === 0
          ? '0'
          : `-${row.currency || '\u20B9'} ${Math.abs(row.profit)}`;

        return (
          <div
            key={i}
            className="grid items-center px-4 py-3 text-sm"
            style={{ gridTemplateColumns: '1fr 1fr auto', borderBottom: '1px solid #2A2D2D' }}
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
      })}
    </div>
  );
}
