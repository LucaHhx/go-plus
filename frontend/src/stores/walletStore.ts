import { create } from 'zustand';
import { walletApi } from '@/api/wallet';
import { useAuthStore } from './authStore';
import type {
  PaymentMethod,
  DepositRequest,
  DepositResult,
  WithdrawRequest,
  WithdrawResult,
  Transaction,
  TransactionParams,
} from '@/types';

interface WalletState {
  balance: number;
  bonusBalance: number;
  frozenAmount: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  transactionTotal: number;
  isLoading: boolean;

  fetchWallet: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  deposit: (data: DepositRequest) => Promise<DepositResult>;
  withdraw: (data: WithdrawRequest) => Promise<WithdrawResult>;
  fetchTransactions: (params: TransactionParams, append?: boolean) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  bonusBalance: 0,
  frozenAmount: 0,
  currency: 'INR',
  paymentMethods: [],
  transactions: [],
  transactionTotal: 0,
  isLoading: false,

  fetchWallet: async () => {
    try {
      const res = await walletApi.getWallet();
      if (res.code === 0) {
        set({
          balance: res.data.balance,
          bonusBalance: res.data.bonus_balance,
          frozenAmount: res.data.frozen_amount,
          currency: res.data.currency,
        });
        // Sync balance to authStore user
        const { user, updateUser } = useAuthStore.getState();
        if (user) {
          updateUser({
            balance: res.data.balance,
            bonus_balance: res.data.bonus_balance,
          });
        }
      }
    } catch {
      // silently fail
    }
  },

  fetchPaymentMethods: async () => {
    try {
      const res = await walletApi.getPaymentMethods();
      if (res.code === 0) {
        set({ paymentMethods: res.data });
      }
    } catch {
      // silently fail
    }
  },

  deposit: async (data: DepositRequest) => {
    const res = await walletApi.deposit(data);
    if (res.code !== 0) {
      throw new Error(res.message || 'Deposit failed');
    }
    // Refresh wallet balance
    const walletRes = await walletApi.getWallet();
    if (walletRes.code === 0) {
      set({
        balance: walletRes.data.balance,
        bonusBalance: walletRes.data.bonus_balance,
        frozenAmount: walletRes.data.frozen_amount,
      });
      const { user, updateUser } = useAuthStore.getState();
      if (user) {
        updateUser({
          balance: walletRes.data.balance,
          bonus_balance: walletRes.data.bonus_balance,
        });
      }
    }
    return res.data;
  },

  withdraw: async (data: WithdrawRequest) => {
    const res = await walletApi.withdraw(data);
    if (res.code !== 0) {
      throw new Error(res.message || 'Withdrawal failed');
    }
    // Refresh wallet balance
    const walletRes = await walletApi.getWallet();
    if (walletRes.code === 0) {
      set({
        balance: walletRes.data.balance,
        bonusBalance: walletRes.data.bonus_balance,
        frozenAmount: walletRes.data.frozen_amount,
      });
      const { user, updateUser } = useAuthStore.getState();
      if (user) {
        updateUser({
          balance: walletRes.data.balance,
          bonus_balance: walletRes.data.bonus_balance,
        });
      }
    }
    return res.data;
  },

  fetchTransactions: async (params: TransactionParams, append = false) => {
    set({ isLoading: true });
    try {
      const res = await walletApi.getTransactions(params);
      if (res.code === 0) {
        set((state) => ({
          transactions: append ? [...state.transactions, ...res.data.transactions] : res.data.transactions,
          transactionTotal: res.data.total,
        }));
      }
    } catch {
      // silently fail
    } finally {
      set({ isLoading: false });
    }
  },
}));
