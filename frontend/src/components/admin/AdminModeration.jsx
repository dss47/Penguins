import { useState } from "react";
import styles from "../../style/admin/adminModeration.module.css";
import BanConfirmForm from "../forms/BanConfirmForm";

// TODO: API → GET /api/admin/moderation/flagged
const MOCK_FLAGS = [
  {
    id: 1, user: "toxic_guy99", date: "30 mai 2026",
    content: "Cet outil est une arnaque totale, les développeurs sont des incompétents finis !",
    aiReason: "Discours haineux et attaque personnelle détectés (confiance : 94%)",
    severity: "danger", tool: "Jasper AI", toolSlug: "jasper-ai",
  },
  {
    id: 2, user: "spam_bot42", date: "29 mai 2026",
    content: "Achetez nos formations IA à -80% sur formation-ia-pro.com ! Offre limitée !",
    aiReason: "Spam commercial et lien externe non autorisé détectés (confiance : 99%)",
    severity: "danger", tool: "Copy.ai", toolSlug: "copy-ai",
  },
  {
    id: 3, user: "grumpy_user", date: "28 mai 2026",
    content: "Je ne comprends pas pourquoi on paie pour ça, c'est du foutage de gueule.",
    aiReason: "Langage offensant léger détecté (confiance : 71%)",
    severity: "warning", tool: "Notion AI", toolSlug: "notion-ai",
  },
];

function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

const aiIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ignoreIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const deleteIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const banIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const linkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function AdminModeration() {
  const [filter, setFilter]       = useState("all");
  const [confirmBan, setConfirmBan] = useState(null); // id du flag
  const [flags, setFlags]         = useState(MOCK_FLAGS);

  const displayed = flags.filter((f) =>
    filter === "all" ? true : f.severity === filter
  );

  const handleIgnore = (id) => {
    setFlags((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDelete = (id) => {
    // TODO: API → DELETE /api/admin/comments/:id
    setFlags((prev) => prev.filter((f) => f.id !== id));
  };

  const handleBan = (id) => {
    // TODO: API → POST /api/admin/users/ban { userId }
    setFlags((prev) => prev.filter((f) => f.id !== id));
    setConfirmBan(null);
  };

  return (
    <div>
      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Modération</h1>
        <p className={styles.subtitle}>Commentaires signalés automatiquement par l'IA</p>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous les signalements</option>
          <option value="danger">Critique</option>
          <option value="warning">Modéré</option>
        </select>
        <span className={styles.filterCount}>{displayed.length} signalement(s)</span>
      </div>

      {/* ── Liste ── */}
      {displayed.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{banIcon}</div>
          Aucun contenu signalé. La plateforme est propre !
        </div>
      ) : (
        <div className={styles.list}>
          {displayed.map((flag) => (
            <div key={flag.id} className={styles.card}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardUser}>
                  <div className={styles.avatar}>{getInitials(flag.user)}</div>
                  <div>
                    <div className={styles.userName}>@{flag.user}</div>
                    <div className={styles.userDate}>{flag.date}</div>
                  </div>
                </div>
                <div className={styles.badgeGroup}>
                  <span className={`${styles.badge} ${flag.severity === "danger" ? styles.badgeDanger : styles.badgeWarning}`}>
                    {flag.severity === "danger" ? "⚠ Critique" : "~ Modéré"}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeAI}`}>
                    {aiIcon} IA
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className={styles.commentBody}>"{flag.content}"</div>

              {/* Raison IA */}
              <div className={styles.aiReason}>
                {aiIcon}
                <span>
                  <span className={styles.aiReasonLabel}>Raison IA : </span>
                  {flag.aiReason}
                </span>
              </div>

              {/* Contexte */}
              <div className={styles.context}>
                {linkIcon}
                Outil concerné :&nbsp;
                <a href={`/tools/${flag.toolSlug}`} className={styles.contextLink}>
                  {flag.tool}
                </a>
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                <button className={styles.btnIgnore} onClick={() => handleIgnore(flag.id)}>
                  {ignoreIcon} Ignorer
                </button>
                <button className={styles.btnDelete} onClick={() => handleDelete(flag.id)}>
                  {deleteIcon} Supprimer
                </button>
                <button
                  className={styles.btnBan}
                  onClick={() => setConfirmBan(confirmBan === flag.id ? null : flag.id)}
                >
                  {banIcon} Bannir l'auteur
                </button>
              </div>

              {/* BanConfirmForm inline */}
              {confirmBan === flag.id && (
                <BanConfirmForm
                  userName={`@${flag.user}`}
                  onConfirm={() => handleBan(flag.id)}
                  onCancel={() => setConfirmBan(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}