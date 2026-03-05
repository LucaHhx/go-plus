import { useState, useEffect, useCallback, forwardRef } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendOTP: () => Promise<void>;
  error?: string;
  disabled?: boolean;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, onSendOTP, error, disabled }, ref) => {
    const [countdown, setCountdown] = useState(0);
    const [sending, setSending] = useState(false);

    useEffect(() => {
      if (countdown <= 0) return;
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }, [countdown]);

    const handleSendOTP = useCallback(async () => {
      if (countdown > 0 || sending || disabled) return;
      setSending(true);
      try {
        await onSendOTP();
        setCountdown(60);
      } catch {
        // Error handling is done in the parent
      } finally {
        setSending(false);
      }
    }, [countdown, sending, disabled, onSendOTP]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
      onChange(raw);
    };

    const isDisabledBtn = countdown > 0 || sending || disabled;

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
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="OTP"
            maxLength={6}
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
            onClick={handleSendOTP}
            disabled={isDisabledBtn}
            style={{
              color: isDisabledBtn ? '#6B7070' : '#24EE89',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isDisabledBtn ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              background: 'transparent',
              border: 'none',
              padding: '0 4px',
            }}
          >
            {sending
              ? 'Sending...'
              : countdown > 0
                ? `${countdown}s`
                : 'Send OTP'}
          </button>
        </div>
        {error && (
          <p style={{ color: '#FF4757', fontSize: '12px', marginTop: '4px', paddingLeft: '2px' }}>{error}</p>
        )}
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput';

export default OTPInput;
