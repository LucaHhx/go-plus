interface StatusBadgeProps {
  status: string;
  map?: Record<string, { color: string; label: string }>;
}

const defaultMap: Record<string, { color: string; label: string }> = {
  active: { color: 'accent', label: 'Active' },
  disabled: { color: 'danger', label: 'Disabled' },
  pending: { color: 'warn', label: 'Pending' },
  approved: { color: 'accent', label: 'Approved' },
  rejected: { color: 'danger', label: 'Rejected' },
  completed: { color: 'accent', label: 'Completed' },
  failed: { color: 'danger', label: 'Failed' },
  live: { color: 'accent', label: 'Live' },
  offline: { color: 'muted', label: 'Offline' },
};

export default function StatusBadge({ status, map }: StatusBadgeProps) {
  const lookup = map || defaultMap;
  const cfg = lookup[status.toLowerCase()] || { color: 'muted', label: status };

  const colorMap: Record<string, { bg: string; text: string }> = {
    accent: { bg: 'rgba(36,238,137,0.12)', text: '#24EE89' },
    danger: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
    warn: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    muted: { bg: 'rgba(100,116,139,0.12)', text: '#64748b' },
  };

  const c = colorMap[cfg.color] || colorMap.muted;

  return (
    <span
      className="status-badge"
      style={{ background: c.bg, color: c.text }}
    >
      {cfg.label}
    </span>
  );
}
