import { useGameStore } from '@/stores/gameStore';

interface TabConfig {
  slug: string | null;
  label: string;
  icon?: React.ReactNode;
}

const tabs: TabConfig[] = [
  {
    slug: null,
    label: 'All Games',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    slug: 'new',
    label: 'New',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    slug: 'recent',
    label: 'Recent',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    slug: 'favorites',
    label: 'My Fav',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  { slug: 'slots', label: 'Slots' },
  { slug: 'live', label: 'Live' },
  { slug: 'crash', label: 'Crash' },
  { slug: 'table-game', label: 'Table Game' },
  { slug: 'fishing', label: 'Fishing' },
  { slug: 'lotto', label: 'Lotto' },
];

export default function CategoryTabs() {
  const currentCategory = useGameStore((s) => s.filters.category);
  const setFilter = useGameStore((s) => s.setFilter);

  return (
    <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = currentCategory === tab.slug;
        return (
          <button
            key={tab.slug ?? 'all'}
            onClick={() => setFilter('category', tab.slug)}
            className="inline-flex items-center gap-1 whitespace-nowrap border-none cursor-pointer"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              background: isActive ? '#3A4142' : 'transparent',
              color: isActive ? '#fff' : '#B0B3B3',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
