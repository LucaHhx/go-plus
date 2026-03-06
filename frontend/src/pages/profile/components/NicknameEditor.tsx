import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/user';

interface NicknameEditorProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export default function NicknameEditor({ onToast }: NicknameEditorProps) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => {
    setValue(user?.nickname || '');
    setError('');
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError('');
  };

  const validate = (v: string) => {
    if (v.length < 2 || v.length > 20) return 'Nickname must be 2-20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Only letters, numbers and underscores allowed';
    return '';
  };

  const save = async () => {
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    try {
      const res = await userApi.updateProfile({ nickname: value });
      if (res.code !== 0) {
        onToast(res.message || 'Failed to update nickname', 'error');
        setSaving(false);
        return;
      }
      updateUser({ nickname: value });
      onToast('Nickname updated', 'success');
      setEditing(false);
    } catch {
      onToast('Failed to update nickname', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-bg-card rounded-lg p-4 mx-4 mb-3">
      <div className="text-sm font-semibold text-txt-secondary uppercase tracking-wide mb-1">
        Nickname
      </div>

      {!editing ? (
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-white font-medium">{user?.nickname || '-'}</span>
          <button
            type="button"
            onClick={startEdit}
            className="text-sm font-medium text-brand bg-transparent border-none cursor-pointer"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(validate(e.target.value));
            }}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            autoFocus
            maxLength={20}
            className="w-full h-12 px-3 rounded-lg text-sm text-white bg-bg-input border outline-none"
            style={{
              borderColor: error ? '#FF4757' : '#24EE89',
            }}
          />
          {error && <p className="text-xs text-error mt-1">{error}</p>}
          <p className="text-xs text-txt-muted mt-1">2-20 characters, letters, numbers and underscores only</p>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className="flex-1 h-10 rounded-lg border border-divider bg-transparent text-white text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex-1 h-10 rounded-lg border-none text-black text-sm font-extrabold cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, #24EE89, #9FE871)',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
