import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function ProviderFilter() {
  const providers = useGameStore((s) => s.providers);
  const currentProvider = useGameStore((s) => s.filters.provider);
  const currentCategory = useGameStore((s) => s.filters.category);
  const setFilter = useGameStore((s) => s.setFilter);

  const [typeOpen, setTypeOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
        setProviderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Category options for Type dropdown (the 6 game categories)
  const typeOptions = [
    { slug: null, label: 'ALL' },
    { slug: 'slots', label: 'Slots' },
    { slug: 'live', label: 'Live' },
    { slug: 'crash', label: 'Crash' },
    { slug: 'table-game', label: 'Table Game' },
    { slug: 'fishing', label: 'Fishing' },
    { slug: 'lotto', label: 'Lotto' },
  ];

  const currentTypeName = typeOptions.find((t) => t.slug === currentCategory)?.label || 'ALL';
  const currentProviderName = providers.find((p) => p.slug === currentProvider)?.name || 'ALL';

  const chevron = (
    <svg className="w-3 h-3 ml-auto text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  return (
    <div className="flex gap-2 mt-3">
      {/* Type selector */}
      <div ref={typeRef} className="relative flex-1">
        <div
          onClick={() => { setTypeOpen(!typeOpen); setProviderOpen(false); }}
          className="flex items-center gap-1 cursor-pointer"
          style={{
            padding: '8px 12px',
            border: '1px solid #3A4142',
            borderRadius: '8px',
            background: 'transparent',
            fontSize: '12px',
          }}
        >
          <span className="text-txt-secondary">Type:</span>
          <span className="text-white font-semibold">{currentTypeName}</span>
          {chevron}
        </div>
        {typeOpen && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-[8px] overflow-hidden"
            style={{ background: '#2A2D2D', border: '1px solid #3A4142', maxHeight: '200px', overflowY: 'auto' }}
          >
            {typeOptions.map((opt) => (
              <div
                key={opt.slug ?? 'all'}
                onClick={() => {
                  setFilter('category', opt.slug);
                  setTypeOpen(false);
                }}
                className="cursor-pointer"
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: currentCategory === opt.slug ? '#fff' : '#B0B3B3',
                  background: currentCategory === opt.slug ? '#3A4142' : 'transparent',
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provider selector */}
      <div ref={providerRef} className="relative flex-1">
        <div
          onClick={() => { setProviderOpen(!providerOpen); setTypeOpen(false); }}
          className="flex items-center gap-1 cursor-pointer"
          style={{
            padding: '8px 12px',
            border: '1px solid #3A4142',
            borderRadius: '8px',
            background: 'transparent',
            fontSize: '12px',
          }}
        >
          <span className="text-txt-secondary">Providers:</span>
          <span className="text-white font-semibold truncate">{currentProviderName}</span>
          {chevron}
        </div>
        {providerOpen && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 rounded-[8px] overflow-hidden"
            style={{ background: '#2A2D2D', border: '1px solid #3A4142', maxHeight: '250px', overflowY: 'auto' }}
          >
            <div
              onClick={() => {
                setFilter('provider', null);
                setProviderOpen(false);
              }}
              className="cursor-pointer"
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                color: !currentProvider ? '#fff' : '#B0B3B3',
                background: !currentProvider ? '#3A4142' : 'transparent',
              }}
            >
              ALL
            </div>
            {providers.map((p) => (
              <div
                key={p.slug}
                onClick={() => {
                  setFilter('provider', p.slug);
                  setProviderOpen(false);
                }}
                className="cursor-pointer"
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: currentProvider === p.slug ? '#fff' : '#B0B3B3',
                  background: currentProvider === p.slug ? '#3A4142' : 'transparent',
                }}
              >
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
