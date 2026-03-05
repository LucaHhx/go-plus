interface GiftSelectorProps {
  selected: 'aviator' | 'money-coming';
  onSelect: (game: 'aviator' | 'money-coming') => void;
  disabled?: boolean;
}

/* Aviator placeholder SVG (matches merge.html) */
function AviatorPlaceholder() {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="60" height="60" fill="#1A1D1D"/>
      <path d="M18 40L30 20L42 40" stroke="#24EE89" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <circle cx="30" cy="28" r="4" fill="#24EE89" opacity="0.35"/>
      <path d="M22 35h16" stroke="#24EE89" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

/* MoneyComing placeholder SVG (matches merge.html) */
function MoneyComingPlaceholder() {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="60" height="60" fill="#1A1D1D"/>
      <circle cx="30" cy="30" r="12" stroke="#9FE871" strokeWidth="2" opacity="0.5"/>
      <text x="30" y="35" textAnchor="middle" fill="#9FE871" fontSize="16" fontWeight="bold" opacity="0.4">$</text>
    </svg>
  );
}

function GiftCard({
  game,
  isSelected,
  onSelect,
  disabled,
}: {
  game: 'aviator' | 'money-coming';
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const isAviator = game === 'aviator';
  const imgSrc = isAviator ? '/assets/games/aviator.jpg' : '/assets/games/money-coming.jpg';
  const label = isAviator ? 'Aviator FS' : 'MoneyComing FS';

  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className="gift-card"
      style={{
        background: '#323738',
        borderRadius: '8px',
        padding: '10px 8px 8px',
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        border: `2px solid ${isSelected ? '#24EE89' : 'transparent'}`,
        flex: 1,
        minWidth: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Thumbnail 60x60 */}
      <div
        style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 6px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#1A1D1D',
          position: 'relative',
        }}
      >
        {/* SVG fallback layer (always rendered, behind img) */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {isAviator ? <AviatorPlaceholder /> : <MoneyComingPlaceholder />}
        </div>
        {/* Real image on top (hides SVG when loaded) */}
        <img
          src={imgSrc}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1 }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div style={{ color: '#24EE89', fontSize: '14px', fontWeight: 800 }}>x100</div>
      <div style={{ color: '#B0B3B3', fontSize: '10px', marginTop: '2px' }}>{label}</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: '4px',
          padding: '2px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 700,
          background: isSelected ? '#24EE89' : '#3A4142',
          color: isSelected ? '#000' : '#6B7070',
        }}
      >
        {isSelected ? 'Active' : 'Apply'}
      </div>
    </div>
  );
}

export default function GiftSelector({ selected, onSelect, disabled }: GiftSelectorProps) {
  return (
    <div style={{ marginTop: '16px' }}>
      <p style={{ color: '#B0B3B3', fontSize: '14px', marginBottom: '8px' }}>
        Select your sign up gift
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <GiftCard
          game="aviator"
          isSelected={selected === 'aviator'}
          onSelect={() => onSelect('aviator')}
          disabled={disabled}
        />
        <GiftCard
          game="money-coming"
          isSelected={selected === 'money-coming'}
          onSelect={() => onSelect('money-coming')}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
