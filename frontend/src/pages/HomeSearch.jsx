import { useState, useEffect, useEffectEvent, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Loader2, Plus, Star, Sparkles, Menu, ArrowLeft, Clock } from "lucide-react";
import styles from "../style/Pages/HomeSearch.module.css";
import { useAuth } from "../context/AuthContext";
import api, { API_BASE } from "../services/api";

const ToolCard = ({ tool }) => (
    <div className={styles.toolCard}>
        <div className={styles.toolCardTop}>
            {tool.logo_url ? (
                <img
                    className={styles.toolLogoImage}
                    src={tool.logo_url.startsWith("http") ? tool.logo_url : `${API_BASE}${tool.logo_url}`}
                    alt={tool.name}
                />
            ) : (
                <div className={styles.toolLogo}>{tool.name?.slice(0, 2).toUpperCase() || "AI"}</div>
            )}
            <div className={styles.toolInfo}>
                <h4 className={styles.toolName}>{tool.name}</h4>
                <div className={styles.toolMeta}>
                    <span className={styles.categoryBadge}>{tool.category_name || "AI"}</span>
                    <span className={styles.rating}>
                        <Star size={13} fill="#fbbf24" />
                        {Number(tool.global_rating || tool.website_rating || 0).toFixed(1)}
                        <span className={styles.ratingValue}>/ 5</span>
                    </span>
                </div>
            </div>
        </div>
        <p className={styles.toolDescription}>{tool.description}</p>
        <ul className={styles.toolFeatureList}>
            {(tool.features?.length ? tool.features : [tool.provider_name].filter(Boolean)).map((f, i) => (
                <li key={i} className={styles.toolFeatureItem}>{f}</li>
            ))}
        </ul>
        <Link to={`/tool/${encodeURIComponent(tool.name)}`} className={styles.detailsBtn}>Détails</Link>
    </div>
);

