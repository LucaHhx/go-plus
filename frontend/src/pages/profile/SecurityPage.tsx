import { useState, useCallback } from 'react';
import FullScreenLayout from '@/components/layout/FullScreenLayout';
import ProfileHeader from './components/ProfileHeader';
import ChangePasswordForm from './components/ChangePasswordForm';
import GoogleBindSection from './components/GoogleBindSection';
import Toast from './components/Toast';

export default function SecurityPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  return (
    <FullScreenLayout>
      <ProfileHeader title="Security Settings" />

      <div className="pt-4">
        {/* Change Password */}
        <ChangePasswordForm onToast={showToast} />

        {/* Google Account */}
        <GoogleBindSection onToast={showToast} />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </FullScreenLayout>
  );
}
