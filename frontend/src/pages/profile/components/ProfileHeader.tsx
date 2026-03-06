import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  title: string;
}

export default function ProfileHeader({ title }: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 h-14 flex items-center px-4 bg-bg-deep"
      style={{ borderBottom: '1px solid rgba(58, 65, 66, 0.5)' }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-10 h-10 -ml-2 flex items-center justify-center cursor-pointer bg-transparent border-none"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <span className="text-base text-white font-semibold ml-1">{title}</span>
    </header>
  );
}
