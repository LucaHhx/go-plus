import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './components/ProfileHeader';
import AvatarUploader from './components/AvatarUploader';
import NicknameEditor from './components/NicknameEditor';
import AccountInfoSection from './components/AccountInfoSection';
import LogoutButton from './components/LogoutButton';
import Toast from './components/Toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  return (
    <div className="min-h-screen bg-bg max-w-[430px] mx-auto relative">
      <ProfileHeader title="Profile" />

      {/* Avatar area */}
      <AvatarUploader onToast={showToast} />

      {/* Nickname */}
      <NicknameEditor onToast={showToast} />

      {/* Account Info */}
      <AccountInfoSection />

      {/* Security Settings nav */}
      <div
        className="bg-bg-card rounded-lg p-4 mx-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-bg-hover transition-colors"
        onClick={() => navigate('/profile/security')}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-txt-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-sm text-white font-medium">Security Settings</span>
        </div>
        <svg className="w-5 h-5 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-6 pb-8">
        <LogoutButton />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
