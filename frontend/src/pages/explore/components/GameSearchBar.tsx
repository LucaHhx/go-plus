import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function GameSearchBar() {
  const setFilter = useGameStore((s) => s.setFilter);
  const currentSearch = useGameStore((s) => s.filters.search);
  const [value, setValue] = useState(currentSearch);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync external search state to local input
  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 300ms debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter('search', newValue || '');
    }, 300);
  };

  const handleClear = () => {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilter('search', '');
  };

  return (
    <div
      className="flex items-center gap-2 mt-3"
      style={{
        background: '#1E2020',
        border: `1px solid ${focused ? '#24EE89' : '#3A4142'}`,
        borderRadius: '8px',
        height: '44px',
        padding: '0 12px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Search icon */}
      <svg className="w-5 h-5 text-txt-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>

      {/* Input */}
      <input
        type="text"
        placeholder="Search games"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent border-none outline-none text-white text-[14px]"
      />

      {/* Clear button */}
      {value && (
        <button onClick={handleClear} className="p-1 bg-transparent border-none cursor-pointer">
          <svg className="w-4 h-4 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
