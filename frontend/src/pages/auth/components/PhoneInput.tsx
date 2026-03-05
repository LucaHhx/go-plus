import { forwardRef } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, placeholder = 'Phone Number', disabled }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
      onChange(raw);
    };

    return (
      <div>
        <div
          className="form-input-container flex items-center rounded-lg transition-colors duration-200"
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
          <span
            className="whitespace-nowrap flex items-center"
            style={{
              color: '#B0B3B3',
              fontSize: '14px',
              fontWeight: 600,
              marginRight: '12px',
              paddingRight: '12px',
              borderRight: '1px solid #3A4142',
              height: '24px',
            }}
          >
            +91
          </span>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
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
        </div>
        {error && (
          <p style={{ color: '#FF4757', fontSize: '12px', marginTop: '4px', paddingLeft: '2px' }}>{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
