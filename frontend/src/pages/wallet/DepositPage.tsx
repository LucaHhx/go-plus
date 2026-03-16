import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/stores/walletStore';
import WalletPageHeader from './components/WalletPageHeader';
import BalanceDisplay from './components/BalanceDisplay';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import AmountInput from './components/AmountInput';
import QuickAmountButtons from './components/QuickAmountButtons';

export default function DepositPage() {
  const navigate = useNavigate();
  const { balance, paymentMethods, fetchWallet, fetchPaymentMethods, deposit } = useWalletStore();

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [amount, setAmount] = useState('');
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchPaymentMethods();
  }, [fetchWallet, fetchPaymentMethods]);

  // Default select first payment method
  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethods.find((m) => m.code === selectedMethod)) {
      setSelectedMethod(paymentMethods[0].code);
    }
  }, [paymentMethods, selectedMethod]);

  const handleQuickAmount = (val: number) => {
    setQuickAmount(val);
    setAmount(val.toString());
    setError('');
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    setQuickAmount([10000, 50000, 100000, 500000].includes(num) ? num : null);
    setError('');
  };

  const handleDeposit = async () => {
    const num = parseFloat(amount);
    if (!num || num < 10000) {
      setError('Minimum deposit amount is Rp10.000');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await deposit({ amount: num, payment_method: selectedMethod });
      navigate('/wallet/transactions');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deposit failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter deposit methods only
  const depositMethods = paymentMethods.filter((m) => m.type === 'deposit' || m.type === 'both');

  return (
    <div className="min-h-screen flex justify-center" style={{ background: '#1A1D1D' }}>
      <div className="w-full max-w-[430px] min-h-screen bg-bg">
        <WalletPageHeader
          title="Deposit"
          rightIcon={
            <button
              type="button"
              onClick={() => navigate('/wallet/transactions')}
              className="w-8 h-8 flex items-center justify-center cursor-pointer bg-transparent border-none"
            >
              <svg className="w-5 h-5 text-txt-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          }
        />

        <div className="px-4 pb-8">
          <BalanceDisplay balance={balance} />

          <h3 className="text-txt text-sm font-semibold mb-3">Select Payment Method</h3>
          <div className="mb-6">
            <PaymentMethodSelector
              methods={depositMethods}
              selected={selectedMethod}
              onSelect={setSelectedMethod}
            />
          </div>

          <h3 className="text-txt text-sm font-semibold mb-3">Enter Amount</h3>
          <div className="mb-2">
            <AmountInput value={amount} onChange={handleAmountChange} />
          </div>
          <p className="text-txt-muted text-xs mb-4">Minimum: Rp10.000</p>

          <div className="mb-6">
            <QuickAmountButtons selected={quickAmount} onSelect={handleQuickAmount} />
          </div>

          {error && (
            <p className="text-error text-xs mb-3 text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleDeposit}
            disabled={submitting}
            className="w-full h-11 bg-brand text-bg-deep font-bold text-base rounded-lg cursor-pointer hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
