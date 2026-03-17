import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullScreenLayout from '@/components/layout/FullScreenLayout';
import AuthHeader from './components/AuthHeader';
import AuthBanner from './components/AuthBanner';
import PhoneInput from './components/PhoneInput';
import PasswordInput from './components/PasswordInput';
import OTPInput from './components/OTPInput';
import GoogleLoginButton from './components/GoogleLoginButton';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

type LoginMode = 'password' | 'otp';

interface FormErrors {
  phone?: string;
  password?: string;
  otp?: string;
  general?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [mode, setMode] = useState<LoginMode>('password');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
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
      await authApi.sendOTP(phone, 'login');
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
    let passwordError: string | undefined;
    let otpError: string | undefined;

    if (mode === 'password') {
      passwordError = validatePassword(password);
    } else {
      otpError = validateOTP(otp);
    }

    if (phoneError || passwordError || otpError) {
      setErrors({ phone: phoneError, password: passwordError, otp: otpError });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      let res;
      if (mode === 'password') {
        res = await authApi.login(phone, password);
      } else {
        res = await authApi.loginOTP(phone, otp);
      }
      login(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          error.response?.data?.message || 'Login failed. Please try again.',
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

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode);
    setErrors({});
    setPassword('');
    setOtp('');
  };

  return (
    <FullScreenLayout>
      <AuthHeader />
      <AuthBanner variant="signin" />

      {/* Form Section: padding 0 16px */}
      <form onSubmit={handleSubmit} style={{ padding: '0 16px' }}>
        {/* Section title: margin 16px 0 12px */}
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '18px', margin: '16px 0 12px' }}>
          Sign In
        </h2>

        {/* Login Method Tabs - matches merge.html .auth-tabs */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderBottom: '1px solid #3A4142',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => switchMode('password')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${mode === 'password' ? '#24EE89' : 'transparent'}`,
              cursor: 'pointer',
              color: mode === 'password' ? '#24EE89' : '#6B7070',
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => switchMode('otp')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${mode === 'otp' ? '#24EE89' : 'transparent'}`,
              cursor: 'pointer',
              color: mode === 'otp' ? '#24EE89' : '#6B7070',
            }}
          >
            OTP Login
          </button>
        </div>

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

        {/* Phone Number -- always visible */}
        <PhoneInput
          value={phone}
          onChange={(val) => {
            setPhone(val);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          error={errors.phone}
          disabled={submitting}
        />

        {mode === 'password' ? (
          <>
            {/* Password: margin-top 12px */}
            <div style={{ marginTop: '12px' }}>
              <PasswordInput
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                placeholder="Password"
                disabled={submitting}
              />
            </div>
            {/* Forgot Password: margin-top 8px */}
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <span style={{ color: '#24EE89', fontSize: '12px', cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>
          </>
        ) : (
          /* OTP Input: margin-top 12px */
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
        )}

        {/* Sign In Button: margin-top 20px */}
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
              'Sign In'
            )}
          </button>
        </div>

        {/* Google Sign In: margin-top 12px */}
        <div style={{ marginTop: '12px' }}>
          <GoogleLoginButton
            onClick={handleGoogleLogin}
            loading={googleLoading || submitting}
          />
        </div>

        {/* Bottom link: margin-top 16px, padding-bottom 32px */}
        <div style={{ marginTop: '16px', paddingBottom: '32px', textAlign: 'center' }}>
          <span style={{ color: '#B0B3B3', fontSize: '14px' }}>
            Don&apos;t have an account?
          </span>
          <Link
            to="/register"
            style={{
              color: '#24EE89',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '4px',
              textDecoration: 'none',
            }}
          >
            Sign Up
          </Link>
        </div>
      </form>
    </FullScreenLayout>
  );
}
