import styles from "../../style/admin/adminSidebar.module.css";

// ── Icônes SVG inline (pas de dépendance Lucide dans la sidebar) ──
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  suggestions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  moderation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  penguin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="14" rx="6" ry="8" />
      <ellipse cx="12" cy="8" rx="4" ry="4" fill="white" opacity="0.2" />
      <circle cx="10" cy="7" r="1" fill="white" />
      <circle cx="14" cy="7" r="1" fill="white" />
    </svg>
  ),
};

// ── Navigation items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",   label: "Tableau de bord", icon: "dashboard" },
  { id: "users",       label: "Utilisateurs",    icon: "users",       badge: null },
  { id: "suggestions", label: "Suggestions",     icon: "suggestions", badge: 5, badgeVariant: "warning" },
  { id: "moderation",  label: "Modération",      icon: "moderation",  badge: 3, badgeVariant: "danger" },
];

/**
 * AdminSidebar
 * Props:
 *   activeTab: string
 *   setActiveTab: (tab: string) => void
 */
export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className={styles.sidebar}>
      {/* ── Logo ── */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>{icons.penguin}</div>
        <div>
          <span className={styles.logoText}>Penguin</span>
          <span className={styles.logoSub}>Admin Panel</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <span className={styles.navSection}>Navigation</span>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`${styles.navBtn} ${activeTab === item.id ? styles.navBtnActive : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {icons[item.icon]}
            {item.label}
            {item.badge && (
              <span
                className={`${styles.badge} ${
                  item.badgeVariant === "danger"
                    ? styles.badgeDanger
                    : item.badgeVariant === "warning"
                    ? styles.badgeWarning
                    : ""
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Footer utilisateur ── */}
      <div className={styles.footer}>
        <div className={styles.avatar}>A</div>
        <div className={styles.footerInfo}>
          <div className={styles.footerName}>Administrateur</div>
          <div className={styles.footerRole}>Super Admin</div>
        </div>
      </div>
    </aside>
  );
}