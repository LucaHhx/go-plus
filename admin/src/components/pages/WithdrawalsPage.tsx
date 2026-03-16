import { useEffect, useState } from 'react';
import { useToast } from '../../context/AppContext';
import { transactionMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import ConfirmModal from '../shared/ConfirmModal';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const mockWithdrawals: Withdrawal[] = [
  { id: 'W-501', userId: '1001', amount: 5000, paymentMethod: 'UPI', status: 'pending', createdAt: '2026-03-04 14:30' },
  { id: 'W-500', userId: '1002', amount: 2000, paymentMethod: 'Bank', status: 'pending', createdAt: '2026-03-04 13:15' },
  { id: 'W-499', userId: '1003', amount: 1000, paymentMethod: 'UPI', status: 'approved', createdAt: '2026-03-04 11:30' },
  { id: 'W-498', userId: '1004', amount: 3000, paymentMethod: 'Bank', status: 'rejected', createdAt: '2026-03-04 10:00' },
];

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ withdrawal: Withdrawal; action: 'approve' | 'reject' } | null>(null);
  const toast = useToast();

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  const fetchWithdrawals = () => {
    setLoading(true);
    transactionMgmtApi.withdrawals({ page: 1, pageSize: 50 })
      .then(res => { setWithdrawals((res as { items: Withdrawal[] }).items); })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const handleAction = (remark?: string) => {
    if (!confirm) return;
    const { withdrawal, action } = confirm;
    const promise = action === 'approve'
      ? transactionMgmtApi.approve(withdrawal.id, remark)
      : transactionMgmtApi.reject(withdrawal.id, remark);

    promise
      .then(() => {
        toast(`Withdrawal ${withdrawal.id} ${action}d`, 'success');
        setWithdrawals(prev => prev.map(w =>
          w.id === withdrawal.id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w
        ));
      })
      .catch(() => toast('Operation failed', 'error'))
      .finally(() => setConfirm(null));
  };

  const columns: Column<Withdrawal>[] = [
    { key: 'id', title: 'ID' },
    { key: 'userId', title: 'User ID' },
    { key: 'amount', title: 'Amount', render: w => <span style={{ fontWeight: 700 }}>Rp{w.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span> },
    { key: 'paymentMethod', title: 'Method' },
    { key: 'status', title: 'Status', render: w => <StatusBadge status={w.status} /> },
    { key: 'createdAt', title: 'Time', render: w => <span style={{ color: '#64748b' }}>{w.createdAt}</span> },
    {
      key: 'actions', title: 'Actions',
      render: w => w.status === 'pending' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="approve-btn" onClick={() => setConfirm({ withdrawal: w, action: 'approve' })}>Approve</button>
          <button className="reject-btn" onClick={() => setConfirm({ withdrawal: w, action: 'reject' })}>Reject</button>
        </div>
      ) : <span style={{ color: '#64748b' }}>--</span>,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Withdrawal Review</h2>
        {pendingCount > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 12 }}>
            {pendingCount} Pending
          </span>
        )}
      </div>
      <DataTable
        columns={columns}
        data={withdrawals}
        rowKey={w => w.id}
        rowClassName={w => w.status === 'pending' ? 'row-pending' : ''}
        total={withdrawals.length}
        pageSize={50}
        loading={loading}
      />
      {confirm && (
        <ConfirmModal
          visible
          title={`${confirm.action === 'approve' ? 'Approve' : 'Reject'} Withdrawal`}
          message={`${confirm.action === 'approve' ? 'Approve' : 'Reject'} withdrawal ${confirm.withdrawal.id} for Rp${confirm.withdrawal.amount.toLocaleString('id-ID')}?`}
          confirmText={confirm.action === 'approve' ? 'Approve' : 'Reject'}
          variant={confirm.action === 'approve' ? 'primary' : 'danger'}
          showRemark
          onConfirm={handleAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
