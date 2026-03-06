import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/user';

interface ChangePasswordFormProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function ChangePasswordForm({ onToast }: ChangePasswordFormProps) {
  const user = useAuthStore((s) => s.user);
  const updateToken = useAuthStore((s) => s.updateToken);
  const hasPassword = user?.has_password !== false;

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: string, val: string) => {
    if (field === 'current' && hasPassword && !val) return 'Current password is required';
    if (field === 'new') {
      if (val.length < 6) return 'Password must be at least 6 characters';
      if (!/[a-zA-Z]/.test(val) || !/[0-9]/.test(val)) return 'Must contain letters and numbers';
    }
    if (field === 'confirm' && val !== newPwd) return 'Passwords do not match';
    return '';
  };

  const handleBlur = (field: string, val: string) => {
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (hasPassword) errs.current = validateField('current', currentPwd);
    errs.new = validateField('new', newPwd);
    errs.confirm = validateField('confirm', confirmPwd);

    const hasError = Object.values(errs).some(Boolean);
    setErrors(errs);
    if (hasError) return;

    setSubmitting(true);
    try {
      const res = await userApi.changePassword({
        ...(hasPassword ? { current_password: currentPwd } : {}),
        new_password: newPwd,
        confirm_password: confirmPwd,
      });
      if (res.code !== 0) {
        // Server error -- show on appropriate field
        if (res.message?.toLowerCase().includes('current')) {
          setErrors({ current: res.message });
        } else {
          onToast(res.message || 'Failed to update password', 'error');
        }
        return;
      }
      updateToken(res.data.token);
      onToast('Password updated successfully', 'success');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setErrors({});
    } catch {
      onToast('Failed to update password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const EyeButton = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
    >
      {show ? (
        <svg className="w-5 h-5 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bg-bg-card rounded-lg p-4 mx-4 mb-3">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-txt-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-sm font-semibold text-txt-secondary uppercase tracking-wide">Change Password</span>
      </div>

      {/* Current Password (hidden for Google-only users) */}
      {hasPassword && (
        <div className="mb-3">
          <label className="block text-xs text-txt-secondary mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              onBlur={() => handleBlur('current', currentPwd)}
              placeholder="Enter current password"
              className="w-full h-12 px-3 pr-10 rounded-lg text-sm text-white bg-bg-input border outline-none"
              style={{ borderColor: errors.current ? '#FF4757' : '#3A4142' }}
            />
            <EyeButton show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
          </div>
          {errors.current && <p className="text-xs text-error mt-1">{errors.current}</p>}
        </div>
      )}

      {/* New Password */}
      <div className="mb-3">
        <label className="block text-xs text-txt-secondary mb-1.5">New Password</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            onBlur={() => handleBlur('new', newPwd)}
            placeholder="Enter new password"
            className="w-full h-12 px-3 pr-10 rounded-lg text-sm text-white bg-bg-input border outline-none"
            style={{ borderColor: errors.new ? '#FF4757' : '#3A4142' }}
          />
          <EyeButton show={showNew} toggle={() => setShowNew(!showNew)} />
        </div>
        {errors.new && <p className="text-xs text-error mt-1">{errors.new}</p>}
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="block text-xs text-txt-secondary mb-1.5">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            onBlur={() => handleBlur('confirm', confirmPwd)}
            placeholder="Confirm new password"
            className="w-full h-12 px-3 pr-10 rounded-lg text-sm text-white bg-bg-input border outline-none"
            style={{ borderColor: errors.confirm ? '#FF4757' : '#3A4142' }}
          />
          <EyeButton show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
        </div>
        {errors.confirm && <p className="text-xs text-error mt-1">{errors.confirm}</p>}
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-12 rounded-lg border-none text-black text-base font-extrabold cursor-pointer"
        style={{
          background: 'linear-gradient(90deg, #24EE89, #9FE871)',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          'Update Password'
        )}
      </button>
    </div>
  );
}
