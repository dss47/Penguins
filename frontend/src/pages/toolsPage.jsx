import styles from "../style/Pages/toolpage.module.css"
import ToolComponent from "../components/tools/toolComponent"
import ShelfPicker from "../components/library/ShelfPicker"
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, ListOrdered, Loader2 } from "lucide-react";
import api, { API_BASE } from "../services/api";

export default function ToolPage() {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("none");
    const [selectedCategory, setSelectedCategory] = useState("Any");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [pickerToolId, setPickerToolId] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        api.get("/tools")
            .then((res) => {
                const data = (res?.data || []).map(t => ({
                    ...t,
                    icon: t.logo_url?.startsWith("/") ? API_BASE + t.logo_url : t.logo_url,
                    rating: t.global_rating,
                    provider: t.provider_name,
                    category: t.category_name,
                }));
                setTools(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        api.get("/favorites")
            .then((res) => {
                const favs = res?.data || [];
                setFavoriteIds(new Set(favs.map(f => Number(f.id))));
            })
            .catch(() => {});
    }, []);

    const handleToggleFavorite = useCallback((toolId, next) => {
        api.post("/favorites/toggle", { tool_id: toolId }).catch(() => {});
        setFavoriteIds(prev => {
            const nextSet = new Set(prev);
            if (next) nextSet.add(Number(toolId));
            else nextSet.delete(Number(toolId));
            return nextSet;
        });
    }, []);

    const query = searchQuery.toLowerCase();

    let searchResults = tools
        .filter(tool =>
            tool.name.toLowerCase().includes(query) ||
            (tool.provider || "").toLowerCase().includes(query) ||
            (tool.category || "").toLowerCase().includes(query) ||
            (tool.features || []).some(f => f.toLowerCase().includes(query))
        );

    const categories = [...new Set(tools.map(tool => tool.category).filter(Boolean))];

    if (selectedCategory !== "Any") {
        searchResults = searchResults
            .filter(tool =>
                (tool.category || "").toLowerCase() === selectedCategory.toLowerCase());
    }

    if (sortOption === "name") {
        searchResults.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortOption === "rating") {
        searchResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSortSelect = (value) => {
        setSortOption(value);
        setIsSortOpen(false);
    };

    const getSortLabel = () => {
        switch (sortOption) {
            case "name": return "Nom (A-Z)";
            case "rating": return "Note (Décroissante)";
            default: return "Trier par...";
        }
    };

    if (loading) {
        return (
            <div className={styles.allToolsContainer}>
                <div className={styles.noise}></div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "var(--text-muted)", gap: 12 }}>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Chargement des outils...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.allToolsContainer}>
            <div className={styles.noise}></div>
            <div className={styles.headerSection}>
                <h1>Découvrez nos Meilleurs Outils IA</h1>
                <div className={styles.searchBox}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, fournisseur, ou catégorie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h3 className={styles.sidebarTitle}>Trier</h3>
                        <div className={styles.customDropdown} ref={dropdownRef}>
                            <div 
                                className={styles.dropdownHeader} 
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                <ListOrdered size={18} className={styles.dropdownIcon} />
                                <span>{getSortLabel()}</span>
                                <ChevronDown 
                                    size={18} 
                                    className={`${styles.chevron} ${isSortOpen ? styles.chevronOpen : ""}`} 
                                />
                            </div>
                            
                            {isSortOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div 
                                        className={`${styles.dropdownItem} ${sortOption === "none" ? styles.dropdownItemActive : ""}`} 
                                        onClick={() => handleSortSelect("none")}
                                    >
                                        Par défaut
                                    </div>
                                    <div 
                                        className={`${styles.dropdownItem} ${sortOption === "name" ? styles.dropdownItemActive : ""}`} 
                                        onClick={() => handleSortSelect("name")}
                                    >
                                        Nom (A-Z)
                                    </div>
                                    <div 
                                        className={`${styles.dropdownItem} ${sortOption === "rating" ? styles.dropdownItemActive : ""}`} 
                                        onClick={() => handleSortSelect("rating")}
                                    >
                                        Note (Décroissante)
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h3 className={styles.sidebarTitle}>Catégories</h3>
                        <ul className={styles.categoriesList}>
                            <li>
                                <button 
                                    className={selectedCategory === "Any" ? styles.activeCategoryBtn : styles.categoryBtn} 
                                    onClick={() => setSelectedCategory("Any")} 
                                >
                                    Toutes les catégories
                                    <span className={styles.categoryCount}>{tools.length}</span>
                                </button>
                            </li>
                            {categories.map((category, index) => {
                                const count = tools.filter(t => t.category === category).length;
                                return (
                                    <li key={index}>
                                        <button 
                                            className={selectedCategory === category ? styles.activeCategoryBtn : styles.categoryBtn} 
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                            <span className={styles.categoryCount}>{count}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>

                <div className={styles.rightColumn}>
                    <div className={styles.resultsHeader}>
                        <p>{searchResults.length} outil{searchResults.length > 1 ? "s" : ""} trouvé{searchResults.length > 1 ? "s" : ""}</p>
                    </div>
                    <div className={styles.gridWrapper}>
                        <ToolComponent
                            tools={searchResults}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={handleToggleFavorite}
                            onOpenShelfPicker={(id) => setPickerToolId(id)}
                        />
                    </div>
                </div>
            </div>

            {pickerToolId && (
                <ShelfPicker toolId={pickerToolId} onClose={() => setPickerToolId(null)} />
            )}
        </div>
    )
}