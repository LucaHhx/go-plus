import type { PaymentIcon } from '@/types';

// Inline SVG components for payment icons (keyed by backend icon_url identifier)
function UpiIcon() {
  return (
    <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <text x="0" y="18" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">UPI</text>
    </svg>
  );
}

function PaytmIcon() {
  return (
    <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <text x="0" y="18" fill="#00BAF2" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">Paytm</text>
    </svg>
  );
}

function PhonePeIcon() {
  return (
    <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <text x="0" y="18" fill="#5F259F" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">PhonePe</text>
    </svg>
  );
}

function GPayIcon() {
  return (
    <svg viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <text x="0" y="18" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">P</tspan>
        <tspan fill="#FBBC04">a</tspan>
        <tspan fill="#34A853">y</tspan>
      </text>
    </svg>
  );
}

function ImpsIcon() {
  return (
    <svg viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <text x="0" y="18" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">IMPS</text>
    </svg>
  );
}

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

const paymentIconMap: Record<string, React.FC> = {
  upi: UpiIcon,
  paytm: PaytmIcon,
  phonepe: PhonePeIcon,
  gpay: GPayIcon,
  imps: ImpsIcon,
  usdt: UsdtIcon,
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
          const iconKey = method.icon_url.toLowerCase();
          const IconComponent = paymentIconMap[iconKey];

          return (
            <div key={method.name} className="flex items-center gap-1.5">
              {IconComponent ? (
                <IconComponent />
              ) : (
                <span className="text-txt-secondary text-xs font-semibold">{method.name}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
