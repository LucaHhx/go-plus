import { useNavigate } from 'react-router-dom';

interface WalletPageHeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
}

export default function WalletPageHeader({ title, rightIcon }: WalletPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-bg-deep h-14 flex items-center px-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <svg className="w-5 h-5 text-txt" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="flex-1 text-center text-txt font-bold text-base">{title}</h1>
      {rightIcon ? (
        <div className="w-8 h-8 flex items-center justify-center">{rightIcon}</div>
      ) : (
        <div className="w-8" />
      )}
    </header>
  );
}
