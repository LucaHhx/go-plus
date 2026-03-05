import { useState, forwardRef } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { value, onChange, error, placeholder = 'Password ( 6-16 digits )', disabled },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <div
          className="flex items-center rounded-lg transition-colors duration-200"
          style={{
            background: '#1E2121',
            border: `1px solid ${error ? '#FF4757' : '#3A4142'}`,
            borderRadius: '8px',
            height: '48px',
            padding: '0 12px',
            transition: 'border-color 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocusCapture={(e) => {
            if (!error) {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#24EE89';
            }
          }}
          onBlurCapture={(e) => {
            if (!error) {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#3A4142';
            }
          }}
        >
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={16}
            disabled={disabled}
            className="flex-1 min-w-0"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '14px',
              height: '100%',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex-shrink-0"
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7070',
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '20px', height: '20px' }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '20px', height: '20px' }}
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <p style={{ color: '#FF4757', fontSize: '12px', marginTop: '4px', paddingLeft: '2px' }}>{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
