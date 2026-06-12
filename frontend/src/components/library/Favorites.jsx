import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import style from "../../style/library/Favorites.module.css"
import api, { API_BASE } from "../../services/api";
import Favorite from "./Favorite"

const Favorites = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = () => {
        api.get("/favorites")
            .then((res) => {
                const data = (res?.data || []).map(t => ({
                    ...t,
                    icon: t.logo_url?.startsWith("/") ? API_BASE + t.logo_url : t.logo_url,
                    category: t.category_name,
                    rating: t.global_rating,
                }));
                setTools(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleToggleFavorite = (toolId, next) => {
        api.post("/favorites/toggle", { tool_id: toolId })
            .then(() => {
                if (!next) {
                    setTools(prev => prev.filter(t => t.id !== toolId));
                }
            })
            .catch(() => {});
    };

    if (loading) {
        return (
            <div className={style.toolsGrid}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gridColumn: "1 / -1", padding: "3rem 0", color: "var(--text-muted)", gap: 8 }}>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Chargement des favoris...</span>
                </div>
            </div>
        );
    }

    if (tools.length === 0) {
        return (
            <div className={style.toolsGrid}>
                <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
                    Aucun favori pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className={style.toolsGrid}>
            {tools.map((tool, index) => (
                <Favorite
                    key={tool.id}
                    icon={tool.icon}
                    name={tool.name}
                    description={tool.description}
                    rating={tool.rating}
                    category={tool.category}
                    isFavorited={true}
                    onToggleFavorite={(next) => handleToggleFavorite(tool.id, next)}
                />
            ))}
        </div>
    )
}
export default Favorites
