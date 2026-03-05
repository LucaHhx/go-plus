import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 flex items-center"
      style={{
        height: '56px',
        background: 'rgba(50, 55, 56, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '0 16px',
      }}
    >
      <Link to="/" className="flex items-center gap-1 no-underline">
        {!logoFailed ? (
          <img
            src="/assets/brand/logo.png"
            alt="GO PLUS"
            className="h-8 w-auto"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <div className="flex items-center">
            <span style={{ color: '#24EE89', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>1GO</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>.</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>PLUS</span>
          </div>
        )}
      </Link>
      <div className="flex-1" />
      <Link
        to="/login"
        className="flex items-center no-underline"
        style={{
          color: '#fff',
          fontWeight: 800,
          fontSize: '15px',
          background: 'transparent',
          border: 'none',
          padding: '0 12px',
          height: '40px',
          cursor: 'pointer',
        }}
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="flex items-center no-underline"
        style={{
          height: '40px',
          padding: '0 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: '15px',
          background: 'linear-gradient(90deg, #24EE89, #9FE871)',
          color: '#000',
        }}
      >
        Sign Up
      </Link>
    </header>
  );
}
