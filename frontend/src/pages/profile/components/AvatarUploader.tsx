import { useRef, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/user';
import AvatarCropModal from './AvatarCropModal';

interface AvatarUploaderProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function AvatarUploader({ onToast }: AvatarUploaderProps) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleCropConfirm = async (blob: Blob) => {
    setUploading(true);
    try {
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const res = await userApi.uploadAvatar(file);
      if (res.code !== 0) {
        onToast(res.message || 'Failed to upload avatar', 'error');
        return;
      }
      updateUser({ avatar_url: res.data.avatar_url });
      onToast('Avatar updated', 'success');
      setCropSrc(null);
    } catch {
      onToast('Failed to upload avatar', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center py-8 px-4">
        {/* Avatar with edit button */}
        <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{ border: '3px solid #24EE89', background: '#323738' }}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-txt-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          {/* Camera edit badge */}
          <div
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: '#24EE89', border: '2px solid #232626' }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        {/* Nickname + join date below avatar */}
        <div className="text-base text-white font-semibold mt-3">{user?.nickname || 'Player'}</div>
        <div className="text-xs text-txt-muted mt-1">
          Joined {user?.created_at ? user.created_at.split('T')[0] : '-'}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onConfirm={handleCropConfirm}
          loading={uploading}
        />
      )}
    </>
  );
}
