import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Plus, Star, Sparkles } from "lucide-react";
import styles from "../style/Pages/HomeSearch.module.css";

const MOCK_HISTORY = [
    { id: 1, title: "Video editors" },
    { id: 2, title: "Code assistants" },
    { id: 3, title: "AI image generators" },
    { id: 4, title: "Grammar checkers" },
    { id: 5, title: "Music production tools" },
    { id: 6, title: "Data visualization" },
    { id: 7, title: "Note-taking apps" },
    { id: 8, title: "Screen recording software" },
];

const MOCK_RESULTS = [
    {
        id: 1,
        name: "DaVinci Resolve",
        category: "Video",
        rating: 4.8,
        logo: "DR",
        description: "Professional-grade video editing with advanced color grading and audio post-production.",
        features: ["Color grading", "Fusion VFX", "Fairlight audio"],
    },
    {
        id: 2,
        name: "Adobe Premiere Pro",
        category: "Video",
        rating: 4.6,
        logo: "PR",
        description: "Industry-standard video editing software with seamless Creative Cloud integration.",
        features: ["Multi-cam", "Auto-reframe", "Team projects"],
    },
    {
        id: 3,
        name: "Final Cut Pro",
        category: "Video",
        rating: 4.7,
        logo: "FC",
        description: "Apple's high-performance video editing solution built for the Mac ecosystem.",
        features: ["Magnetic timeline", "Proxy workflow", "HDR support"],
    },
    {
        id: 4,
        name: "CapCut",
        category: "Video",
        rating: 4.5,
        logo: "CC",
        description: "Free all-in-one video editor with AI-powered features and extensive template library.",
        features: ["Auto-captions", "AI effects", "Templates"],
    },
    {
        id: 5,
        name: "Shotcut",
        category: "Video",
        rating: 4.3,
        logo: "SC",
        description: "Open-source cross-platform video editor with wide format support.",
        features: ["Open source", "4K support", "Audio filters"],
    },
    {
        id: 6,
        name: "Kdenlive",
        category: "Video",
        rating: 4.2,
        logo: "KD",
        description: "Powerful open-source video editor with a flexible and intuitive interface.",
        features: ["Multitrack", "Proxy editing", "Effects"],
    },
];

const ToolCard = ({ tool }) => (
    <div className={styles.toolCard}>
        <div className={styles.toolCardTop}>
            <div className={styles.toolLogo}>{tool.logo}</div>
            <div className={styles.toolInfo}>
                <h4 className={styles.toolName}>{tool.name}</h4>
                <div className={styles.toolMeta}>
                    <span className={styles.categoryBadge}>{tool.category}</span>
                    <span className={styles.rating}>
                        <Star size={13} fill="#fbbf24" />
                        {tool.rating}
                        <span className={styles.ratingValue}>/ 5</span>
                    </span>
                </div>
            </div>
        </div>
        <p className={styles.toolDescription}>{tool.description}</p>
        <ul className={styles.toolFeatureList}>
            {tool.features.map((f, i) => (
                <li key={i} className={styles.toolFeatureItem}>{f}</li>
            ))}
        </ul>
        <button className={styles.detailsBtn}>Détails</button>
    </div>
);

export default function HomeSearch() {
    const [view, setView] = useState("search");
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState(MOCK_HISTORY);
    const inputRef = useRef(null);

    useEffect(() => {
        if (view === "search" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [view]);

    useEffect(() => {
        if (view !== "loading") return;
        const timer = setTimeout(() => setView("results"), 2000);
        return () => clearTimeout(timer);
    }, [view]);

    const handleSubmit = (term) => {
        const val = term ?? query;
        if (!val.trim()) return;
        setSearchTerm(val);
        if (!history.some((h) => h.title.toLowerCase() === val.toLowerCase())) {
            setHistory((prev) => [{ id: Date.now(), title: val }, ...prev]);
        }
        setView("loading");
    };

    const resetToSearch = () => {
        setView("search");
        setQuery("");
        setSearchTerm("");
    };

    return (
        <div className={styles.homeSearchWrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <button className={styles.newSearchBtn} onClick={resetToSearch}>
                        <Plus size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
                        Nouvelle recherche
                    </button>
                </div>
                <div className={styles.historyLabel}>Historique</div>
                <div className={styles.historyList}>
                    {history.map((item) => (
                        <button
                            key={item.id}
                            className={styles.historyItem}
                            onClick={() => handleSubmit(item.title)}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            </aside>

            <main className={styles.mainContent}>
                {view === "search" && (
                    <div className={styles.searchView}>
                        <h1 className={styles.glowHeading}>
                            What do you want to build today?
                        </h1>
                        <div className={styles.searchInputWrapper}>
                            <Search size={22} className={styles.searchInputIcon} />
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.searchInput}
                                placeholder="Describe the tools you need..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
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
                                Based on your need for {searchTerm.toLowerCase()}, I selected these
                                tools for their strong feature sets, user satisfaction, and
                                compatibility with modern workflows. Each recommendation balances
                                performance, ease of use, and community support.
                            </p>
                        </div>

                        <div className={styles.toolGrid}>
                            {MOCK_RESULTS.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
