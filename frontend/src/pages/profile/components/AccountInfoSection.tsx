import { useAuthStore } from '@/stores/authStore';

/** Format phone: +62****7890 */
function maskPhone(phone: string) {
  if (!phone) return '-';
  // Remove +62 prefix, mask middle digits
  const digits = phone.replace(/^\+62/, '');
  if (digits.length <= 4) return phone;
  return `+62${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return dateStr.split('T')[0];
}

export default function AccountInfoSection() {
  const user = useAuthStore((s) => s.user);

  const rows = [
    { label: 'Phone', value: maskPhone(user?.phone || '') },
    { label: 'Registered', value: formatDate(user?.created_at || '') },
    { label: 'VIP Level', value: 'VIP 0', icon: true },
  ];

  return (
    <div className="bg-bg-card rounded-lg p-4 mx-4 mb-3">
      <div className="text-sm font-semibold text-txt-secondary uppercase tracking-wide mb-1">
        Account Info
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="flex items-center justify-between py-3.5"
          style={i < rows.length - 1 ? { borderBottom: '1px solid rgba(58, 65, 66, 0.5)' } : undefined}
        >
          <span className="text-sm text-txt-secondary">{row.label}</span>
          <span className="text-sm text-white font-medium flex items-center gap-1">
            {row.icon && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
