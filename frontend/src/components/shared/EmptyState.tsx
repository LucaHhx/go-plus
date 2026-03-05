interface EmptyStateProps {
  variant: 'favorites' | 'recent' | 'search';
}

const config = {
  favorites: {
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'No favourite games yet',
    subtitle: 'Browse games to add favourites',
  },
  recent: {
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'No recently played games',
    subtitle: 'Start playing to see your history here',
  },
  search: {
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: 'No games found',
    subtitle: 'Try a different search term',
  },
};

export default function EmptyState({ variant }: EmptyStateProps) {
  const { icon, title, subtitle } = config[variant];

  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: '48px 16px', gap: '12px' }}>
      <div className="text-txt-muted">{icon}</div>
      <div className="text-[16px] font-semibold text-txt-secondary">{title}</div>
      <div className="text-[13px] text-txt-muted text-center">{subtitle}</div>
    </div>
  );
}