export default function HomeSearch() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [view, setView] = useState("search");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [result, setResult] = useState(null);
    const [recommendError, setRecommendError] = useState("");
    const [historyDetailsCache, setHistoryDetailsCache] = useState({});
    const inputRef = useRef(null);
    const initialPromptRef = useRef("");

    useEffect(() => {
        if (view === "search" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [view]);

    useEffect(() => {
        let cancelled = false;

        if (!isAuthenticated) {
            Promise.resolve().then(() => {
                if (cancelled) return;
                setHistory([]);
                setHistoryError("");
            });
            return () => {
                cancelled = true;
            };
        }

        Promise.resolve().then(() => {
            if (cancelled) return;
            setHistoryLoading(true);
            setHistoryError("");
        });
        api.get("/user/search-history")
            .then((res) => {
                if (!cancelled) setHistory(res.data || []);
            })
            .catch((err) => {
                if (cancelled) return;
                setHistory([]);
                setHistoryError(err?.message || "Impossible de charger l'historique");
            })
            .finally(() => {
                if (!cancelled) setHistoryLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const handleSubmit = (term) => {
        const val = (term ?? query).trim();
        if (!val.trim()) return;
        setSearchTerm(val);
        setResult(null);
        setRecommendError("");
        setView("loading");

        api.post("/explore/recommend", { prompt: val })
            .then((res) => {
                const data = res.data || {};
                setResult(data);
                if (data.history_id) {
                    setHistoryDetailsCache((prev) => ({
                        ...prev,
                        [data.history_id]: {
                            id: data.history_id,
                            title: data.title,
                            prompt_text: data.prompt,
                            ai_reasoning: data.reasoning,
                            tools: data.tools || [],
                        },
                    }));
                }
                if (isAuthenticated && data.title) {
                    setHistory((prev) => {
                        const next = prev.filter((h) => h.id !== data.history_id && h.prompt_text !== val);
                        return [{ id: data.history_id || `local-${Date.now()}`, title: data.title, prompt_text: val }, ...next];
                    });
                }
                setView("results");
            })
            .catch((err) => {
                setRecommendError(err?.message || "Impossible de générer des recommandations.");
                setView("results");
            });
    };

    const handleHistoryClick = (item) => {
        const historyId = Number(item.id);
        if (!historyId) return;

        const cached = historyDetailsCache[historyId];
        if (cached) {
            setSearchTerm(cached.prompt_text || item.prompt_text || item.title);
            setResult({
                history_id: cached.id,
                prompt: cached.prompt_text,
                title: cached.title,
                reasoning: cached.ai_reasoning,
                tools: cached.tools || [],
            });
            setRecommendError("");
            setView("results");
            return;
        }

        setSearchTerm(item.prompt_text || item.title);
        setResult(null);
        setRecommendError("");
        setView("loading");

        api.get(`/user/search-history/details?id=${encodeURIComponent(historyId)}`)
            .then((res) => {
                const data = res.data || {};
                setHistoryDetailsCache((prev) => ({ ...prev, [historyId]: data }));
                setSearchTerm(data.prompt_text || item.prompt_text || item.title);
                setResult({
                    history_id: data.id,
                    prompt: data.prompt_text,
                    title: data.title,
                    reasoning: data.ai_reasoning,
                    tools: data.tools || [],
                });
                setView("results");
            })
            .catch((err) => {
                setRecommendError(err?.message || "Impossible de charger cet historique.");
                setView("results");
            });
    };

    const submitPromptFromUrl = useEffectEvent((prompt) => {
        setQuery(prompt);
        handleSubmit(prompt);
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const prompt = (params.get("q") || "").trim();
        if (!prompt || initialPromptRef.current === prompt) return;

        initialPromptRef.current = prompt;
        submitPromptFromUrl(prompt);
    }, [location.search]);

    const resetToSearch = () => {
        setView("search");
        setQuery("");
        setSearchTerm("");
        setResult(null);
        setRecommendError("");
    };

    return (
        <div className={styles.homeSearchWrapper}>
            <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarHidden : ""}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.closeRow}>
                        <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <button className={styles.newSearchBtn} onClick={resetToSearch}>
                        <Plus size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
                        Nouvelle recherche
                    </button>
                </div>
                <div className={styles.historyLabel}>Historique</div>
                <div className={styles.historyList}>
                    {isAuthenticated ? (
                        historyLoading ? (
                            <div className={styles.historyItem}>Chargement...</div>
                        ) : historyError ? (
                            <div className={styles.historyItem}>{historyError}</div>
                        ) : history.length === 0 ? (
                            <div className={styles.historyItem}>Aucun historique</div>
                        ) : history.map((item) => (
                            <button
                                key={item.id}
                                className={styles.historyItem}
                                onClick={() => handleHistoryClick(item)}
                            >
                                <Clock size={14} className={styles.historyIcon} />
                                {item.title}
                            </button>
                        ))
                    ) : (
                        <Link to={`/Auth?redirect=${encodeURIComponent(location.pathname)}`} className={styles.loginHistoryBtn}>
                            Connectez-vous pour voir votre historique
                        </Link>
                    )}
                </div>
            </aside>

            {!sidebarOpen && (
                <div className={styles.sidebarToggleBar}>
                    <button className={styles.toggleBtn} onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <button className={styles.floatingNewSearch} onClick={resetToSearch}>
                        <Plus size={20} />
                    </button>
                </div>
            )}

            <main className={styles.mainContent}>
                {view === "search" && (
                    <div className={styles.searchView}>
                        <h1 className={styles.glowHeading}>
                            What do you want to build today?
                        </h1>
                        <div className={styles.searchInputWrapper}>
                            <Search size={20} className={styles.searchInputIcon} />
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.searchInput}
                                placeholder="Describe the tools you need..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                            <button className={styles.searchBtn} onClick={() => handleSubmit()}>
                                Search
                            </button>
                        </div>
                    </div>
                )}

                {view === "loading" && (
                    <div className={styles.loadingView}>
                        <Loader2 size={48} className={styles.spinner} />
                        <p className={styles.loadingText}>
                            Penguin is analyzing your request...
                        </p>
                    </div>
                )}

                {view === "results" && (
                    <div className={styles.resultsView}>
                        <div className={styles.promptBubble}>
                            <div className={styles.promptLabel}>
                                <Sparkles size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Votre recherche
                            </div>
                            {searchTerm}
                        </div>

                        <div className={styles.aiPovBox}>
                            <div className={styles.aiPovTitle}>
                                <Sparkles size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                                AI Point of View
                            </div>
                            <p className={styles.aiPovText}>
                                {result?.reasoning || recommendError || "Aucune recommandation disponible pour cette recherche."}
                            </p>
                        </div>

                        {result?.tools?.length > 0 && (
                            <div className={styles.toolGrid}>
                                {result.tools.map((tool) => (
                                    <ToolCard key={tool.id} tool={tool} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
