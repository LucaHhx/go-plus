import { Link } from 'react-router-dom';

export default function LoginButtons() {
  return (
    <div className="flex items-center gap-1">
      <Link
        to="/login"
        className="text-white font-extrabold text-base px-4 h-10 flex items-center no-underline hover:text-txt-secondary transition-colors bg-transparent border-none"
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="h-10 px-4 rounded-lg flex items-center no-underline font-extrabold text-base"
        style={{
          background: 'linear-gradient(90deg, #24EE89, #9FE871)',
          color: '#000',
        }}
      >
        Sign Up
      </Link>
    </div>
  );
}
