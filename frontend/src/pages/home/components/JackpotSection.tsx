import { useState, useEffect, useRef } from 'react';
import type { JackpotData } from '@/types';

/** Simulates a live jackpot counter that ticks up by small random increments */
/**
 * Simulates a live jackpot counter with intermittent ticking.
 * Alternates between a burst of rapid increments and a pause.
 */
function useTickingAmount(baseAmount: number, burstMs = 80, maxStep = 50, pauseMs = 2000, burstCount = 6) {
  const [display, setDisplay] = useState(baseAmount);
  const amountRef = useRef(baseAmount);

  useEffect(() => {
    amountRef.current = baseAmount;
    setDisplay(baseAmount);
  }, [baseAmount]);

  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ticks = 0;

    const tick = () => {
      amountRef.current += Math.random() * maxStep + 1;
      setDisplay(amountRef.current);
      ticks++;

      if (ticks < burstCount) {
        // Continue burst
        scheduleRef.current = setTimeout(tick, burstMs);
      } else {
        // Pause then start next burst
        ticks = 0;
        scheduleRef.current = setTimeout(tick, pauseMs + Math.random() * 1000);
      }
    };

    // Start first burst after a short random delay
    scheduleRef.current = setTimeout(tick, Math.random() * 500);

    return () => { if (scheduleRef.current) clearTimeout(scheduleRef.current); };
  }, [burstMs, maxStep, pauseMs, burstCount]);

  return display;
}

function formatINR(amount: number, decimals = 0) {
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface Props {
  data: JackpotData;
}

export default function JackpotSection({ data }: Props) {
  const vipPot = data.pots.find((p) => p.type === 'vip_money_pot');
  const dailyPot = data.pots.find((p) => p.type === 'daily_jackpot');
  const champion = data.last_champion;
  const currency = champion.currency || '\u20B9';

  // burst of 5 ticks every ~2.5s, small increments
  const vipDisplay = useTickingAmount(vipPot?.amount ?? 0, 100, 30, 2500, 5);
  // burst of 6 ticks every ~2s, larger increments
  const dailyDisplay = useTickingAmount(dailyPot?.amount ?? 0, 80, 70, 2000, 6);

  return (
    <div className="px-4 mt-4">
      {/* Section header */}
      <div className="flex items-center h-8 mb-1.5">
        <div className="flex items-center text-base font-extrabold text-white">
          <svg className="w-6 h-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M7 4V2h10v2h3a1 1 0 011 1v3a4 4 0 01-3.5 3.97 5.002 5.002 0 01-3.5 3.87V18h3v2H7v-2h3v-3.16A5.002 5.002 0 016.5 11.97 4 4 0 015 8V5a1 1 0 011-1h1zm0 2H7v2a2 2 0 001.5 1.94L9 10V6H7zm10 0h-2v4l.5-.06A2 2 0 0017 8V6z" fill="#FFD700"/>
          </svg>
          Jackpot of the Day
        </div>
        <div className="flex-1" />
        <span className="text-txt-secondary text-sm cursor-pointer flex items-center">
          More
          <svg className="w-4 h-4 ml-1 rotate-180 text-txt-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </span>
      </div>

      {/* Jackpot Cards Row */}
      <div className="flex gap-3">
        {/* VIP Money Pot */}
        <div className="flex-1 rounded-xl p-4 relative" style={{ background: '#323738' }}>
          <div className="text-txt-secondary text-xs font-semibold">{vipPot?.label || 'VIP Money Pot'}</div>
          {vipPot?.countdown && (
            <div className="text-txt-muted text-2xs mt-1" style={{ animation: 'countdownPulse 1s ease-in-out infinite' }}>{vipPot.countdown}</div>
          )}
          <div className="text-white font-extrabold text-lg mt-2 tabular-nums">
            {currency}{formatINR(vipDisplay, 2)}
          </div>
        </div>
        {/* Daily Jackpot */}
        <div className="flex-1 rounded-xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3a1e 0%, #0d2a12 100%)' }}>
          <div className="text-brand text-xs font-semibold">{dailyPot?.label || 'Daily Jackpot'}</div>
          <div className="text-white font-extrabold text-lg mt-2 tabular-nums">
            {currency}{formatINR(dailyDisplay)}
          </div>
          <div className="text-txt-secondary text-2xs mt-1">Winner</div>
          <img src="https://1goplus.com/png/trophy-B3u8sNrg-Bogwg3F_.png" alt="" className="absolute right-0 top-0 h-full opacity-30 pointer-events-none" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      </div>

      {/* Last Champion row */}
      <div className="mt-2 flex items-center gap-2 rounded-lg p-2" style={{ background: '#323738' }}>
        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden">
          {champion.avatar_url ? (
            <img src={champion.avatar_url} alt="" className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-brand text-xs font-bold">{champion.username?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-txt-secondary text-2xs">Last Champion</div>
          <div className="text-white text-xs font-bold">{champion.username}</div>
        </div>
        <div className="text-right">
          <div className="text-txt-secondary text-2xs">{champion.bet_amount.toLocaleString('en-IN')}(0.0%)</div>
          <div className="text-brand text-xs font-bold">{currency}{champion.win_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* My Turnover */}
      <div className="mt-2 flex items-center justify-between rounded-lg p-3" style={{ background: '#323738' }}>
        <div>
          <div className="text-txt-secondary text-xs">My Turnover</div>
          <div className="text-white font-extrabold text-lg">{data.my_turnover}</div>
        </div>
        <button className="bg-brand text-black font-extrabold text-sm px-5 py-2 rounded-lg cursor-pointer border-none">GO BET</button>
      </div>
    </div>
  );
}
