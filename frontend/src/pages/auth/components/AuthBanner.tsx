interface AuthBannerProps {
  variant: 'signup' | 'signin';
}

/* SVG decoration placeholder - matches merge.html's wheel/coins graphic */
function SignUpDecoration() {
  return (
    <div className="flex-shrink-0" style={{ width: '140px', height: '110px', position: 'relative' }}>
      <img
        src="/assets/decorations/auth-banner-bg.png"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: 1 }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.5 }}>
        <circle cx="80" cy="50" r="44" stroke="#24EE89" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5"/>
        <circle cx="80" cy="50" r="30" stroke="#9FE871" strokeWidth="1" opacity="0.4"/>
        <circle cx="80" cy="50" r="16" fill="url(#glow1)" opacity="0.3"/>
        <line x1="80" y1="6" x2="80" y2="20" stroke="#24EE89" strokeWidth="1" opacity="0.3"/>
        <line x1="80" y1="80" x2="80" y2="94" stroke="#24EE89" strokeWidth="1" opacity="0.3"/>
        <line x1="36" y1="50" x2="50" y2="50" stroke="#24EE89" strokeWidth="1" opacity="0.3"/>
        <line x1="110" y1="50" x2="124" y2="50" stroke="#24EE89" strokeWidth="1" opacity="0.3"/>
        <circle cx="30" cy="25" r="8" fill="#B8860B" opacity="0.4"/>
        <circle cx="26" cy="85" r="6" fill="#DAA520" opacity="0.3"/>
        <circle cx="125" cy="80" r="7" fill="#B8860B" opacity="0.35"/>
        <text x="30" y="28" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold" opacity="0.6">$</text>
        <text x="26" y="88" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="bold" opacity="0.5">$</text>
        <defs>
          <radialGradient id="glow1" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#24EE89" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#24EE89" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function SignInDecoration() {
  return (
    <div className="flex-shrink-0" style={{ width: '110px', height: '80px', position: 'relative' }}>
      <img
        src="/assets/decorations/auth-banner-bg.png"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0, zIndex: 1 }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <svg viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.5 }}>
        <circle cx="60" cy="40" r="32" stroke="#24EE89" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5"/>
        <circle cx="60" cy="40" r="20" stroke="#9FE871" strokeWidth="1" opacity="0.4"/>
        <circle cx="60" cy="40" r="10" fill="#24EE89" opacity="0.15"/>
        <circle cx="18" cy="20" r="6" fill="#B8860B" opacity="0.4"/>
        <circle cx="95" cy="60" r="5" fill="#DAA520" opacity="0.35"/>
      </svg>
    </div>
  );
}

export default function AuthBanner({ variant }: AuthBannerProps) {
  const isSignUp = variant === 'signup';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        padding: isSignUp ? '16px 16px 32px' : '16px 16px 24px',
        background: 'linear-gradient(180deg, #1a3a1e 0%, #0d2a12 40%, #232626 100%)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p style={{ color: '#B0B3B3', fontSize: '12px', fontWeight: 400 }}>Secure and Fast</p>
          {isSignUp ? (
            <>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', lineHeight: 1.2, marginTop: '4px' }}>
                Sign Up &amp; Get
              </h1>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '32px', lineHeight: 1.1, marginTop: '2px' }}>
                100 Bonuses
              </p>
            </>
          ) : (
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', lineHeight: 1.2, marginTop: '4px' }}>
              Welcome Back
            </h1>
          )}
        </div>
        {isSignUp ? <SignUpDecoration /> : <SignInDecoration />}
      </div>
    </div>
  );
}
