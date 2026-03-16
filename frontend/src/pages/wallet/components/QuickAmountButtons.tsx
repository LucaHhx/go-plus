const QUICK_AMOUNTS = [10000, 50000, 100000, 500000];

interface QuickAmountButtonsProps {
  selected: number | null;
  onSelect: (amount: number) => void;
}

export default function QuickAmountButtons({ selected, onSelect }: QuickAmountButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK_AMOUNTS.map((amount) => {
        const isActive = selected === amount;
        return (
          <button
            key={amount}
            type="button"
            onClick={() => onSelect(amount)}
            className={`h-10 rounded-lg text-sm cursor-pointer transition-colors ${
              isActive
                ? 'bg-brand text-bg-deep font-bold'
                : 'bg-bg-card border border-divider text-txt-secondary font-semibold hover:bg-bg-hover hover:text-txt'
            }`}
          >
            Rp{amount.toLocaleString('id-ID')}
          </button>
        );
      })}
    </div>
  );
}
