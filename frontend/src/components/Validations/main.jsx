import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import style from "../../style/Validations/table.module.css"

const API_BASE = "http://localhost:8000";

const STATUS_MAP = {
  attente: ["waiting_ai_analysis", "ai_approved_pending_review", "waiting_manual_validation"],
  accepte: ["published_to_catalog"],
  rejete: ["ai_rejected", "rejected_by_admin"],
};

const BADGE_CLASS = {
  waiting_ai_analysis: style.badgeAttente,
  ai_approved_pending_review: style.badgeAttente,
  waiting_manual_validation: style.badgeAttente,
  published_to_catalog: style.badgeAccepte,
  ai_rejected: style.badgeRejete,
  rejected_by_admin: style.badgeRejete,
};

const BADGE_LABEL = {
  waiting_ai_analysis: "En attente",
  ai_approved_pending_review: "Approuvé IA",
  waiting_manual_validation: "Validation req.",
  published_to_catalog: "Acceptée",
  ai_rejected: "Rejetée",
  rejected_by_admin: "Rejetée",
};

const LOGO_COLORS = [
  "#6c3fd4", "#1a7a4a", "#1a5fa8", "#a85e1a", "#a81a1a", "#0d9488",
  "#b45309", "#4f46e5", "#059669", "#dc2626", "#7c3aed", "#0284c7",
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function Main({ suggestions = [], loading = false, searchQuery = "", filterStatus = "tous", sortOption = "Plus récent", onView }) {
  let filteredOutils = suggestions.filter((s) => {
    if (filterStatus !== "tous") {
      const validStatuses = STATUS_MAP[filterStatus] || [];
      if (!validStatuses.includes(s.status)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (s.name || "").toLowerCase();
      const author = (s.author_name || "").toLowerCase();
      const category = (s.category_name || "").toLowerCase();
      if (!name.includes(q) && !author.includes(q) && !category.includes(q)) return false;
    }
    return true;
  });

  if (sortOption === "A → Z") {
    filteredOutils.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortOption === "Plus ancien") {
    filteredOutils.reverse();
  } else {
    filteredOutils.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortOption]);

  const totalPages = Math.ceil(filteredOutils.length / itemsPerPage);
  
  const currentData = filteredOutils.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className={style.tableContainer}>
        <div className={style.emptyState}>Chargement des suggestions...</div>
      </div>
    );
  }

  return(
    <>
      <div className={style.tableContainer}>
        {currentData.length === 0 ? (
          <div className={style.emptyState}>Aucune suggestion trouvée.</div>
        ) : (
          <table className={style.tableOutils}>
            <thead>
              <tr>
                <th>Outil</th>
                <th>Catégorie</th>
                <th>Soumis par</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((outil) => (
                <tr key={outil.id}>
                  <td>
                    <div className={style.outilInfo}>
                      {outil.logo_url ? (
                        <img src={outil.logo_url.startsWith("http") ? outil.logo_url : API_BASE + outil.logo_url} alt="" className={style.outilLogo} />
                      ) : (
                        <div className={style.outilLogo} style={{ background: getColor(outil.name) }}>
                          {(outil.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className={style.outilNom}>{outil.name}</div>
                        <div className={style.outilUrl}>{outil.website_url || "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className={style.tdMuted}>{outil.category_name || "-"}</td>
                  <td className={style.tdMuted}>@{outil.author_name || "inconnu"}</td>
                  <td className={style.tdMuted}>{formatDate(outil.created_at)}</td>
                  <td>
                    <span className={`${style.badge} ${BADGE_CLASS[outil.status] || style.badgeAttente}`}>
                      {BADGE_LABEL[outil.status] || outil.status}
                    </span>
                  </td>
                  <td>
                    <div className={style.actions}>
                      <button className={style.btnVoir} onClick={() => onView(outil)}>
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button 
              className={style.pageBtn} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className={style.pageInfo}>
              Page {currentPage} sur {totalPages}
            </span>
            <button 
              className={style.pageBtn} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Main;
