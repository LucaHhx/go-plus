import { useEffect, useState } from 'react';
import { useApp, useNavigate } from '../../context/AppContext';
import { userMgmtApi } from '../../api/client';
import Icon from '../ui/Icon';

interface UserTx {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface UserDetail {
  id: string;
  phone: string;
  nickname: string;
  createdAt: string;
  lastLoginAt: string;
  status: string;
  balance: number;
  bonusBalance: number;
  recentTransactions: UserTx[];
}

const mockDetail: UserDetail = {
  id: '1001',
  phone: '+62 98765 43210',
  nickname: 'player1001',
  createdAt: '2026-03-04',
  lastLoginAt: '2026-03-04 14:30',
  status: 'active',
  balance: 1250,
  bonusBalance: 200,
  recentTransactions: [
    { id: 'T-1001', type: 'deposit', amount: 1000, status: 'completed', createdAt: '2026-03-04 14:00' },
    { id: 'T-1002', type: 'withdrawal', amount: 500, status: 'approved', createdAt: '2026-03-04 13:00' },
    { id: 'T-1003', type: 'deposit', amount: 750, status: 'completed', createdAt: '2026-03-03 10:00' },
  ],
};

export default function UserDetailPage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const userId = state.pageParams.userId || '1001';
  const [user, setUser] = useState<UserDetail>(mockDetail);

  useEffect(() => {
    userMgmtApi.detail(userId)
      .then(data => {
        const raw = data as Record<string, unknown>;
        // Backend returns {user: {...}, wallet: {...}, recentTransactions: [...]}
        const u = (raw.user ?? raw) as Record<string, unknown>;
        const w = (raw.wallet ?? {}) as Record<string, number>;
        const txs = (raw.recentTransactions ?? []) as UserTx[];
        setUser({
          id: String(u.id ?? ''),
          phone: String(u.phone ?? ''),
          nickname: String(u.nickname ?? ''),
          createdAt: String(u.createdAt ?? ''),
          lastLoginAt: String(u.lastLoginAt ?? ''),
          status: String(u.status ?? ''),
          balance: Number(w.balance ?? 0),
          bonusBalance: Number(w.bonusBalance ?? 0),
          recentTransactions: txs,
        });
      })
      .catch(() => { /* use mock */ });
  }, [userId]);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('users')}>
            <Icon name="arrowRight" size={16} />
          </button>
          <h2 className="page-title">User Detail</h2>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Basic Info</span></div>
          <div className="detail-rows">
            <div className="detail-row"><span className="detail-label">ID</span><span>#{user.id}</span></div>
            <div className="detail-row"><span className="detail-label">Phone</span><span>{user.phone}</span></div>
            <div className="detail-row"><span className="detail-label">Nickname</span><span>{user.nickname}</span></div>
            <div className="detail-row"><span className="detail-label">Registered</span><span>{user.createdAt?.slice(0, 10) || '--'}</span></div>
            <div className="detail-row"><span className="detail-label">Last Login</span><span>{user.lastLoginAt || '--'}</span></div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className={`status-badge-inline ${user.status}`}>{user.status}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Balance</span></div>
          <div className="balance-cards">
            <div className="balance-item">
              <span className="balance-label">Main Balance</span>
              <span className="balance-value">Rp{user.balance.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Bonus</span>
              <span className="balance-value bonus">Rp{user.bonusBalance.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><span className="card-title">Recent Transactions</span></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {user.recentTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                  <td style={{ fontWeight: 600 }}>Rp{tx.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}</td>
                  <td>
                    <span className={`status-badge-inline ${tx.status}`}>{tx.status}</span>
                  </td>
                  <td style={{ color: '#64748b' }}>{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
