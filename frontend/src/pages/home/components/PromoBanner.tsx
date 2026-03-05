import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <div
      className="mx-4 mt-3 rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #1a5c2e 0%, #0d3a1a 100%)', position: 'relative' }}
    >
      <div className="flex items-center p-3">
        <div className="flex-1">
          <div className="text-white/70 text-xs">Secure and Fast</div>
          <div className="text-white font-extrabold text-lg leading-tight mt-1">Sign Up & Get</div>
          <div className="text-white font-extrabold text-2xl leading-tight">100 Bonuses</div>
          <Link
            to="/register"
            className="mt-2 inline-flex items-center bg-brand text-black font-extrabold text-xs px-4 py-1.5 rounded-md no-underline"
          >
            Join Now
          </Link>
        </div>
        <div className="w-32 h-24 flex-shrink-0">
          <img
            src="https://1goplus.com/png/login-fWVrBuNX.png"
            alt="bonus"
            className="w-full h-full object-contain"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}
