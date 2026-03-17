import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/stores/walletStore';
import FullScreenLayout from '@/components/layout/FullScreenLayout';
import WalletPageHeader from './components/WalletPageHeader';
import BalanceDisplay from './components/BalanceDisplay';
import AmountInput from './components/AmountInput';

type PaymentTab = 'upi' | 'bank';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { balance, bonusBalance, fetchWallet, withdraw } = useWalletStore();

  const [amount, setAmount] = useState('');
  const [paymentTab, setPaymentTab] = useState<PaymentTab>('upi');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleWithdraw = async () => {
    const num = parseFloat(amount);
    if (!num || num < 50000) {
      setError('Minimum withdrawal amount is Rp50.000');
      return;
    }
    if (num > 50000000) {
      setError('Maximum withdrawal amount is Rp50.000.000');
      return;
    }
    if (num > balance) {
      setError('Insufficient balance');
      return;
    }

    if (paymentTab === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID');
      return;
    }
    if (paymentTab === 'bank') {
      if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
        setError('Please fill in all bank details');
        return;
      }
    }

    setSubmitting(true);
    setError('');
    try {
      await withdraw({
        amount: num,
        payment_method: paymentTab === 'upi' ? 'upi' : 'bank',
        account_info:
          paymentTab === 'upi'
            ? { upi_id: upiId.trim() }
            : { bank_name: bankName.trim(), account_number: accountNumber.trim(), ifsc_code: ifscCode.trim() },
      });
      navigate('/wallet/transactions');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FullScreenLayout>
        <WalletPageHeader title="Withdraw" />

        <div className="px-4 pb-8">
          <BalanceDisplay balance={balance} bonusBalance={bonusBalance} showBonus />

          <h3 className="text-txt text-sm font-semibold mb-3">Withdrawal Amount</h3>
          <div className="mb-2">
            <AmountInput value={amount} onChange={(v) => { setAmount(v); setError(''); }} />
          </div>
          <div className="flex justify-between mb-6">
            <p className="text-txt-muted text-xs">Minimum: Rp50.000</p>
            <p className="text-txt-muted text-xs">Maximum: Rp50.000.000</p>
          </div>

          {/* Payment method tabs */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPaymentTab('upi')}
              className={`flex-1 h-10 text-sm rounded-lg cursor-pointer transition-colors ${
                paymentTab === 'upi'
                  ? 'bg-brand text-bg-deep font-bold'
                  : 'bg-bg-card text-txt-secondary font-semibold border border-divider hover:bg-bg-hover'
              }`}
            >
              UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentTab('bank')}
              className={`flex-1 h-10 text-sm rounded-lg cursor-pointer transition-colors ${
                paymentTab === 'bank'
                  ? 'bg-brand text-bg-deep font-bold'
                  : 'bg-bg-card text-txt-secondary font-semibold border border-divider hover:bg-bg-hover'
              }`}
            >
              Bank Transfer
            </button>
          </div>

          {/* UPI input */}
          {paymentTab === 'upi' && (
            <div className="mb-6">
              <label className="text-txt-secondary text-sm mb-2 block">UPI ID</label>
              <div className="flex items-center bg-bg-card border border-divider rounded-lg h-12 px-4">
                <input
                  type="text"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setError(''); }}
                  className="flex-1 bg-transparent text-txt text-sm border-none focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Bank input */}
          {paymentTab === 'bank' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="text-txt-secondary text-sm mb-2 block">Bank Name</label>
                <div className="flex items-center bg-bg-card border border-divider rounded-lg h-12 px-4">
                  <input
                    type="text"
                    placeholder="State Bank of India"
                    value={bankName}
                    onChange={(e) => { setBankName(e.target.value); setError(''); }}
                    className="flex-1 bg-transparent text-txt text-sm border-none focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-txt-secondary text-sm mb-2 block">Account Number</label>
                <div className="flex items-center bg-bg-card border border-divider rounded-lg h-12 px-4">
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => { setAccountNumber(e.target.value); setError(''); }}
                    className="flex-1 bg-transparent text-txt text-sm border-none focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-txt-secondary text-sm mb-2 block">IFSC Code</label>
                <div className="flex items-center bg-bg-card border border-divider rounded-lg h-12 px-4">
                  <input
                    type="text"
                    placeholder="SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => { setIfscCode(e.target.value); setError(''); }}
                    className="flex-1 bg-transparent text-txt text-sm border-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-error text-xs mb-3 text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={submitting}
            className="w-full h-11 bg-brand text-bg-deep font-bold text-base rounded-lg cursor-pointer hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Withdraw'}
          </button>

          <p className="text-center text-brand text-xs mt-3 font-semibold">
            Instant Withdrawal - Get your money fast!
          </p>
        </div>
    </FullScreenLayout>
  );
}
