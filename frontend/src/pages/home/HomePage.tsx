import { useEffect, useState } from 'react';
import { homeApi } from '@/api/home';
import type { HomeData } from '@/types';
import PromoBanner from './components/PromoBanner';
import JackpotSection from './components/JackpotSection';
import TrendingGames from './components/TrendingGames';
import RecentBigWin from './components/RecentBigWin';
import GameSectionRow from './components/GameSectionRow';
import OneGoSelection from './components/OneGoSelection';
import DepositBanner from './components/DepositBanner';
import LatestBetRace from './components/LatestBetRace';
import ProviderGrid from './components/ProviderGrid';
import SocialMediaLinks from '@/components/footer/SocialMediaLinks';
import PaymentMethodsBar from './components/PaymentMethodsBar';
import FooterSection from './components/FooterSection';

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    homeApi.getHomeData().then((res) => {
      if (!cancelled && res.code === 0) {
        setHomeData(res.data);
      }
    }).catch(() => {
      // API not available yet - use empty state
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      </div>
    );
  }

  const banners = homeData?.banners ?? [];
  const gameSections = homeData?.game_sections ?? [];
  const providers = homeData?.providers ?? [];
  const paymentIcons = homeData?.payment_icons ?? [];
  const socialLinks = homeData?.social_links ?? [];

  // Phase 2 mock data (graceful degradation: don't render if data absent)
  const jackpot = homeData?.jackpot ?? null;
  const trendingGames = homeData?.trending_games ?? [];
  const bigWinners = homeData?.big_winners ?? [];
  const promoBanners = homeData?.promo_banners ?? [];
  const oneGoSelection = homeData?.one_go_selection ?? null;
  const latestBets = homeData?.latest_bets ?? null;

  // Split game sections: first 4 (Table Game, Slots, Live, Fishing) before 1GO Selection,
  // last 2 (Crash, Lotto) after 1GO Selection
  const gameSectionsBefore = gameSections.slice(0, 4);
  const gameSectionsAfter = gameSections.slice(4);

  return (
    <>
      {/* 1. Promotional sign-up banner */}
      <PromoBanner />

      {/* 2. Jackpot of the Day [mock] */}
      {jackpot && jackpot.pots.length > 0 && <JackpotSection data={jackpot} />}

      {/* 3. Trending Games [mock] */}
      <TrendingGames games={trendingGames} />

      {/* 4. Recent Big Win [mock] */}
      <RecentBigWin winners={bigWinners} />

      {/* 5-8. Game sections: Table Game, Slots, Live, Fishing */}
      {gameSectionsBefore.map((section) => (
        <GameSectionRow key={section.category.slug} section={section} />
      ))}

      {/* 9. 1GO Selection [mock] */}
      {oneGoSelection && oneGoSelection.tabs.length > 0 && (
        <OneGoSelection data={oneGoSelection} />
      )}

      {/* 10-11. Game sections: Crash, Lotto */}
      {gameSectionsAfter.map((section) => (
        <GameSectionRow key={section.category.slug} section={section} />
      ))}

      {/* 12. Payment methods */}
      <PaymentMethodsBar methods={paymentIcons} />

      {/* 13. 37% First Deposit Cash Back Banner [mock] */}
      <DepositBanner banners={promoBanners} />

      {/* 14. Latest bet & Race [mock] */}
      {latestBets && <LatestBetRace data={latestBets} />}

      {/* 15. Provider grid */}
      <ProviderGrid providers={providers} />

      {/* 16. Community links */}
      <SocialMediaLinks links={socialLinks} />

      {/* 17. Footer */}
      <FooterSection />
    </>
  );
}
