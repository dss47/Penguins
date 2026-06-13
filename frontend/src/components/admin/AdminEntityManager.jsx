import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../../style/admin/adminEntityManager.module.css';
import { Plus, Edit3, Trash2, X, AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'providers',  label: 'Fournisseurs' },
  { id: 'categories', label: 'Catégories' },
  { id: 'features',   label: 'Fonctionnalités' },
  { id: 'models',     label: 'Modèles' },
];

const STATUS_OPTIONS = {
  providers: ['pending', 'active', 'archived'],
  features:  ['active', 'disabled'],
  models:    ['active', 'deprecated', 'beta'],
};

const FEATURE_TYPES = ['modality', 'access', 'licensing', 'capability'];

export default function AdminEntityManager() {
  const [activeTab, setActiveTab] = useState('providers');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [formModal, setFormModal] = useState({ open: false, editing: null });
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/data/lists');
      setData(res.data);
      setError(null);
    } catch {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const entities = data ? (data[activeTab] || []) : [];
  const providerList = data?.providers || [];

  const filtered = entities.filter(e =>
    (e.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setFormData({});
    setFormModal({ open: true, editing: null });
  };

  const openEdit = (item) => {
    setFormData({ ...item });
    setFormModal({ open: true, editing: item });
  };

  const closeForm = () => {
    setFormModal({ open: false, editing: null });
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = formModal.editing;
      const endpoint = isEdit ? 'update' : 'create';
      const payload = isEdit ? { id: formModal.editing.id, ...formData } : formData;
      await api.post(`/admin/data/${activeTab}/${endpoint}`, payload);
      closeForm();
      fetchData();
    } catch {
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.post(`/admin/data/${activeTab}/delete`, { id: confirmDelete.id });
      setConfirmDelete({ open: false, id: null });
      fetchData();
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'providers':
        return (
          <>
            <label className={styles.field}>
              <span>Nom *</span>
              <input value={formData.name || ''} onChange={e => handleFormChange('name', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Site web</span>
              <input value={formData.website_url || ''} onChange={e => handleFormChange('website_url', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Description</span>
              <textarea value={formData.description || ''} onChange={e => handleFormChange('description', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Statut</span>
              <select value={formData.status || 'pending'} onChange={e => handleFormChange('status', e.target.value)}>
                {STATUS_OPTIONS.providers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </>
        );
      case 'categories':
        return (
          <>
            <label className={styles.field}>
              <span>Nom *</span>
              <input value={formData.name || ''} onChange={e => handleFormChange('name', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Icône (emoji)</span>
              <input value={formData.icon || ''} onChange={e => handleFormChange('icon', e.target.value)} maxLength={10} />
            </label>
            <label className={styles.field}>
              <span>Description</span>
              <textarea value={formData.description || ''} onChange={e => handleFormChange('description', e.target.value)} />
            </label>
          </>
        );
      case 'features':
        return (
          <>
            <label className={styles.field}>
              <span>Nom *</span>
              <input value={formData.name || ''} onChange={e => handleFormChange('name', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Type</span>
              <select value={formData.type || ''} onChange={e => handleFormChange('type', e.target.value)}>
                <option value="">— Aucun —</option>
                {FEATURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span>Description</span>
              <textarea value={formData.description || ''} onChange={e => handleFormChange('description', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Statut</span>
              <select value={formData.status || 'active'} onChange={e => handleFormChange('status', e.target.value)}>
                {STATUS_OPTIONS.features.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </>
        );
      case 'models':
        return (
          <>
            <label className={styles.field}>
              <span>Nom *</span>
              <input value={formData.name || ''} onChange={e => handleFormChange('name', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Fournisseur *</span>
              <select value={formData.provider_id || ''} onChange={e => handleFormChange('provider_id', e.target.value)}>
                <option value="">— Choisir —</option>
                {providerList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span>Description</span>
              <textarea value={formData.description || ''} onChange={e => handleFormChange('description', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Statut</span>
              <select value={formData.status || 'active'} onChange={e => handleFormChange('status', e.target.value)}>
                {STATUS_OPTIONS.models.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </>
        );
    }
  };

  const renderTable = () => {
    if (loading) return <p className={styles.loading}>Chargement...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    const columns = {
      providers: [
        { key: 'name', label: 'Nom' },
        { key: 'website_url', label: 'Site web' },
        { key: 'status', label: 'Statut', render: v => <span className={`${styles.statusBadge} ${styles['status' + (v.charAt(0).toUpperCase() + v.slice(1))] || ''}`}>{v}</span> },
      ],
      categories: [
        { key: 'icon', label: 'Icône', render: v => <span style={{ fontSize: '1.3rem' }}>{v || '—'}</span> },
        { key: 'name', label: 'Nom' },
        { key: 'description', label: 'Description', render: v => v ? (v.length > 50 ? v.slice(0, 50) + '…' : v) : '—' },
      ],
      features: [
        { key: 'name', label: 'Nom' },
        { key: 'type', label: 'Type', render: v => v || '—' },
        { key: 'status', label: 'Statut', render: v => <span className={`${styles.statusBadge} ${styles['status' + (v.charAt(0).toUpperCase() + v.slice(1))] || ''}`}>{v}</span> },
      ],
      models: [
        { key: 'name', label: 'Nom' },
        { key: 'provider_id', label: 'Fournisseur', render: v => { const p = providerList.find(x => x.id === v); return p ? p.name : '—'; } },
        { key: 'status', label: 'Statut', render: v => <span className={`${styles.statusBadge} ${styles['status' + (v.charAt(0).toUpperCase() + v.slice(1))] || ''}`}>{v}</span> },
      ],
    };

    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns[activeTab].map(col => <th key={col.key}>{col.label}</th>)}
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                {columns[activeTab].map(col => (
                  <td key={col.key}>{col.render ? col.render(item[col.key]) : (item[col.key] || '—')}</td>
                ))}
                <td className={styles.actions}>
                  <button title="Modifier" className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(item)}>
                    <Edit3 size={16} />
                  </button>
                  <button title="Supprimer" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => openDelete(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns[activeTab].length + 1} className={styles.emptyRow}>Aucun résultat</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Gérer les données</h1>
        <input
          type="text"
          placeholder="Rechercher..."
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <span className={styles.count}>{filtered.length} élément{filtered.length > 1 ? 's' : ''}</span>
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {renderTable()}

      {/* Form modal */}
      {formModal.open && (
        <div className={styles.modalOverlay} onClick={closeForm}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{formModal.editing ? 'Modifier' : 'Ajouter'} {TABS.find(t => t.id === activeTab)?.label.slice(0, -1) || ''}</h2>
              <button className={styles.closeBtn} onClick={closeForm}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              {renderFormFields()}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeForm}>Annuler</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete.open && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete({ open: false, id: null })}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
              <h2>Confirmation</h2>
            </div>
            <p className={styles.modalMessage}>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDelete({ open: false, id: null })}>Annuler</button>
              <button className={styles.dangerBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
