import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import AuthBanner from './components/AuthBanner';
import PhoneInput from './components/PhoneInput';
import PasswordInput from './components/PasswordInput';
import OTPInput from './components/OTPInput';
import GiftSelector from './components/GiftSelector';
import AgreementCheckbox from './components/AgreementCheckbox';
import GoogleLoginButton from './components/GoogleLoginButton';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

interface FormErrors {
  phone?: string;
  password?: string;
  otp?: string;
  general?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [giftGame, setGiftGame] = useState<'aviator' | 'money-coming'>(
    'aviator'
  );
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validatePhone = (val: string) => {
    if (!val) return 'Phone number is required';
    if (val.length !== 10) return 'Phone number must be 10 digits';
    return undefined;
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 6) return 'Password must be at least 6 characters';
    if (val.length > 16) return 'Password must be at most 16 characters';
    if (!/[a-zA-Z]/.test(val)) return 'Password must contain letters';
    if (!/\d/.test(val)) return 'Password must contain numbers';
    return undefined;
  };

  const validateOTP = (val: string) => {
    if (!val) return 'OTP is required';
    if (val.length !== 6) return 'OTP must be 6 digits';
    return undefined;
  };

  const handleSendOTP = useCallback(async () => {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }
    setErrors((prev) => ({ ...prev, phone: undefined, general: undefined }));
    try {
      await authApi.sendOTP(phone, 'register');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      }));
    }
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    const otpError = validateOTP(otp);

    if (phoneError || passwordError || otpError) {
      setErrors({ phone: phoneError, password: passwordError, otp: otpError });
      return;
    }

    if (!agreeTerms) {
      setErrors({ general: 'Please agree to the User Agreement' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await authApi.register({
        phone,
        password,
        otp,
        gift_game: giftGame,
      });
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await authApi.googleLogin('mock_google_id_token');
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          error.response?.data?.message || 'Google login failed. Please try again.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ background: '#1A1D1D' }}
    >
    <div className="w-full max-w-[430px] min-h-screen" style={{ background: '#232626' }}>
      <AuthHeader />
      <AuthBanner variant="signup" />

      {/* Form Section: padding 0 16px */}
      <form onSubmit={handleSubmit} style={{ padding: '0 16px' }}>
        {/* Section title: margin 16px 0 12px */}
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '18px', margin: '16px 0 12px' }}>
          Sign Up
        </h2>

        {errors.general && (
          <div
            style={{
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
            }}
          >
            <p style={{ color: '#FF4757', fontSize: '12px' }}>{errors.general}</p>
          </div>
        )}

        {/* Phone Number Input */}
        <PhoneInput
          value={phone}
          onChange={(val) => {
            setPhone(val);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          error={errors.phone}
          disabled={submitting}
        />

        {/* Password Input: margin-top 12px */}
        <div style={{ marginTop: '12px' }}>
          <PasswordInput
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            disabled={submitting}
          />
        </div>

        {/* OTP Input: margin-top 12px */}
        <div style={{ marginTop: '12px' }}>
          <OTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
            }}
            onSendOTP={handleSendOTP}
            error={errors.otp}
            disabled={phone.length !== 10}
          />
        </div>

        {/* Gift Selection: margin-top 16px */}
        <GiftSelector selected={giftGame} onSelect={setGiftGame} disabled={submitting} />

        {/* Invite Code: margin-top 12px */}
        <div style={{ marginTop: '12px' }}>
          <div
            className="flex items-center"
            style={{
              background: '#1E2121',
              border: '1px solid #3A4142',
              borderRadius: '8px',
              height: '48px',
              padding: '0 12px',
              transition: 'border-color 0.2s ease',
              opacity: submitting ? 0.6 : 1,
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#24EE89';
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#3A4142';
            }}
          >
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter Invite Code (Optional)"
              disabled={submitting}
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
            <div
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7070',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '16px', height: '16px' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Agreements: margin-top 16px */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AgreementCheckbox
            checked={agreeTerms}
            onChange={setAgreeTerms}
            hasError={!agreeTerms && !!errors.general}
          >
            I agree to the{' '}
            <span style={{ color: '#24EE89', cursor: 'pointer', textDecoration: 'underline' }}>
              User Agreement
            </span>{' '}
            &amp; confirm I am at least 18 years old
          </AgreementCheckbox>
          <AgreementCheckbox
            checked={agreeMarketing}
            onChange={setAgreeMarketing}
          >
            I agree to receive marketing promotions from 1GO.PLUS.
          </AgreementCheckbox>
        </div>

        {/* Sign Up Button: margin-top 20px */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '48px',
              border: 'none',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #24EE89, #9FE871)',
              color: '#000',
              fontSize: '16px',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.5px',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTopColor: '#000',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
            ) : (
              'Sign Up'
            )}
          </button>
        </div>

        {/* Google Sign Up: margin-top 12px */}
        <div style={{ marginTop: '12px' }}>
          <GoogleLoginButton
            onClick={handleGoogleLogin}
            loading={googleLoading || submitting}
          />
        </div>

        {/* Bottom link: margin-top 16px, padding-bottom 32px */}
        <div style={{ marginTop: '16px', paddingBottom: '32px', textAlign: 'center' }}>
          <span style={{ color: '#B0B3B3', fontSize: '14px' }}>
            Already have an account?
          </span>
          <Link
            to="/login"
            style={{
              color: '#24EE89',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '4px',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
}
