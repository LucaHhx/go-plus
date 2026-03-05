import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function UserBalanceChip() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (!user) return null;

  const totalBalance = (user.balance + user.bonus_balance).toLocaleString(
    'en-IN'
  );

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center h-10 rounded-lg px-3 bg-bg-card border border-divider">
        <span className="text-white text-sm font-semibold">
          ₹{totalBalance}
        </span>
      </div>
      <button
        type="button"
        onClick={() => navigate('/wallet/deposit')}
        className="h-10 px-3 rounded-lg border-none cursor-pointer font-extrabold text-xs flex items-center"
        style={{
          background: 'linear-gradient(90deg, #24EE89, #9FE871)',
          color: '#000',
        }}
      >
        +
      </button>
    </div>
  );
}
