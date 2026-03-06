import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-opacity duration-200"
      style={{
        top: 72,
        background: isSuccess ? 'rgba(36, 238, 137, 0.15)' : 'rgba(255, 71, 87, 0.15)',
        border: `1px solid ${isSuccess ? 'rgba(36, 238, 137, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`,
        color: isSuccess ? '#24EE89' : '#FF4757',
        opacity: visible ? 1 : 0,
      }}
    >
      {isSuccess ? (
        <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}
