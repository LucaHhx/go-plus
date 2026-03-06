import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import ConfirmDialog from './ConfirmDialog';

export default function LogoutButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore -- still logout locally
    }
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="w-full h-12 rounded-lg flex items-center justify-center gap-2 cursor-pointer border-none"
        style={{ background: 'rgba(255, 71, 87, 0.1)' }}
      >
        <svg className="w-[18px] h-[18px] text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="text-sm font-semibold text-error">Logout</span>
      </button>

      <ConfirmDialog
        open={showDialog}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        onCancel={() => setShowDialog(false)}
        onConfirm={handleLogout}
        loading={loading}
      />
    </>
  );
}
