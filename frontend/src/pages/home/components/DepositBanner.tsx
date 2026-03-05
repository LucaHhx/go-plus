import type { PromoBannerData } from '@/types';

interface Props {
  banners: PromoBannerData[];
}

export default function DepositBanner({ banners }: Props) {
  if (banners.length === 0) return null;

  return (
    <div
      className="mx-4 mt-6 rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(90deg, #24EE89 0%, #0d6b32 100%)' }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="text-black font-extrabold text-base">{banners[0].title || '37% First Deposit Cash Back'}</div>
        <button className="bg-black text-brand font-extrabold text-sm px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap border-none">
          Deposit Now
        </button>
      </div>
    </div>
  );
}
