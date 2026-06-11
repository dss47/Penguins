import styles from "../../style/admin/adminDashboard.module.css";

import React, { useState, useEffect } from "react";
import api from "../../services/api";

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return `Il y a ${Math.floor(interval)} an${Math.floor(interval) > 1 ? 's' : ''}`;
  interval = seconds / 2592000;
  if (interval > 1) return `Il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `Il y a ${Math.floor(interval)} jour${Math.floor(interval) > 1 ? 's' : ''}`;
  interval = seconds / 3600;
  if (interval > 1) return `Il y a ${Math.floor(interval)} h`;
  interval = seconds / 60;
  if (interval > 1) return `Il y a ${Math.floor(interval)} min`;
  return `À l'instant`;
};

// ── Icônes SVG inline ─────────────────────────────────────────────
const StatIcon = ({ variant }) => {
  const icons = {
    accent: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    danger: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  };
  return icons[variant] || null;
};

const activityIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const categoryIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: "var(--tp)", padding: "2rem" }}>Chargement du tableau de bord...</div>;
  }

  if (!data) {
    return <div style={{ color: "var(--danger)", padding: "2rem" }}>Erreur lors du chargement des données.</div>;
  }

  const statsList = [
    { id: 1, label: "Utilisateurs",   value: data.stats.users, delta: "", deltaType: "neutral",   iconVariant: "accent" },
    { id: 2, label: "Outils actifs", value: data.stats.active_ai_tools,   delta: "", deltaType: "neutral",   iconVariant: "success" },
    { id: 3, label: "En attente",     value: data.stats.pending_manager_suggestions,     delta: "suggestions",      deltaType: "neutral", iconVariant: "warning" },
    { id: 4, label: "Signalements",   value: data.stats.flagged_reviews,     delta: "à traiter",        deltaType: "neutral", iconVariant: "danger" },
  ];

  const activityList = data.activity.map((item, index) => ({
    id: index,
    text: item.type === "suggestion" 
      ? `Suggestion d'outil avec statut: ${item.status}` 
      : `Signalement avec statut: ${item.status}`,
    time: timeAgo(item.created_at),
    dot: item.type === "suggestion" ? "dotWarning" : "dotDanger"
  }));

  const maxCount = Math.max(...data.categories.map(c => c.tool_count), 1);
  const categoryList = data.categories.map((cat, index) => ({
    id: index,
    name: cat.name,
    count: cat.tool_count,
    max: maxCount
  })).sort((a, b) => b.count - a.count);

  return (
    <div>
      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Vue d'ensemble de la plateforme Penguin</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        {statsList.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>{stat.label}</span>
              <div className={`${styles.statIcon} ${styles[`statIcon${stat.iconVariant.charAt(0).toUpperCase() + stat.iconVariant.slice(1)}`]}`}>
                <StatIcon variant={stat.iconVariant} />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={`${styles.statDelta} ${stat.deltaType === "up" ? styles.deltaUp : stat.deltaType === "down" ? styles.deltaDown : ""}`}>
                {stat.deltaType === "up" ? "↑ " : stat.deltaType === "down" ? "↓ " : ""}{stat.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section double colonnes ── */}
      <div className={styles.grid2}>
        {/* Activité récente */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            {activityIcon}
            Activité récente
          </div>
          <div className={styles.activityList}>
            {activityList.length === 0 ? (
              <div style={{ color: "var(--ts)", fontSize: "0.9rem" }}>Aucune activité récente.</div>
            ) : (
              activityList.map((item) => (
                <div key={item.id} className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles[item.dot]}`} />
                  <div>
                    <div className={styles.activityText}>{item.text}</div>
                    <div className={styles.activityTime}>{item.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Catégories */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            {categoryIcon}
            Outils par catégorie
          </div>
          <div className={styles.categoryList}>
            {categoryList.length === 0 ? (
              <div style={{ color: "var(--ts)", fontSize: "0.9rem" }}>Aucune catégorie.</div>
            ) : (
              categoryList.map((cat) => (
                <div key={cat.id} className={styles.categoryRow}>
                  <div className={styles.categoryMeta}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryCount}>{cat.count} outils</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${Math.round((cat.count / cat.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}