import { useState } from "react";
import styles from "../../style/admin/adminSuggestions.module.css";
import RejectForm from "../forms/RejectForm";

// TODO: API → GET /api/admin/suggestions
const MOCK_SUGGESTIONS = [
  {
    id: 1, title: "Perplexity AI",       status: "pending",
    desc: "Moteur de recherche propulsé par l'IA, capable de répondre avec des sources citées en temps réel.",
    author: "@alex_t", date: "28 mai 2026", category: "Recherche",
  },
  {
    id: 2, title: "Runway Gen-3",        status: "pending",
    desc: "Génération et édition vidéo avancée par IA, avec contrôle précis du mouvement et du style.",
    author: "@chloe_m", date: "27 mai 2026", category: "Vidéo",
  },
  {
    id: 3, title: "Gamma App",           status: "pending",
    desc: "Création de présentations et documents visuels par IA en quelques secondes.",
    author: "@pierre_v", date: "25 mai 2026", category: "Productivité",
  },
  {
    id: 4, title: "ElevenLabs",          status: "pending",
    desc: "Synthèse et clonage vocal ultra-réaliste par IA, avec plus de 30 langues supportées.",
    author: "@nadia_r", date: "22 mai 2026", category: "Audio",
  },
  {
    id: 5, title: "Cursor",              status: "approved",
    desc: "Éditeur de code intégrant Claude et GPT-4 pour complétion, refactoring et génération de code.",
    author: "@hugo_b", date: "20 mai 2026", category: "Code",
  },
  {
    id: 6, title: "Fake Tool XYZ",       status: "rejected",
    desc: "Outil sans réelle valeur ajoutée, doublon d'une entrée existante.",
    author: "@spam_user", date: "15 mai 2026", category: "Autre",
  },
];

const userIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const calIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const tagIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const xIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BADGE_CLASS = { pending: styles.badgePending, approved: styles.badgeApproved, rejected: styles.badgeRejected };
const BADGE_LABEL = { pending: "En attente", approved: "Approuvé", rejected: "Rejeté" };

export default function AdminSuggestions() {
  const [activeTab, setActiveTab]   = useState("pending");
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [rejectOpen, setRejectOpen] = useState(null); // id de la suggestion

  const displayed = suggestions.filter((s) =>
    activeTab === "pending" ? s.status === "pending" : s.status !== "pending"
  );

  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  const handleApprove = (id) => {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "approved" } : s));
  };

  const handleReject = (id, reason) => {
    // TODO: API → POST /api/admin/suggestions/:id/reject { reason }
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected" } : s));
    setRejectOpen(null);
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Suggestions</h1>
        <p className={styles.subtitle}>Gestion des outils proposés par la communauté</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "pending" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          En attente
          {pendingCount > 0 && <span className={styles.tabCount}>{pendingCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "processed" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("processed")}
        >
          Traités
        </button>
      </div>

      {/* ── Grille de cards ── */}
      <div className={styles.grid}>
        {displayed.length === 0 && (
          <div className={styles.empty}>Aucune suggestion dans cette catégorie.</div>
        )}

        {displayed.map((suggestion) => (
          <div key={suggestion.id} className={styles.card}>
            {/* Header */}
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{suggestion.title}</div>
              <span className={`${styles.badge} ${BADGE_CLASS[suggestion.status]}`}>
                {BADGE_LABEL[suggestion.status]}
              </span>
            </div>

            {/* Description */}
            <p className={styles.cardDesc}>{suggestion.desc}</p>

            {/* Meta */}
            <div className={styles.cardMeta}>
              <span className={styles.metaItem}>{userIcon}{suggestion.author}</span>
              <span className={styles.metaItem}>{calIcon}{suggestion.date}</span>
              <span className={styles.metaItem}>{tagIcon}{suggestion.category}</span>
            </div>

            {/* Actions (seulement pour pending) */}
            {suggestion.status === "pending" && (
              <>
                <div className={styles.cardActions}>
                  <button
                    className={styles.btnApprove}
                    onClick={() => handleApprove(suggestion.id)}
                  >
                    {checkIcon} Approuver
                  </button>
                  <button
                    className={styles.btnReject}
                    onClick={() => setRejectOpen(rejectOpen === suggestion.id ? null : suggestion.id)}
                  >
                    {xIcon} Rejeter
                  </button>
                </div>

                {/* RejectForm inline */}
                {rejectOpen === suggestion.id && (
                  <RejectForm
                    onConfirm={(reason) => handleReject(suggestion.id, reason)}
                    onCancel={() => setRejectOpen(null)}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}