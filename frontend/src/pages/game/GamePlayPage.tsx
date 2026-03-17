import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesApi } from '@/api/games';

export default function GamePlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const launchGame = async () => {
      try {
        const res = await gamesApi.launch(Number(id));
        if (res.code === 0 && res.data.game_url) {
          setGameUrl(res.data.game_url);
        } else {
          setError(res.message || 'Failed to launch game');
        }
      } catch {
        setError('Failed to launch game');
      } finally {
        setLoading(false);
      }
    };

    launchGame();
  }, [id]);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#1A1D1D' }}>
      {/* Header with back button */}
      <div
        className="flex items-center shrink-0"
        style={{ height: '56px', padding: '0 16px', background: '#232626' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none text-white cursor-pointer p-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 9.95 9" />
            </svg>
            <div className="text-txt-secondary text-sm">Loading game...</div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="text-error text-sm">{error}</div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-brand text-[#1A1D1D] rounded-[8px] text-sm font-semibold border-none cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}

        {!loading && !error && gameUrl && (
          <iframe
            src={gameUrl}
            className="w-full flex-1 border-none"
            title="Game"
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {!loading && !error && !gameUrl && (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="text-[48px]">🎮</div>
            <div className="text-white text-lg font-semibold">Game Placeholder</div>
            <div className="text-txt-muted text-sm">
              This game will be available once the provider integration is complete.
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-brand text-[#1A1D1D] rounded-[8px] text-sm font-semibold border-none cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
