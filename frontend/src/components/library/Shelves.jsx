import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import style from "../../style/library/Shelves.module.css"
import api from "../../services/api";
import Shelf from "./Shelf"

const Shelves = () => {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formName, setFormName] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchShelves = () => {
        api.get("/shelves")
            .then((res) => setShelves(res?.data || []))
            .catch(() => {});
    };

    useEffect(() => {
        api.get("/shelves")
            .then((res) => setShelves(res?.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setFormName("");
        setFormDesc("");
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formName.trim()) return;
        setSubmitting(true);
        try {
            const res = await api.post("/shelves/create", {
                name: formName.trim(),
                description: formDesc.trim() || null,
            });
            if (res?.success) {
                resetForm();
                fetchShelves();
            }
        } catch {}
        setSubmitting(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!formName.trim() || !editId) return;
        setSubmitting(true);
        try {
            const res = await api.post("/shelves/update", {
                id: editId,
                name: formName.trim(),
                description: formDesc.trim() || null,
            });
            if (res?.success) {
                resetForm();
                fetchShelves();
            }
        } catch {}
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.post("/shelves/delete", { id });
            if (res?.success) {
                setConfirmDelete(null);
                fetchShelves();
            }
        } catch {}
    };

    if (loading) {
        return (
            <div className={style.shelvesGrid}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gridColumn: "1 / -1", padding: "3rem 0", color: "var(--text-muted)", gap: 8 }}>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Chargement des collections...</span>
                </div>
            </div>
        );
    }

    const formatLastUpdated = (dateStr) => {
        if (!dateStr) return "";
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return "Mis à jour aujourd'hui";
        if (days === 1) return "Mis à jour hier";
        return `Mis à jour il y a ${days} jours`;
    };

    return (
        <>
            <div className={style.shelvesGrid}>
                <div className={`${style.newShelfCard} ${style.cardEnter}`} onClick={() => setShowForm(true)}>
                    <div className={style.newShelfIcon}>
                        <svg className={style.plusSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <div>
                        <p className={style.newShelfLabel}>Nouvelle collection</p>
                        <p className={style.newShelfSub}>Organisez vos outils dans un espace de travail</p>
                    </div>
                </div>
                {shelves.map((stack, index) => (
                    <Shelf
                        key={index}
                        icon="📁"
                        title={stack.name}
                        description={stack.description || "Aucune description"}
                        toolCount={`${stack.tool_count} outil${stack.tool_count > 1 ? "s" : ""}`}
                        lastUpdated={formatLastUpdated(stack.updated_at)}
                        shelfIndex={stack.id}
                        shelfData={{
                            icon: "📁",
                            title: stack.name,
                            description: stack.description || "",
                            tools: (stack.tools || []).map(t => ({
                                ...t,
                                icon: "🔧",
                                category: t.category_name,
                                rating: t.global_rating,
                            })),
                        }}
                        onEdit={() => {
                            setEditId(stack.id);
                            setFormName(stack.name);
                            setFormDesc(stack.description || "");
                            setShowForm(true);
                        }}
                        onDelete={() => setConfirmDelete(stack.id)}
                    />
                ))}
            </div>

            {showForm && (
                <div className={style.modalOverlay} onClick={resetForm}>
                    <div className={style.modalDialog} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3 className={style.modalTitle}>{editId ? "Modifier la collection" : "Nouvelle collection"}</h3>
                            <button className={style.modalClose} onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={editId ? handleEdit : handleCreate}>
                            <label className={style.fieldLabel}>Nom</label>
                            <input
                                className={style.fieldInput}
                                type="text"
                                placeholder="Ex: Podcast Stack"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                autoFocus
                                required
                            />
                            <label className={style.fieldLabel}>Description (optionnelle)</label>
                            <textarea
                                className={style.fieldTextarea}
                                placeholder="À quoi sert cette collection ?"
                                value={formDesc}
                                onChange={(e) => setFormDesc(e.target.value)}
                                rows={3}
                            />
                            <div className={style.modalActions}>
                                <button type="button" className={style.cancelBtn} onClick={resetForm}>
                                    Annuler
                                </button>
                                <button type="submit" className={style.createBtn} disabled={submitting || !formName.trim()}>
                                    {submitting ? "En cours..." : editId ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className={style.modalOverlay} onClick={() => setConfirmDelete(null)}>
                    <div className={`${style.modalDialog} ${style.modalConfirm}`} onClick={(e) => e.stopPropagation()}>
                        <h3 className={style.modalTitle}>Supprimer la collection ?</h3>
                        <p className={style.confirmText}>Les outils qu'elle contient ne seront pas supprimés, mais la collection disparaîtra.</p>
                        <div className={style.modalActions}>
                            <button type="button" className={style.cancelBtn} onClick={() => setConfirmDelete(null)}>
                                Annuler
                            </button>
                            <button type="button" className={style.deleteBtn} onClick={() => handleDelete(confirmDelete)}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Shelves
