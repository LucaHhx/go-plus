interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  onCancel,
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-bg-card rounded-lg p-6 mx-4" style={{ maxWidth: 320, width: '100%' }}>
        <h3 className="text-lg text-white font-semibold">{title}</h3>
        <p className="text-sm text-txt-secondary mt-2">{description}</p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-12 rounded-lg border border-divider bg-transparent text-white text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-lg border-none text-white text-sm font-semibold cursor-pointer"
            style={{ background: '#FF4757', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
