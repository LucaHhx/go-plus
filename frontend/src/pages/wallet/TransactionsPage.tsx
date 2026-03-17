import { useEffect, useState } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import FullScreenLayout from '@/components/layout/FullScreenLayout';
import WalletPageHeader from './components/WalletPageHeader';
import TransactionFilter from './components/TransactionFilter';
import TransactionCard from './components/TransactionCard';

export default function TransactionsPage() {
  const { transactions, transactionTotal, isLoading, fetchTransactions } = useWalletStore();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setPage(1);
    fetchTransactions({ type: filter || undefined, page: 1, page_size: pageSize });
  }, [filter, fetchTransactions]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions({ type: filter || undefined, page: nextPage, page_size: pageSize }, true);
  };

  const hasMore = transactions.length < transactionTotal;

  return (
    <FullScreenLayout>
        <WalletPageHeader title="Transactions" />

        <TransactionFilter selected={filter} onSelect={setFilter} />

        <div className="px-4 pb-8">
          {transactions.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-12 h-12 text-txt-muted mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-txt-muted text-sm">No transactions yet</p>
            </div>
          ) : (
            <>
              {transactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}

              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              )}

              {hasMore && !isLoading && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="w-full py-3 text-brand text-sm font-semibold cursor-pointer bg-transparent border-none"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
    </FullScreenLayout>
  );
}
