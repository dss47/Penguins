import { useState, useEffect } from 'react';
import api, { API_BASE } from '../../services/api';
import styles from '../../style/admin/adminTools.module.css';
import { Trash2, Archive, CheckCircle, AlertTriangle, PlayCircle, Layers } from 'lucide-react';

const AdminTools = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, toolId: null, status: null, message: '' });

    const fetchTools = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/tools');
            setTools(response.data || []);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des outils.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchTools, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleUpdateStatusClick = (id, status) => {
        setConfirmModal({
            isOpen: true,
            action: 'status',
            toolId: id,
            status: status,
            message: `Êtes-vous sûr de vouloir changer le statut de cet outil en "${status}" ?`
        });
    };

    const handleDeleteClick = (id) => {
        setConfirmModal({
            isOpen: true,
            action: 'delete',
            toolId: id,
            status: null,
            message: 'ATTENTION : Cette action est irréversible. Voulez-vous vraiment supprimer cet outil et toutes ses données associées (avis, favoris, etc.) ?'
        });
    };

    const handleConfirmAction = async () => {
        const { action, toolId, status } = confirmModal;
        try {
            if (action === 'status') {
                await api.post('/admin/tools/update-status', { id: toolId, status });
            } else if (action === 'delete') {
                await api.post('/admin/tools/delete', { id: toolId });
            }
            fetchTools(); // Refresh list
        } catch {
            alert(action === 'status' ? 'Erreur lors de la mise à jour du statut.' : 'Erreur lors de la suppression de l\'outil.');
        } finally {
            closeConfirmModal();
        }
    };

    const closeConfirmModal = () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const filteredTools = tools.filter(tool =>
        (tool.name || '').toLowerCase().includes(filter.toLowerCase()) ||
        (tool.status || '').toLowerCase().includes(filter.toLowerCase())
    );

    const statusMap = {
        active: { label: 'Actif', className: styles.statusActive, Icon: CheckCircle },
        deprecated: { label: 'Déprécié', className: styles.statusDeprecated, Icon: AlertTriangle },
        archived: { label: 'Archivé', className: styles.statusArchived, Icon: Archive },
        pending: { label: 'En attente', className: styles.statusPending, Icon: AlertTriangle },
    };

    const stats = {
        total: tools.length,
        active: tools.filter(t => t.status === 'active').length,
        archived: tools.filter(t => t.status === 'archived').length,
        deprecated: tools.filter(t => t.status === 'deprecated').length,
    };

    return (
        <div className={styles.adminToolsPage}>
            <div className={styles.header}>
                <h1>Gérer les Outils</h1>
                <input
                    type="text"
                    placeholder="Filtrer par nom ou statut..."
                    className={styles.filterInput}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className={styles.insightsContainer}>
                <div className={styles.insightCard}>
                    <div className={styles.insightHeader}>
                        <span className={styles.insightTitle}>Total AIs</span>
                        <Layers size={18} className={styles.insightIcon} />
                    </div>
                    <div className={styles.insightValue}>{stats.total}</div>
                </div>
                <div className={styles.insightCard}>
                    <div className={styles.insightHeader}>
                        <span className={styles.insightTitle}>Actifs</span>
                        <CheckCircle size={18} className={styles.insightIcon} style={{ color: 'var(--success-text)' }} />
                    </div>
                    <div className={styles.insightValue}>{stats.active}</div>
                </div>
                <div className={styles.insightCard}>
                    <div className={styles.insightHeader}>
                        <span className={styles.insightTitle}>Archivés</span>
                        <Archive size={18} className={styles.insightIcon} style={{ color: 'var(--danger-text)' }} />
                    </div>
                    <div className={styles.insightValue}>{stats.archived}</div>
                </div>
                <div className={styles.insightCard}>
                    <div className={styles.insightHeader}>
                        <span className={styles.insightTitle}>Dépréciés</span>
                        <AlertTriangle size={18} className={styles.insightIcon} style={{ color: 'var(--warning-text)' }} />
                    </div>
                    <div className={styles.insightValue}>{stats.deprecated}</div>
                </div>
            </div>

            {loading && <p>Chargement...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
                <div className={styles.tableContainer}>
                    <table className={styles.toolsTable}>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>Fournisseur</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTools.map(tool => {
                                const StatusInfo = statusMap[tool.status] || { label: tool.status, className: '', Icon: AlertTriangle };
                                return (
                                    <tr key={tool.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {tool.logo_url ? (
                                                <img 
                                                    src={tool.logo_url.startsWith('http') ? tool.logo_url : `${API_BASE}${tool.logo_url}`} 
                                                    alt={tool.name} 
                                                    style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} 
                                                />
                                            ) : (
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                                    {tool.name ? tool.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
                                            <span style={{ fontWeight: 500 }}>{tool.name}</span>
                                        </td>
                                        <td>{tool.category_name || '-'}</td>
                                        <td>{tool.provider_name || '-'}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${StatusInfo.className}`}>
                                                <StatusInfo.Icon size={14} />
                                                {StatusInfo.label}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            {tool.status !== 'active' && (
                                                <button title="Réactiver" className={`${styles.actionBtn} ${styles.reactivateBtn}`} onClick={() => handleUpdateStatusClick(tool.id, 'active')}>
                                                    <PlayCircle size={16} />
                                                </button>
                                            )}
                                            {tool.status !== 'deprecated' && (
                                                <button title="Déprécier" className={`${styles.actionBtn} ${styles.deprecateBtn}`} onClick={() => handleUpdateStatusClick(tool.id, 'deprecated')}>
                                                    <AlertTriangle size={16} />
                                                </button>
                                            )}
                                            {tool.status !== 'archived' && (
                                                 <button title="Archiver" className={`${styles.actionBtn} ${styles.archiveBtn}`} onClick={() => handleUpdateStatusClick(tool.id, 'archived')}>
                                                    <Archive size={16} />
                                                </button>
                                            )}
                                            <button title="Supprimer" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteClick(tool.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de confirmation */}
            {confirmModal.isOpen && (
                <div className={styles.modalOverlay} onClick={closeConfirmModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <AlertTriangle size={24} className={styles.modalIcon} />
                            <h2>Confirmation</h2>
                        </div>
                        <p className={styles.modalMessage}>{confirmModal.message}</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={closeConfirmModal}>Annuler</button>
                            <button 
                                className={`${styles.modalConfirmBtn} ${confirmModal.action === 'delete' ? styles.dangerBtn : styles.primaryBtn}`} 
                                onClick={handleConfirmAction}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTools;
