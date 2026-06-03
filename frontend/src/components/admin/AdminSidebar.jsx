import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
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
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
};

// ── Navigation items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",   label: "Tableau de bord", icon: "dashboard" },
  { id: "users",       label: "Utilisateurs",    icon: "users",       badge: null },
  { id: "suggestions", label: "Validations",     icon: "suggestions", badge: 5, badgeVariant: "warning" },
  { id: "moderation",  label: "Modération",      icon: "moderation",  badge: 3, badgeVariant: "danger" },
];

/**
 * AdminSidebar
 */
export default function AdminSidebar() {
  const [theme, setTheme] = useState(
      localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );

  useEffect(() => {
      if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.add('light');
      } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.remove('light');
      }
      localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
          <NavLink
            key={item.id}
            to={`/admin/${item.id}`}
            className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.navBtnActive : ""}`
            }
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
          </NavLink>
        ))}
      </nav>

      {/* ── Theme Toggle ── */}
      <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "16px" }}>
        <button 
          onClick={toggleTheme}
          style={{
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            background: "transparent", 
            border: "1px solid var(--border)", 
            color: "var(--text-muted)", 
            padding: "8px 16px", 
            borderRadius: "8px", 
            cursor: "pointer", 
            width: "100%",
            transition: "all 0.2s"
          }}
        >
          <div style={{ width: "20px", height: "20px" }}>
            {theme === 'light' ? icons.moon : icons.sun}
          </div>
          {theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}
        </button>
      </div>

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