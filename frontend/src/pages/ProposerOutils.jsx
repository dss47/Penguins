import { useState, useRef, useEffect } from "react";
import { Menu, ArrowLeft, Clock, Plus } from "lucide-react";
import styles from "../style/Pages/ProposerOutils.module.css"
import Header from "../components/ProposerOutils/header";
import Main from "../components/ProposerOutils/main";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

const STATUS_MAP = {
    approved: { class: "Accepted", label: "Accepté" },
    rejected_ai: { class: "Rejected", label: "Refusé" },
    pending: { class: "Pending", label: "En attente" },
};

const MOCK_HISTORY = [
    { id: 1, title: "Chatbot Ninja", status: "rejected_ai" },
    { id: 2, title: "DesignEngine AI", status: "approved" },
    { id: 3, title: "Claude AI", status: "pending" },
];

function ProposerOutils() {
    const { isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isAuthenticated) return <LoginPrompt />;

    const handleHistoryClick = (id) => {
        setSelectedHistoryId(id);
        setSidebarOpen(false);
    };

    const resetSelection = () => {
        setSelectedHistoryId(null);
    };

    return (
        <div className={styles.proposerPage}>
            <div className={styles.proposerLayout}>
                <aside ref={sidebarRef} className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarHidden : ""}`}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.closeRow}>
                            <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                        <button className={styles.newSearchBtn} onClick={resetSelection}>
                            <Plus size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
                            Nouvelle soumission
                        </button>
                    </div>
                    <div className={styles.historyLabel}>Historique</div>
                    <div className={styles.historyList}>
                        {MOCK_HISTORY.map((item) => {
                            const statusInfo = STATUS_MAP[item.status] || { class: "Pending", label: "En attente" };
                            return (
                                <button
                                    key={item.id}
                                    className={`${styles.historyItem} ${selectedHistoryId === item.id ? styles.historyItemActive : ""}`}
                                    onClick={() => handleHistoryClick(item.id)}
                                >
                                    <Clock size={14} className={styles.historyIcon} />
                                    <div className={styles.historyItemContent}>
                                        <span className={styles.historyItemTitle}>{item.title}</span>
                                        <span className={`${styles.historyItemStatus} ${styles[`status${statusInfo.class}`]}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {!sidebarOpen && (
                    <div className={styles.sidebarToggleBar}>
                        <button className={styles.toggleBtn} onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <button className={styles.floatingNewSearch} onClick={resetSelection}>
                            <Plus size={20} />
                        </button>
                    </div>
                )}

                <div className={styles.mainContent}>
                    <Header />
                    <Main selectedHistoryId={selectedHistoryId} onResetSelection={resetSelection} />
                </div>
            </div>
        </div>
    );
}
export default ProposerOutils;
