import styles from "../style/Pages/Library.module.css"
import { useState, useEffect } from "react";
import Shelves from '../components/library/Shelves'
import Favorites from '../components/library/Favorites'
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";
import api from "../services/api";

const Library = () => {
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState("shelves");
    const [stats, setStats] = useState({ favorites: 0, shelves: 0, totalTools: 0 });

    useEffect(() => {
        if (!isAuthenticated) return;
        Promise.all([
            api.get("/favorites").then(r => r?.data || []),
            api.get("/shelves").then(r => r?.data || []),
        ])
            .then(([favs, shelves]) => {
                const shelfToolCount = shelves.reduce((sum, s) => sum + (s.tool_count || 0), 0);
                setStats({
                    favorites: favs.length,
                    shelves: shelves.length,
                    totalTools: favs.length + shelfToolCount,
                });
            })
            .catch(() => {});
    }, [isAuthenticated]);

    if (!isAuthenticated) return <LoginPrompt />;

    return (
        <div className={styles.libraryPageWrapper}>
            <div className={styles.noise}></div>
            <div className={styles.libraryContainer}>
                <div className={`${styles.topSection} ${styles.pageEnter}`} style={{animationDelay: '0.05s'}}>
                    <div className={styles.titleArea}>
                        <span className={styles.eyebrow}>PERSONAL SPACE</span>
                        <h1 className={styles.title}>My Library</h1>
                        <p className={styles.subtitle}>Your saved tools, organized the way you work.</p>
                    </div>

                    <div className={styles.statsStrip}>
                        <div className={styles.statBox} style={{animationDelay: '0.2s'}}>
                            <span className={styles.statValue} style={{color: '#c4b5fd'}}>{stats.favorites}</span>
                            <span className={styles.statLabel}>Favorites</span>
                        </div>
                        <div className={styles.statBox} style={{animationDelay: '0.3s'}}>
                            <span className={styles.statValue} style={{color: '#93c5fd'}}>{stats.shelves}</span>
                            <span className={styles.statLabel}>Shelves</span>
                        </div>
                        <div className={styles.statBox} style={{animationDelay: '0.4s'}}>
                            <span className={styles.statValue} style={{color: '#86efac'}}>{stats.totalTools}</span>
                            <span className={styles.statLabel}>Total Tools</span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.tabBar} ${styles.pageEnter}`} style={{animationDelay: '0.12s'}} role="tablist">
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
                        onClick={() => setActiveTab('favorites')}
                        role="tab"
                        aria-selected={activeTab === 'favorites'}
                    >
                        <span className={styles.tabIcon}>❤️</span>
                        Favorites
                        <span className={styles.tabBadge}>{stats.favorites}</span>
                    </button>

                    <button
                        className={`${styles.tabBtn} ${activeTab === 'shelves' ? styles.active : ''}`}
                        onClick={() => setActiveTab('shelves')}
                        role="tab"
                        aria-selected={activeTab === 'shelves'}
                    >
                        <span className={styles.tabIcon}>📁</span>
                        My Shelves
                        <span className={styles.tabBadge}>{stats.shelves}</span>
                    </button>
                </div>

                <div className={styles.sectionDivider}></div>

                <div className={styles.contentArea}>
                    {activeTab === 'favorites' ? <Favorites /> : <Shelves />}
                </div>
            </div>
        </div>
    );
}
export default Library
