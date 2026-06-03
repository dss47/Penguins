import styles from "../../style/admin/adminDashboard.module.css";

// TODO: API → GET /api/admin/stats
const MOCK_STATS = [
  { id: 1, label: "Utilisateurs",   value: "1 284", delta: "+12 ce mois", deltaType: "up",   iconVariant: "accent" },
  { id: 2, label: "Outils publiés", value: "342",   delta: "+8 cette semaine", deltaType: "up",   iconVariant: "success" },
  { id: 3, label: "En attente",     value: "5",     delta: "suggestions",      deltaType: "neutral", iconVariant: "warning" },
  { id: 4, label: "Signalements",   value: "3",     delta: "à traiter",        deltaType: "neutral", iconVariant: "danger" },
];

// TODO: API → GET /api/admin/activity
const MOCK_ACTIVITY = [
  { id: 1, text: "Nouvelle suggestion soumise par @marie_d",   time: "Il y a 5 min",  dot: "dotAccent" },
  { id: 2, text: "Commentaire signalé sur « ChatGPT »",        time: "Il y a 18 min", dot: "dotDanger" },
  { id: 3, text: "Outil « Midjourney » approuvé par Manager",  time: "Il y a 1 h",    dot: "dotSuccess" },
  { id: 4, text: "Utilisateur @john_b promu Manager",          time: "Il y a 2 h",    dot: "dotWarning" },
  { id: 5, text: "Suggestion « Perplexity AI » rejetée",       time: "Il y a 3 h",    dot: "dotDanger" },
];

// TODO: API → GET /api/admin/categories/stats
const MOCK_CATEGORIES = [
  { id: 1, name: "Génération de texte", count: 98,  max: 120 },
  { id: 2, name: "Image & Design",      count: 74,  max: 120 },
  { id: 3, name: "Productivité",        count: 63,  max: 120 },
  { id: 4, name: "Code & Dev",          count: 57,  max: 120 },
  { id: 5, name: "Vidéo & Audio",       count: 31,  max: 120 },
];

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
  return (
    <div>
      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Vue d'ensemble de la plateforme Penguin</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        {MOCK_STATS.map((stat) => (
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
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={`${styles.activityDot} ${styles[item.dot]}`} />
                <div>
                  <div className={styles.activityText}>{item.text}</div>
                  <div className={styles.activityTime}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            {categoryIcon}
            Outils par catégorie
          </div>
          <div className={styles.categoryList}>
            {MOCK_CATEGORIES.map((cat) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}