import type { Transaction } from '@/types';

const TYPE_CONFIG: Record<string, {
  iconBg: string;
  iconColor: string;
  amountColor: string;
  prefix: string;
  icon: React.ReactNode;
}> = {
  deposit: {
    iconBg: 'bg-brand/15',
    iconColor: 'text-brand',
    amountColor: 'text-brand',
    prefix: '+',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  withdrawal: {
    iconBg: 'bg-error/15',
    iconColor: 'text-error',
    amountColor: 'text-error',
    prefix: '-',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  bet: {
    iconBg: 'bg-bg-hover',
    iconColor: 'text-txt-muted',
    amountColor: 'text-txt-secondary',
    prefix: '-',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  win: {
    iconBg: 'bg-brand/15',
    iconColor: 'text-brand',
    amountColor: 'text-brand',
    prefix: '+',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  cashback: {
    iconBg: 'bg-brand/15',
    iconColor: 'text-brand',
    amountColor: 'text-brand',
    prefix: '+',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  bonus: {
    iconBg: 'bg-brand/15',
    iconColor: 'text-brand',
    amountColor: 'text-brand',
    prefix: '+',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-brand/15 text-brand',
  pending: 'bg-warning/15 text-warning',
  processing: 'bg-warning/15 text-warning',
  failed: 'bg-error/15 text-error',
  rejected: 'bg-error/15 text-error',
};

function getTransactionTitle(tx: Transaction): string {
  const method = tx.payment_method ? tx.payment_method.toUpperCase() : '';
  switch (tx.type) {
    case 'deposit':
      return method ? `${method} Deposit` : 'Deposit';
    case 'withdrawal':
      return method ? `${method} Withdrawal` : 'Withdrawal';
    case 'bet':
      return tx.remark || 'Bet';
    case 'win':
      return tx.remark || 'Win';
    case 'cashback':
      return 'Cashback';
    case 'bonus':
      return tx.remark || 'Bonus';
    default:
      return tx.type;
  }
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getStatusLabel(tx: Transaction): string | null {
  if (tx.type === 'bonus' || tx.type === 'cashback') return 'Bonus';
  if (tx.type === 'bet' || tx.type === 'win') return null;
  if (tx.status === 'completed') return 'Completed';
  if (tx.status === 'pending' || tx.status === 'processing') return 'Pending';
  if (tx.status === 'rejected') return 'Rejected';
  if (tx.status === 'failed') return 'Failed';
  return null;
}

function getStatusStyle(tx: Transaction): string {
  if (tx.type === 'bonus' || tx.type === 'cashback') return STATUS_STYLES.completed;
  return STATUS_STYLES[tx.status] || STATUS_STYLES.completed;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction: tx }: TransactionCardProps) {
  const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.deposit;
  const statusLabel = getStatusLabel(tx);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-divider/50">
      <div className={`w-9 h-9 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0 ${config.iconColor}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-txt text-sm font-semibold">{getTransactionTitle(tx)}</p>
        <p className="text-txt-muted text-xs">{formatTime(tx.created_at)}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`${config.amountColor} text-sm font-bold`}>
          {config.prefix}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        {statusLabel && (
          <span className={`inline-block ${getStatusStyle(tx)} text-[10px] font-bold px-1.5 py-0.5 rounded`}>
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}
