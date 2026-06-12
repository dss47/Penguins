import { useState, useEffect } from "react";
import styles from "../../style/admin/adminModeration.module.css";
import BanConfirmForm from "../forms/BanConfirmForm";
import api from "../../services/api";

function getInitials(name) {
  return name ? name.slice(0, 2).toUpperCase() : "??";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function mapFlag(row) {
  let reason = "";
  let confidence = 0;
  try {
    const parsed = JSON.parse(row.ai_flag_reason || "{}");
    reason = parsed.reason || "";
    confidence = parsed.confidence_score || 0;
  } catch {}

  let severity = "minor";
  if (confidence >= 90) severity = "danger";
  else if (confidence >= 70) severity = "warning";

  return {
    id: row.id,
    userId: row.user_id,
    user: row.user_name,
    date: formatDate(row.created_at),
    content: row.comment || "",
    aiReason: reason ? `${reason} (confiance : ${confidence}%)` : "",
    severity,
    tool: row.tool_name || "",
  };
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
  const [flags, setFlags]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/moderation/reviews")
      .then((res) => {
        setFlags((res.data || []).map(mapFlag));
      })
      .catch((err) => console.error("Error fetching flagged reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  const displayed = flags.filter((f) =>
    filter === "all" ? true : f.severity === filter
  );

  const handleIgnore = (id) => {
    api.post("/admin/moderation/reviews/approve", { id })
      .then(() => setFlags((prev) => prev.filter((f) => f.id !== id)))
      .catch((err) => alert(err.message || "Erreur lors de l'approbation"));
  };

  const handleDelete = (id) => {
    api.post("/admin/moderation/reviews/delete", { id })
      .then(() => setFlags((prev) => prev.filter((f) => f.id !== id)))
      .catch((err) => alert(err.message || "Erreur lors de la suppression"));
  };

  const handleBan = (flag) => {
    api.post("/admin/users/ban", { id: flag.userId })
      .then(() => handleDelete(flag.id))
      .catch((err) => alert(err.message || "Erreur lors du bannissement"))
      .finally(() => setConfirmBan(null));
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
          <option value="minor">Mineur</option>
        </select>
        <span className={styles.filterCount}>{displayed.length} signalement(s)</span>
      </div>

      {/* ── Liste ── */}
      {loading ? (
        <div className={styles.empty}>Chargement...</div>
      ) : displayed.length === 0 ? (
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
                  <span className={`${styles.badge} ${flag.severity === "danger" ? styles.badgeDanger : flag.severity === "warning" ? styles.badgeWarning : styles.badgeMinor}`}>
                    {flag.severity === "danger" ? "⚠ Critique" : flag.severity === "warning" ? "~ Modéré" : "· Mineur"}
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
                <a href={`/tool/${encodeURIComponent(flag.tool)}`} className={styles.contextLink}>
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
                  disabled={!flag.userId}
                >
                  {banIcon} Bannir l'auteur
                </button>
              </div>

              {/* BanConfirmForm inline */}
              {confirmBan === flag.id && (
                <BanConfirmForm
                  userName={`@${flag.user}`}
                  onConfirm={() => handleBan(flag)}
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