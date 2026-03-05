import { useEffect, useState } from 'react';
import { useToast } from '../../context/AppContext';
import { providerMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import ConfirmModal from '../shared/ConfirmModal';
import FormInput from '../form/FormInput';
import { createPortal } from 'react-dom';

interface Provider {
  id: string;
  name: string;
  gameCount: number;
  status: string;
}

const mockProviders: Provider[] = [
  { id: 'p1', name: 'JILI', gameCount: 45, status: 'active' },
  { id: 'p2', name: 'Spribe', gameCount: 12, status: 'active' },
  { id: 'p3', name: 'JDB', gameCount: 30, status: 'active' },
  { id: 'p4', name: 'Evolution', gameCount: 25, status: 'disabled' },
  { id: 'p5', name: 'Pragmatic', gameCount: 60, status: 'active' },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ mode: 'add' | 'edit'; provider?: Provider } | null>(null);
  const [editName, setEditName] = useState('');
  const [confirm, setConfirm] = useState<{ provider: Provider; action: string } | null>(null);
  const toast = useToast();

  const fetchProviders = () => {
    setLoading(true);
    providerMgmtApi.list()
      .then(res => { setProviders((res as { items: Provider[] }).items); })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleSave = () => {
    if (!editName.trim()) return;
    const promise = editModal?.mode === 'edit' && editModal.provider
      ? providerMgmtApi.update(editModal.provider.id, { name: editName })
      : providerMgmtApi.create({ name: editName });

    promise
      .then(() => {
        toast(`Provider ${editModal?.mode === 'edit' ? 'updated' : 'created'}`, 'success');
        if (editModal?.mode === 'edit' && editModal.provider) {
          setProviders(prev => prev.map(p => p.id === editModal.provider!.id ? { ...p, name: editName } : p));
        } else {
          setProviders(prev => [...prev, { id: `p${Date.now()}`, name: editName, gameCount: 0, status: 'active' }]);
        }
      })
      .catch(() => toast('Save failed', 'error'))
      .finally(() => { setEditModal(null); setEditName(''); });
  };

  const handleToggle = (provider: Provider) => {
    const newStatus = provider.status === 'active' ? 'disabled' : 'active';
    providerMgmtApi.updateStatus(provider.id, newStatus)
      .then(() => {
        toast(`${provider.name} ${newStatus}`, 'success');
        setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, status: newStatus } : p));
      })
      .catch(() => toast('Operation failed', 'error'))
      .finally(() => setConfirm(null));
  };

  const columns: Column<Provider>[] = [
    {
      key: 'logo', title: 'Logo', width: '60px',
      render: p => (
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #1DBF6E, #24EE89)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#0f0f1a' }}>
          {p.name[0]}
        </div>
      ),
    },
    { key: 'name', title: 'Provider Name', render: p => <span style={{ fontWeight: 600 }}>{p.name}</span> },
    { key: 'gameCount', title: 'Games' },
    { key: 'status', title: 'Status', render: p => <StatusBadge status={p.status} /> },
    {
      key: 'actions', title: 'Actions',
      render: p => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="table-action accent" onClick={() => { setEditModal({ mode: 'edit', provider: p }); setEditName(p.name); }}>Edit</button>
          <button
            className={`table-action ${p.status === 'active' ? 'danger' : 'accent'}`}
            onClick={() => setConfirm({ provider: p, action: p.status === 'active' ? 'disable' : 'enable' })}
          >
            {p.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Provider Management</h2>
        <button className="btn-add" onClick={() => { setEditModal({ mode: 'add' }); setEditName(''); }}>+ Add Provider</button>
      </div>
      <DataTable
        columns={columns}
        data={providers}
        rowKey={p => p.id}
        total={providers.length}
        pageSize={100}
        loading={loading}
      />
      {editModal && createPortal(
        <>
          <div className="confirm-overlay" onClick={() => setEditModal(null)} />
          <div className="confirm-dialog">
            <h3 className="confirm-title">{editModal.mode === 'edit' ? 'Edit Provider' : 'Add Provider'}</h3>
            <div style={{ margin: '16px 0' }}>
              <FormInput label="Provider Name" value={editName} onChange={setEditName} placeholder="Enter provider name" />
            </div>
            <div className="confirm-actions">
              <button className="confirm-btn cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="confirm-btn primary" style={{ background: '#24EE89', color: '#0f0f1a' }} onClick={handleSave}>Save</button>
            </div>
          </div>
        </>,
        document.body
      )}
      {confirm && (
        <ConfirmModal
          visible
          title={`${confirm.action === 'disable' ? 'Disable' : 'Enable'} Provider`}
          message={`Are you sure you want to ${confirm.action} "${confirm.provider.name}"?`}
          confirmText={confirm.action === 'disable' ? 'Disable' : 'Enable'}
          variant={confirm.action === 'disable' ? 'danger' : 'primary'}
          onConfirm={() => handleToggle(confirm.provider)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
