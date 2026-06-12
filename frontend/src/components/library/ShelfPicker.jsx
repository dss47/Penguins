import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import api from "../../services/api";
import style from "../../style/library/ShelfPicker.module.css";

export default function ShelfPicker({ toolId, onClose }) {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/shelves")
            .then((res) => setShelves(res?.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = async (shelfId, alreadyIn) => {
        try {
            await api.post("/shelves/toggle", { shelf_id: shelfId, tool_id: toolId });
            setShelves(prev =>
                prev.map(s =>
                    s.id === shelfId
                        ? { ...s, tool_count: alreadyIn ? s.tool_count - 1 : s.tool_count + 1, tools: alreadyIn ? (s.tools || []).filter(t => t.id !== toolId) : [...(s.tools || []), { id: toolId }] }
                        : s
                )
            );
        } catch {}
    };

    const isInShelf = (shelf) => (shelf.tools || []).some(t => Number(t.id) === Number(toolId));

    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.dialog} onClick={(e) => e.stopPropagation()}>
                <div className={style.header}>
                    <h3>Ajouter à une collection</h3>
                    <button className={style.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={style.list}>
                    {loading ? (
                        <p className={style.empty}>Chargement...</p>
                    ) : shelves.length === 0 ? (
                        <p className={style.empty}>Aucune collection. Créez-en une depuis votre bibliothèque.</p>
                    ) : (
                        shelves.map((shelf) => {
                            const inShelf = isInShelf(shelf);
                            return (
                                <div key={shelf.id} className={style.item}>
                                    <div className={style.itemInfo}>
                                        <span className={style.itemIcon}>📁</span>
                                        <div>
                                            <p className={style.itemName}>{shelf.name}</p>
                                            <p className={style.itemCount}>{shelf.tool_count} outil{shelf.tool_count > 1 ? "s" : ""}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`${style.toggleBtn} ${inShelf ? style.toggleActive : ""}`}
                                        onClick={() => handleToggle(shelf.id, inShelf)}
                                        title={inShelf ? "Retirer" : "Ajouter"}
                                    >
                                        {inShelf ? <Minus size={16} /> : <Plus size={16} />}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}