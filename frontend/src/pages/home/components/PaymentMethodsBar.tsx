import type { PaymentIcon } from '@/types';

function UsdtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <circle cx="12" cy="12" r="12" fill="#26A17B" />
      <path
        d="M13.4 12.36v-.01c-.08.01-.5.03-1.42.03-.73 0-1.25-.02-1.43-.03v.01c-2.81-.12-4.9-.63-4.9-1.22 0-.6 2.09-1.1 4.9-1.23V12c.18.01.71.05 1.44.05.87 0 1.33-.03 1.41-.05v-2.09c2.8.13 4.89.63 4.89 1.23 0 .59-2.09 1.1-4.89 1.22zm0-2.64V7.89h3.97V5.5H6.66v2.39h3.97v1.83c-3.17.15-5.55.78-5.55 1.55 0 .76 2.38 1.4 5.55 1.54v5.52h2.77v-5.52c3.16-.14 5.53-.78 5.53-1.54 0-.77-2.37-1.4-5.53-1.55z"
        fill="#fff"
      />
    </svg>
  );
}

const paymentLabels: Record<string, { text: string; color: string } | { spans: { text: string; color: string }[] }> = {
  upi: { text: 'UPI', color: '#fff' },
  paytm: { text: 'Paytm', color: '#00BAF2' },
  phonepe: { text: 'PhonePe', color: '#5F259F' },
  gpay: { spans: [
    { text: 'G', color: '#4285F4' },
    { text: 'P', color: '#EA4335' },
    { text: 'a', color: '#FBBC04' },
    { text: 'y', color: '#34A853' },
  ]},
  imps: { text: 'IMPS', color: '#fff' },
};

interface Props {
  methods: PaymentIcon[];
}

export default function PaymentMethodsBar({ methods }: Props) {
  if (methods.length === 0) return null;

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-center gap-4 py-3 rounded-lg" style={{ background: '#323738' }}>
        {methods.map((method) => {
          const key = method.icon_url.toLowerCase();

          if (key === 'usdt') {
            return <UsdtIcon key={method.name} />;
          }

          const label = paymentLabels[key];
          if (!label) {
            return (
              <span key={method.name} className="text-white text-sm font-bold">{method.name}</span>
            );
          }

          if ('spans' in label) {
            return (
              <span key={method.name} className="text-sm font-bold">
                {label.spans.map((s, i) => (
                  <span key={i} style={{ color: s.color }}>{s.text}</span>
                ))}
              </span>
            );
          }

          return (
            <span key={method.name} className="text-sm font-bold" style={{ color: label.color }}>
              {label.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
