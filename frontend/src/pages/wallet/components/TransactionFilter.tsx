const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdraw', value: 'withdrawal' },
  { label: 'Bet', value: 'bet' },
  { label: 'Cashback', value: 'cashback' },
];

interface TransactionFilterProps {
  selected: string;
  onSelect: (value: string) => void;
}

export default function TransactionFilter({ selected, onSelect }: TransactionFilterProps) {
  return (
    <div className="px-4 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 py-3 min-w-max">
        {FILTERS.map((f) => {
          const isActive = selected === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onSelect(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-brand text-bg-deep font-bold'
                  : 'bg-bg-card text-txt-secondary font-semibold hover:bg-bg-hover'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
