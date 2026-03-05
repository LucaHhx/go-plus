import { useGameStore } from '@/stores/gameStore';

const defaultProviders = [
  { name: 'JILI', slug: 'jili' },
  { name: 'Spribe', slug: 'spribe' },
  { name: 'JDB', slug: 'jdb' },
  { name: 'Evolution', slug: 'evolution' },
  { name: 'iNOUT', slug: 'inout' },
  { name: 'HACKSAW\nGAMING', slug: 'hacksaw' },
  { name: 'PG', slug: 'pg' },
  { name: 'Playtech', slug: 'playtech' },
  { name: 'Turbo\nGames', slug: 'turbogames' },
  { name: 'MG', slug: 'mg' },
  { name: 'HABANERO', slug: 'habanero' },
  { name: 'SA\nGAMING', slug: 'sa-gaming' },
  { name: 'NETENT', slug: 'netent' },
  { name: 'NOLIMIT\nCITY', slug: 'nolimit-city' },
  { name: 'RED\nTIGER', slug: 'red-tiger' },
  { name: 'Big Time\nGaming', slug: 'big-time-gaming' },
  { name: 'TAP-A-\nROO', slug: 'tap-a-roo' },
  { name: 'Ezugi', slug: 'ezugi' },
  { name: 'EENI', slug: 'eeni' },
];

export default function ProviderLogos() {
  const providers = useGameStore((s) => s.providers);
  const setFilter = useGameStore((s) => s.setFilter);

  const displayProviders = providers.length > 0
    ? providers.map((p) => ({ name: p.name, slug: p.slug }))
    : defaultProviders;

  const handleClick = (slug: string) => {
    setFilter('provider', slug);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-6">
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#B0B3B3',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '16px 0 8px',
        }}
      >
        Game Providers
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {displayProviders.map((p) => (
          <div
            key={p.slug}
            onClick={() => handleClick(p.slug)}
            className="flex items-center justify-center cursor-pointer"
            style={{
              background: '#2A2D2D',
              borderRadius: '8px',
              padding: '10px 8px',
              minHeight: '44px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#323738')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2A2D2D')}
          >
            <span
              className="text-center leading-[1.2]"
              style={{ fontSize: '10px', fontWeight: 600, color: '#B0B3B3', whiteSpace: 'pre-line' }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
