import { useEffect, useState } from 'react';
import { useToast } from '../../context/AppContext';
import { bannerMgmtApi } from '../../api/client';
import DataTable from '../shared/DataTable';
import type { Column } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import ConfirmModal from '../shared/ConfirmModal';
import FormInput from '../form/FormInput';
import { createPortal } from 'react-dom';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: string;
}

const mockBanners: Banner[] = [
  { id: 'b1', title: 'Welcome Bonus 100%', imageUrl: '', linkUrl: '/signup', sortOrder: 1, status: 'active' },
  { id: 'b2', title: 'Daily Cashback', imageUrl: '', linkUrl: '/promotions', sortOrder: 2, status: 'active' },
  { id: 'b3', title: 'Refer & Earn', imageUrl: '', linkUrl: '/referral', sortOrder: 3, status: 'disabled' },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ mode: 'add' | 'edit'; banner?: Banner } | null>(null);
  const [form, setForm] = useState({ title: '', linkUrl: '', sortOrder: '1' });
  const [deleteConfirm, setDeleteConfirm] = useState<Banner | null>(null);
  const toast = useToast();

  const fetchBanners = () => {
    setLoading(true);
    bannerMgmtApi.list()
      .then(res => { setBanners((res as { items: Banner[] }).items); })
      .catch(() => { /* use mock */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const openEdit = (banner?: Banner) => {
    if (banner) {
      setForm({ title: banner.title, linkUrl: banner.linkUrl, sortOrder: String(banner.sortOrder) });
      setEditModal({ mode: 'edit', banner });
    } else {
      setForm({ title: '', linkUrl: '', sortOrder: String(banners.length + 1) });
      setEditModal({ mode: 'add' });
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data = { title: form.title, linkUrl: form.linkUrl, sortOrder: Number(form.sortOrder), status: 'active' };

    const promise = editModal?.mode === 'edit' && editModal.banner
      ? bannerMgmtApi.update(editModal.banner.id, data)
      : bannerMgmtApi.create(data);

    promise
      .then(() => {
        toast(`Banner ${editModal?.mode === 'edit' ? 'updated' : 'created'}`, 'success');
        if (editModal?.mode === 'edit' && editModal.banner) {
          setBanners(prev => prev.map(b => b.id === editModal.banner!.id ? { ...b, ...data } : b));
        } else {
          setBanners(prev => [...prev, { id: `b${Date.now()}`, imageUrl: '', ...data }]);
        }
      })
      .catch(() => toast('Save failed', 'error'))
      .finally(() => setEditModal(null));
  };

  const handleDelete = (banner: Banner) => {
    bannerMgmtApi.remove(banner.id)
      .then(() => {
        toast('Banner deleted', 'success');
        setBanners(prev => prev.filter(b => b.id !== banner.id));
      })
      .catch(() => toast('Delete failed', 'error'))
      .finally(() => setDeleteConfirm(null));
  };

  const columns: Column<Banner>[] = [
    {
      key: 'preview', title: 'Preview', width: '100px',
      render: () => <div style={{ width: 96, height: 48, borderRadius: 6, background: 'linear-gradient(135deg, #991b1b, #dc2626)' }} />,
    },
    { key: 'title', title: 'Title' },
    { key: 'linkUrl', title: 'Link', render: b => <span style={{ color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{b.linkUrl}</span> },
    { key: 'sortOrder', title: 'Order' },
    { key: 'status', title: 'Status', render: b => <StatusBadge status={b.status} /> },
    {
      key: 'actions', title: 'Actions',
      render: b => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="table-action accent" onClick={() => openEdit(b)}>Edit</button>
          <button className="table-action danger" onClick={() => setDeleteConfirm(b)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Banner Management</h2>
        <button className="btn-add" onClick={() => openEdit()}>+ Add Banner</button>
      </div>
      <DataTable
        columns={columns}
        data={banners}
        rowKey={b => b.id}
        total={banners.length}
        pageSize={100}
        loading={loading}
      />
      {editModal && createPortal(
        <>
          <div className="confirm-overlay" onClick={() => setEditModal(null)} />
          <div className="confirm-dialog">
            <h3 className="confirm-title">{editModal.mode === 'edit' ? 'Edit Banner' : 'Add Banner'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0' }}>
              <FormInput label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Banner title" />
              <FormInput label="Link" value={form.linkUrl} onChange={v => setForm(f => ({ ...f, linkUrl: v }))} placeholder="/path or URL" />
              <FormInput label="Sort Order" value={form.sortOrder} onChange={v => setForm(f => ({ ...f, sortOrder: v }))} type="number" placeholder="1" />
            </div>
            <div className="confirm-actions">
              <button className="confirm-btn cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="confirm-btn primary" style={{ background: '#24EE89', color: '#0f0f1a' }} onClick={handleSave}>Save</button>
            </div>
          </div>
        </>,
        document.body
      )}
      {deleteConfirm && (
        <ConfirmModal
          visible
          title="Delete Banner"
          message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
          confirmText="Delete"
          variant="danger"
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
