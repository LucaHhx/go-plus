import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/user';
import ConfirmDialog from './ConfirmDialog';

interface GoogleBindSectionProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function GoogleBindSection({ onToast }: GoogleBindSectionProps) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const isBound = !!user?.google_email;
  const [loading, setLoading] = useState(false);
  const [showUnbindDialog, setShowUnbindDialog] = useState(false);

  const handleBind = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Google OAuth flow
      const mockIdToken = 'mock-google-id-token';
      const res = await userApi.bindGoogle(mockIdToken);
      if (res.code !== 0) {
        onToast(res.message || 'Failed to bind Google account', 'error');
        return;
      }
      updateUser({ google_email: res.data.google_email });
      onToast('Google account linked', 'success');
    } catch {
      onToast('Failed to bind Google account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnbind = async () => {
    setLoading(true);
    try {
      const res = await userApi.unbindGoogle();
      if (res.code !== 0) {
        // Error code 1015: only login method
        if (res.code === 1015) {
          onToast('Please set a password before unbinding Google', 'error');
        } else {
          onToast(res.message || 'Failed to unbind Google account', 'error');
        }
        setShowUnbindDialog(false);
        return;
      }
      updateUser({ google_email: '' });
      onToast('Google account unlinked', 'success');
      setShowUnbindDialog(false);
    } catch {
      onToast('Failed to unbind Google account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-bg-card rounded-lg p-4 mx-4 mb-3">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.04 10.04 0 001 12c0 1.61.39 3.14 1.07 4.5l3.77-2.41z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-sm font-semibold text-txt-secondary uppercase tracking-wide">Google Account</span>
        </div>

        {isBound ? (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-txt-muted mb-1">Linked to</div>
                <div className="text-sm text-white font-medium">{user?.google_email}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowUnbindDialog(true)}
                disabled={loading}
                className="h-10 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer text-sm font-semibold border bg-transparent"
                style={{ borderColor: '#FF4757', color: '#FF4757', opacity: loading ? 0.5 : 1 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.84 12.25l1.72-1.71a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M5.16 11.75l-1.72 1.71a5 5 0 007.07 7.07l1.72-1.71" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
                Unbind
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-txt-muted mb-1">Status</div>
                <div className="text-sm text-txt-muted">Not linked</div>
              </div>
              <button
                type="button"
                onClick={handleBind}
                disabled={loading}
                className="h-10 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer border-none text-sm font-semibold text-black"
                style={{
                  background: 'linear-gradient(90deg, #24EE89, #9FE871)',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    Bind
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showUnbindDialog}
        title="Unbind Google Account"
        description="Are you sure you want to unbind your Google account? You won't be able to sign in with Google after unbinding."
        confirmText="Unbind"
        onCancel={() => setShowUnbindDialog(false)}
        onConfirm={handleUnbind}
        loading={loading}
      />
    </>
  );
}
