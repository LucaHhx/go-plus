import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import AuthGuard from '@/components/layout/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import RegisterPage from '@/pages/auth/RegisterPage';
import LoginPage from '@/pages/auth/LoginPage';
import GiftSelectPage from '@/pages/auth/GiftSelectPage';
import HomePage from '@/pages/home/HomePage';
import ExplorePage from '@/pages/explore/ExplorePage';
import GamePlayPage from '@/pages/game/GamePlayPage';
import DepositPage from '@/pages/wallet/DepositPage';
import WithdrawPage from '@/pages/wallet/WithdrawPage';
import TransactionsPage from '@/pages/wallet/TransactionsPage';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages -- no global layout */}
        <Route
          path="/register"
          element={
            <AuthGuard requireAuth={false}>
              <RegisterPage />
            </AuthGuard>
          }
        />
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <LoginPage />
            </AuthGuard>
          }
        />
        <Route
          path="/register/gift"
          element={
            <AuthGuard requireAuth={true}>
              <GiftSelectPage />
            </AuthGuard>
          }
        />

        {/* Wallet pages -- full screen, require auth */}
        <Route
          path="/wallet/deposit"
          element={
            <AuthGuard requireAuth={true}>
              <DepositPage />
            </AuthGuard>
          }
        />
        <Route
          path="/wallet/withdraw"
          element={
            <AuthGuard requireAuth={true}>
              <WithdrawPage />
            </AuthGuard>
          }
        />
        <Route
          path="/wallet/transactions"
          element={
            <AuthGuard requireAuth={true}>
              <TransactionsPage />
            </AuthGuard>
          }
        />

        {/* Game play page -- full screen, no global layout */}
        <Route
          path="/games/:id/play"
          element={
            <AuthGuard requireAuth={true}>
              <GamePlayPage />
            </AuthGuard>
          }
        />

        {/* Main app pages with global layout (TopBar + BottomTabBar) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
