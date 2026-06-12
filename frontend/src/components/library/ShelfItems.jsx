import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, X, Search, Plus } from "lucide-react";
import style from "../../style/library/ShelfItems.module.css"
import api, { API_BASE } from "../../services/api";
import Favorite from "./Favorite"

const ShelfItems = () => {
    const { shelfIndex } = useParams();
    const [shelf, setShelf] = useState(null);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [allTools, setAllTools] = useState([]);
    const [pickerSearch, setPickerSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [adding, setAdding] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const fetchShelfItems = () => {
        Promise.all([
            api.get("/shelves/items?id=" + shelfIndex),
            api.get("/favorites"),
        ])
            .then(([shelfRes, favRes]) => {
                const d = shelfRes?.data || {};
                const shelfMeta = d.shelf || null;
                const toolList = d.tools || [];
                const mapped = toolList.map(t => ({
                    ...t,
                    icon: t.logo_url?.startsWith("/") ? API_BASE + t.logo_url : t.logo_url,
                    category: t.category_name,
                    rating: t.global_rating,
                }));
                setTools(mapped);
                setShelf(shelfMeta);
                const favTools = favRes?.data || [];
                setFavoriteIds(new Set(favTools.map(f => f.id)));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        setError(false);
        fetchShelfItems();
    }, [shelfIndex]);

    const openPicker = () => {
        setShowPicker(true);
        setPickerSearch("");
        setSelectedIds(new Set());
        api.get("/tools")
            .then((res) => setAllTools(res?.data || []))
            .catch(() => {});
    };

    const filteredTools = useMemo(() => {
        const q = pickerSearch.toLowerCase();
        return allTools.filter(t =>
            t.name?.toLowerCase().includes(q) ||
            t.category_name?.toLowerCase().includes(q) ||
            t.provider_name?.toLowerCase().includes(q)
        );
    }, [allTools, pickerSearch]);

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleAddTools = async () => {
        setAdding(true);
        for (const toolId of selectedIds) {
            try {
                await api.post("/shelves/toggle", { shelf_id: Number(shelfIndex), tool_id: toolId });
            } catch {}
        }
        setAdding(false);
        setShowPicker(false);
        fetchShelfItems();
    };

    const handleRemove = async (index) => {
        const tool = tools[index];
        if (!tool) return;
        try {
            await api.post("/shelves/toggle", { shelf_id: Number(shelfIndex), tool_id: tool.id });
        } catch {}
        setTools(tools.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className={style.pageWrapper}>
                <div className={style.pageContainer}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem 0", color: "var(--text-muted)", gap: 8 }}>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={style.pageWrapper}>
                <div className={style.pageContainer}>
                    <div className={style.emptyState}>
                        <p className={style.emptyIcon}>⚠️</p>
                        <p className={style.emptyText}>Collection introuvable</p>
                        <Link to="/Library" className={style.emptyBack}>Back to Library</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={style.pageWrapper}>
            <div className={style.pageContainer}>
                <div className={style.shelfHeader}>
                    <Link to="/Library" className={style.backBtn}>
                        ← Back to Library
                    </Link>
                    <div className={style.shelfInfoRow}>
                        <div className={style.shelfInfo}>
                            <div className={style.shelfIconLarge}>📁</div>
                            <div>
                                <h1 className={style.shelfTitle}>{shelf?.name || "Collection"}</h1>
                                <p className={style.shelfDesc}>{shelf?.description || ""}</p>
                            </div>
                        </div>
                        <button className={style.addToolBtn} onClick={openPicker}>
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className={style.toolCount}>
                        {tools.length} tool{tools.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {tools.length > 0 ? (
                    <div className={style.toolsGrid}>
                                {tools.map((tool, index) => (
                                    <Favorite
                                        key={tool.id}
                                        icon={tool.icon}
                                        name={tool.name}
                                        description={tool.description}
                                        rating={tool.rating}
                                        category={tool.category}
                                        removeButton
                                        onRemove={() => handleRemove(index)}
                                        isFavorited={favoriteIds.has(tool.id)}
                                        onToggleFavorite={(next) => {
                                            api.post("/favorites/toggle", { tool_id: tool.id })
                                                .then(() => {
                                                    setFavoriteIds(prev => {
                                                        const nextSet = new Set(prev);
                                                        if (next) nextSet.add(tool.id);
                                                        else nextSet.delete(tool.id);
                                                        return nextSet;
                                                    });
                                                })
                                                .catch(() => {});
                                        }}
                                    />
                                ))}
                    </div>
                ) : (
                    <div className={style.emptyState}>
                        <p className={style.emptyIcon}>📭</p>
                        <p className={style.emptyText}>This shelf is empty.</p>
                        <p className={style.emptySub}>Add tools to get started.</p>
                        <button className={style.emptyAddBtn} onClick={openPicker}>
                            <Plus size={18} /> Ajouter des outils
                        </button>
                    </div>
                )}
            </div>

            {showPicker && (
                <div className={style.modalOverlay} onClick={() => setShowPicker(false)}>
                    <div className={style.pickerDialog} onClick={(e) => e.stopPropagation()}>
                        <div className={style.pickerHeader}>
                            <h3>Ajouter des outils</h3>
                            <button className={style.pickerClose} onClick={() => setShowPicker(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={style.pickerSearch}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un outil..."
                                value={pickerSearch}
                                onChange={(e) => setPickerSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className={style.pickerList}>
                            {filteredTools.map((t) => {
                                const alreadyInShelf = tools.some(t2 => t2.id === t.id);
                                return (
                                    <label key={t.id} className={`${style.pickerItem} ${alreadyInShelf ? style.pickerItemDisabled : ""}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(t.id)}
                                            disabled={alreadyInShelf}
                                            onChange={() => !alreadyInShelf && toggleSelect(t.id)}
                                        />
                                        <span className={style.pickerToolName}>{t.name}</span>
                                        <span className={style.pickerToolMeta}>{t.category_name}</span>
                                    </label>
                                );
                            })}
                            {filteredTools.length === 0 && (
                                <p className={style.pickerEmpty}>Aucun outil trouvé.</p>
                            )}
                        </div>
                        <div className={style.pickerActions}>
                            <button className={style.pickerCancelBtn} onClick={() => setShowPicker(false)}>
                                Annuler
                            </button>
                            <button
                                className={style.pickerAddBtn}
                                disabled={selectedIds.size === 0 || adding}
                                onClick={handleAddTools}
                            >
                                {adding ? "Ajout..." : `Ajouter (${selectedIds.size})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShelfItems
