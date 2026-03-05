import { useEffect, useState } from 'react';
import { useNavigate, useToast } from '../../context/AppContext';
import { userMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import ConfirmModal from '../shared/ConfirmModal';
import SearchBox from '../ui/SearchBox';

interface User {
  id: string;
  phone: string;
  nickname: string;
  createdAt: string;
  balance: number;
  bonusBalance: number;
  status: string;
}

const mockUsers: User[] = [
  { id: '1001', phone: '+91 98765 43210', nickname: 'player1', createdAt: '2026-03-04', balance: 1250, bonusBalance: 100, status: 'active' },
  { id: '1002', phone: '+91 87654 32109', nickname: 'player2', createdAt: '2026-03-03', balance: 500, bonusBalance: 50, status: 'active' },
  { id: '1003', phone: '+91 76543 21098', nickname: 'player3', createdAt: '2026-03-02', balance: 0, bonusBalance: 0, status: 'disabled' },
  { id: '1004', phone: '+91 65432 10987', nickname: 'player4', createdAt: '2026-03-01', balance: 3200, bonusBalance: 200, status: 'active' },
  { id: '1005', phone: '+91 54321 09876', nickname: 'player5', createdAt: '2026-02-28', balance: 800, bonusBalance: 80, status: 'active' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(142);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ user: User; action: string } | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchUsers = () => {
    setLoading(true);
    userMgmtApi.list({ page, pageSize: 20, search })
      .then((res) => {
        const data = res as { items: User[]; total: number };
        setUsers(data.items);
        setTotal(data.total);
      })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleStatusChange = (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    userMgmtApi.updateStatus(user.id, newStatus)
      .then(() => {
        toast(`User ${user.phone} ${newStatus === 'active' ? 'enabled' : 'disabled'}`, 'success');
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      })
      .catch(() => toast('Operation failed', 'error'))
      .finally(() => setConfirm(null));
  };

  const filtered = search
    ? users.filter(u => u.phone.includes(search) || u.id.includes(search))
    : users;

  const columns: Column<User>[] = [
    { key: 'id', title: 'ID', render: u => `#${u.id}` },
    { key: 'phone', title: 'Phone' },
    { key: 'createdAt', title: 'Registered', render: u => u.createdAt?.slice(0, 10) || '--' },
    { key: 'balance', title: 'Balance', render: u => `₹${u.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { key: 'status', title: 'Status', render: u => <StatusBadge status={u.status} /> },
    {
      key: 'actions', title: 'Actions', render: u => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="table-action accent" onClick={() => navigate('user-detail', { userId: u.id })}>View</button>
          <button
            className={`table-action ${u.status === 'active' ? 'danger' : 'accent'}`}
            onClick={() => setConfirm({ user: u, action: u.status === 'active' ? 'disable' : 'enable' })}
          >
            {u.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by phone number..." />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={u => u.id}
        page={page}
        total={total}
        pageSize={20}
        onPageChange={setPage}
        loading={loading}
      />
      {confirm && (
        <ConfirmModal
          visible
          title={`${confirm.action === 'disable' ? 'Disable' : 'Enable'} User`}
          message={`Are you sure you want to ${confirm.action} user ${confirm.user.phone}?`}
          confirmText={confirm.action === 'disable' ? 'Disable' : 'Enable'}
          variant={confirm.action === 'disable' ? 'danger' : 'primary'}
          onConfirm={() => handleStatusChange(confirm.user)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
