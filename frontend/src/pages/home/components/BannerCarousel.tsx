import { useState, useEffect, useCallback, useRef } from 'react';
import type { Banner } from '@/types';

interface Props {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const count = banners.length;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % count) + count) % count);
  }, [count]);

  // Auto-play
  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
    // Restart auto-play
    if (count > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % count);
      }, 5000);
    }
  };

  if (count === 0) return null;

  return (
    <div className="px-4 mt-3">
      <div className="overflow-hidden rounded-xl" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full flex-shrink-0">
              <img
                src={banner.image_url}
                alt=""
                className="w-full h-auto rounded-xl"
                loading="lazy"
                style={{ aspectRatio: '860/360' }}
              />
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 border-none cursor-pointer transition-all duration-300 ${
                i === current ? 'w-4 bg-brand rounded-[3px]' : 'w-1.5 bg-txt-muted rounded-full'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
