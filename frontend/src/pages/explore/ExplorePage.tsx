import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import CategoryTabs from './components/CategoryTabs';
import ProviderFilter from './components/ProviderFilter';
import GameSearchBar from './components/GameSearchBar';
import GameGrid from './components/GameGrid';
import ProviderLogos from './components/ProviderLogos';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetchCategories = useGameStore((s) => s.fetchCategories);
  const fetchProviders = useGameStore((s) => s.fetchProviders);
  const fetchGames = useGameStore((s) => s.fetchGames);
  const setFilter = useGameStore((s) => s.setFilter);
  const initialized = useGameStore((s) => s.initialized);

  // Initialize data on mount
  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, [fetchCategories, fetchProviders]);

  // Handle initial category from URL params (e.g., from homepage "See All")
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilter('category', category);
    } else if (!initialized) {
      fetchGames();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div
        className="flex items-center justify-center sticky top-0 z-50 shrink-0"
        style={{ height: '56px', padding: '0 16px', position: 'relative', background: '#232626' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 bg-transparent border-none text-white cursor-pointer p-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[16px] font-extrabold text-white">ALL GAMES</span>
        <button className="absolute right-4 bg-transparent border-none text-brand cursor-pointer p-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className="px-4 pb-20 flex-1">
        <GameSearchBar />
        <CategoryTabs />
        <ProviderFilter />
        <GameGrid />
        <ProviderLogos />
      </div>
    </div>
  );
}
