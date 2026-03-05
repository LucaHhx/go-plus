import { useEffect, useState } from 'react';
import { useToast } from '../../context/AppContext';
import { gameMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import ConfirmModal from '../shared/ConfirmModal';
import FormSelect from '../form/FormSelect';

interface Game {
  id: string;
  name: string;
  providerName: string;
  categoryName: string;
  status: string;
  thumbnailUrl?: string;
}

const mockGames: Game[] = [
  { id: 'g1', name: 'Aviator', providerName: 'Spribe', categoryName: 'Crash', status: 'live' },
  { id: 'g2', name: 'Piggy Bank', providerName: 'JDB', categoryName: 'Slots', status: 'offline' },
  { id: 'g3', name: 'Lucky 7', providerName: 'JILI', categoryName: 'Slots', status: 'live' },
  { id: 'g4', name: 'Roulette Pro', providerName: 'Evolution', categoryName: 'Live', status: 'live' },
  { id: 'g5', name: 'Sweet Bonanza', providerName: 'Pragmatic', categoryName: 'Slots', status: 'offline' },
];

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Slots', label: 'Slots' },
  { value: 'Live', label: 'Live' },
  { value: 'Crash', label: 'Crash' },
];

const providers = [
  { value: '', label: 'All Providers' },
  { value: 'JILI', label: 'JILI' },
  { value: 'Spribe', label: 'Spribe' },
  { value: 'JDB', label: 'JDB' },
  { value: 'Evolution', label: 'Evolution' },
  { value: 'Pragmatic', label: 'Pragmatic' },
];

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [category, setCategory] = useState('');
  const [provider, setProvider] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(50);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ game: Game; action: string } | null>(null);
  const toast = useToast();

  const fetchGames = () => {
    setLoading(true);
    gameMgmtApi.list({ page, pageSize: 20, category, provider })
      .then(res => {
        const data = res as { items: Game[]; total: number };
        setGames(data.items);
        setTotal(data.total);
      })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGames(); }, [page, category, provider]);

  const handleToggle = (game: Game) => {
    const newStatus = game.status === 'live' ? 'offline' : 'live';
    gameMgmtApi.updateStatus(game.id, newStatus)
      .then(() => {
        toast(`${game.name} is now ${newStatus}`, 'success');
        setGames(prev => prev.map(g => g.id === game.id ? { ...g, status: newStatus } : g));
      })
      .catch(() => toast('Operation failed', 'error'))
      .finally(() => setConfirm(null));
  };

  const filtered = games.filter(g =>
    (!category || g.categoryName === category) &&
    (!provider || g.providerName === provider)
  );

  const columns: Column<Game>[] = [
    {
      key: 'thumb', title: 'Thumb', width: '60px',
      render: () => <div style={{ width: 40, height: 40, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />,
    },
    { key: 'name', title: 'Game Name', render: g => <span style={{ fontWeight: 600 }}>{g.name}</span> },
    { key: 'providerName', title: 'Provider' },
    { key: 'categoryName', title: 'Category' },
    { key: 'status', title: 'Status', render: g => <StatusBadge status={g.status} /> },
    {
      key: 'actions', title: 'Actions',
      render: g => (
        <button
          className={`table-action ${g.status === 'live' ? 'warn' : 'accent'}`}
          onClick={() => setConfirm({ game: g, action: g.status === 'live' ? 'take down' : 'go live' })}
        >
          {g.status === 'live' ? 'Take Down' : 'Go Live'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Game Management</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <FormSelect value={category} onChange={setCategory} options={categories} />
          <FormSelect value={provider} onChange={setProvider} options={providers} />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={g => g.id}
        page={page}
        total={total}
        pageSize={20}
        onPageChange={setPage}
        loading={loading}
      />
      {confirm && (
        <ConfirmModal
          visible
          title={`${confirm.action === 'take down' ? 'Take Down' : 'Go Live'} Game`}
          message={`Are you sure you want to ${confirm.action} "${confirm.game.name}"?`}
          confirmText={confirm.action === 'take down' ? 'Take Down' : 'Go Live'}
          variant={confirm.action === 'take down' ? 'danger' : 'primary'}
          onConfirm={() => handleToggle(confirm.game)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
