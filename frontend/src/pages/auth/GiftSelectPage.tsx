import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullScreenLayout from '@/components/layout/FullScreenLayout';

export default function GiftSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'aviator' | 'money-coming'>(
    'aviator'
  );

  const handleConfirm = () => {
    // In a full implementation this would call an API to claim the gift
    navigate('/', { replace: true });
  };

  return (
    <FullScreenLayout className="items-center justify-center px-4">
      <div className="w-full">
        <h1 className="text-white font-extrabold text-2xl text-center mb-2">
          Congratulations!
        </h1>
        <p className="text-txt-secondary text-sm text-center mb-6">
          You've earned 100 Bonuses! Select your free spins gift:
        </p>

        <div className="flex gap-3">
          {/* Aviator */}
          <button
            type="button"
            onClick={() => setSelected('aviator')}
            className="flex-1 rounded-lg p-4 text-center cursor-pointer transition-all duration-200"
            style={{
              background: '#323738',
              border: `2px solid ${
                selected === 'aviator' ? '#24EE89' : 'transparent'
              }`,
            }}
          >
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-bg-deep">
              <img
                src="/assets/games/aviator.jpg"
                alt="Aviator"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="text-brand text-lg font-extrabold">x100</div>
            <div className="text-txt-secondary text-xs mt-1">
              Aviator Free Spins
            </div>
            <div
              className="mt-2 px-3 py-1 rounded font-bold inline-block text-xs"
              style={{
                background: selected === 'aviator' ? '#24EE89' : '#3A4142',
                color: selected === 'aviator' ? '#000' : '#6B7070',
              }}
            >
              {selected === 'aviator' ? 'Selected' : 'Select'}
            </div>
          </button>

          {/* MoneyComing */}
          <button
            type="button"
            onClick={() => setSelected('money-coming')}
            className="flex-1 rounded-lg p-4 text-center cursor-pointer transition-all duration-200"
            style={{
              background: '#323738',
              border: `2px solid ${
                selected === 'money-coming' ? '#24EE89' : 'transparent'
              }`,
            }}
          >
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-bg-deep">
              <img
                src="/assets/games/money-coming.jpg"
                alt="MoneyComing"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="text-brand text-lg font-extrabold">x100</div>
            <div className="text-txt-secondary text-xs mt-1">
              MoneyComing Free Spins
            </div>
            <div
              className="mt-2 px-3 py-1 rounded font-bold inline-block text-xs"
              style={{
                background:
                  selected === 'money-coming' ? '#24EE89' : '#3A4142',
                color: selected === 'money-coming' ? '#000' : '#6B7070',
              }}
            >
              {selected === 'money-coming' ? 'Selected' : 'Select'}
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 rounded-lg border-none cursor-pointer flex items-center justify-center text-base font-extrabold mt-6"
          style={{
            background: 'linear-gradient(90deg, #24EE89, #9FE871)',
            color: '#000',
          }}
        >
          Claim Gift & Start Playing
        </button>

        <button
          type="button"
          onClick={() => navigate('/', { replace: true })}
          className="w-full text-center mt-3 text-txt-muted text-sm bg-transparent border-none cursor-pointer hover:text-txt-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </FullScreenLayout>
  );
}
