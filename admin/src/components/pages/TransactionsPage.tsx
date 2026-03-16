import { useEffect, useState } from 'react';
import { transactionMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import TabSwitcher from '../ui/TabSwitcher';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  type: string;
  status: string;
  createdAt: string;
}

const mockDeposits: Transaction[] = [
  { id: 'D-401', userId: '1001', amount: 5000, paymentMethod: 'UPI', type: 'deposit', status: 'completed', createdAt: '2026-03-04 14:30' },
  { id: 'D-400', userId: '1002', amount: 2000, paymentMethod: 'Paytm', type: 'deposit', status: 'completed', createdAt: '2026-03-04 13:15' },
  { id: 'D-399', userId: '1003', amount: 1000, paymentMethod: 'GPay', type: 'deposit', status: 'failed', createdAt: '2026-03-04 12:00' },
  { id: 'D-398', userId: '1004', amount: 3000, paymentMethod: 'UPI', type: 'deposit', status: 'completed', createdAt: '2026-03-04 11:00' },
];

const mockWithdrawals: Transaction[] = [
  { id: 'W-501', userId: '1001', amount: 5000, paymentMethod: 'UPI', type: 'withdrawal', status: 'pending', createdAt: '2026-03-04 14:30' },
  { id: 'W-500', userId: '1002', amount: 2000, paymentMethod: 'Bank', type: 'withdrawal', status: 'pending', createdAt: '2026-03-04 13:15' },
  { id: 'W-499', userId: '1003', amount: 1000, paymentMethod: 'UPI', type: 'withdrawal', status: 'approved', createdAt: '2026-03-04 11:30' },
];

export default function TransactionsPage() {
  const [tab, setTab] = useState(0);
  const [deposits, setDeposits] = useState<Transaction[]>(mockDeposits);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>(mockWithdrawals);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    transactionMgmtApi.list({ page, pageSize: 20, type: tab === 0 ? 'deposit' : 'withdrawal' })
      .then(res => {
        const data = res as { items: Transaction[]; total: number };
        if (tab === 0) setDeposits(data.items);
        else setWithdrawals(data.items);
        setTotal(data.total);
      })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  }, [page, tab]);

  const data = tab === 0 ? deposits : withdrawals;

  const columns: Column<Transaction>[] = [
    { key: 'id', title: 'ID' },
    { key: 'userId', title: 'User ID' },
    { key: 'amount', title: 'Amount', render: tx => <span style={{ fontWeight: 700 }}>Rp{tx.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span> },
    { key: 'paymentMethod', title: 'Method' },
    { key: 'status', title: 'Status', render: tx => <StatusBadge status={tx.status} /> },
    { key: 'createdAt', title: 'Time', render: tx => <span style={{ color: '#64748b' }}>{tx.createdAt}</span> },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
      </div>
      <div style={{ marginBottom: 16, maxWidth: 300 }}>
        <TabSwitcher tabs={['Deposits', 'Withdrawals']} activeIndex={tab} onChange={i => { setTab(i); setPage(1); }} />
      </div>
      <DataTable
        columns={columns}
        data={data}
        rowKey={tx => tx.id}
        page={page}
        total={total}
        pageSize={20}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
