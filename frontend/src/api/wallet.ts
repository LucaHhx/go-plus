import { get, post } from './client';
import type {
  WalletData,
  PaymentMethod,
  DepositRequest,
  DepositResult,
  WithdrawRequest,
  WithdrawResult,
  TransactionListResponse,
  Transaction,
  TransactionParams,
} from '@/types';

export const walletApi = {
  getWallet: () => get<WalletData>('/wallet'),

  getPaymentMethods: () => get<PaymentMethod[]>('/wallet/payment-methods'),

  deposit: (data: DepositRequest) => post<DepositResult>('/wallet/deposit', data),

  withdraw: (data: WithdrawRequest) => post<WithdrawResult>('/wallet/withdraw', data),

  getTransactions: (params: TransactionParams) =>
    get<TransactionListResponse>('/wallet/transactions', { params: params as Record<string, unknown> }),

  getTransaction: (id: number) => get<Transaction>(`/wallet/transactions/${id}`),
};
