import { useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  showRemark?: boolean;
  onConfirm: (remark?: string) => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  showRemark,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [remark, setRemark] = useState('');

  if (!visible) return null;

  const confirmBg = variant === 'danger' ? '#ef4444' : '#24EE89';
  const confirmColor = variant === 'danger' ? '#fff' : '#0f0f1a';

  return createPortal(
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div className="confirm-dialog">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        {showRemark && (
          <textarea
            className="confirm-remark"
            placeholder="Remark (optional)"
            value={remark}
            onChange={e => setRemark(e.target.value)}
            rows={2}
          />
        )}
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>{cancelText}</button>
          <button
            className="confirm-btn primary"
            style={{ background: confirmBg, color: confirmColor }}
            onClick={() => { onConfirm(remark || undefined); setRemark(''); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
