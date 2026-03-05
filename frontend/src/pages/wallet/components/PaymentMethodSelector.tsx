import type { PaymentMethod } from '@/types';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selected: string;
  onSelect: (code: string) => void;
}

const LOGO_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  upi: { bg: 'bg-white', text: 'text-blue-800 font-bold text-xs', label: 'UPI' },
  paytm: { bg: 'bg-[#00BAF2]', text: 'text-white font-bold text-xs', label: 'Pay' },
  gpay: { bg: 'bg-white', text: 'font-bold text-xs', label: '' },
  amazon_pay: { bg: 'bg-[#FF9900]', text: 'text-white font-bold text-xs', label: 'AMZ' },
};

function PaymentLogo({ code }: { code: string }) {
  const style = LOGO_STYLES[code];
  if (!style) {
    return (
      <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center flex-shrink-0">
        <span className="text-txt-muted text-xs font-bold">{code.toUpperCase().slice(0, 3)}</span>
      </div>
    );
  }

  if (code === 'gpay') {
    return (
      <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
        <span className="font-bold text-xs">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">P</span>
          <span className="text-yellow-500">a</span>
          <span className="text-green-500">y</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
      <span className={style.text}>{style.label}</span>
    </div>
  );
}

export default function PaymentMethodSelector({ methods, selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((method) => {
        const isActive = selected === method.code;
        return (
          <div
            key={method.id}
            onClick={() => onSelect(method.code)}
            className={`flex items-center gap-3 bg-bg-card border-2 rounded-lg px-3 py-3 cursor-pointer transition-colors ${
              isActive ? 'border-brand' : 'border-divider hover:border-brand/50'
            }`}
          >
            <PaymentLogo code={method.code} />
            <span className="text-txt text-sm font-semibold">{method.name}</span>
          </div>
        );
      })}
    </div>
  );
}
