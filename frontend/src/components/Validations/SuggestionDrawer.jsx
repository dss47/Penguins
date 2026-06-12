import { useState } from "react";
import { X, ExternalLink, Bot, AlertTriangle, CheckCircle, XCircle, ArrowRight, Check, Star } from "lucide-react";
import style from "../../style/Validations/table.module.css";
import api from "../../services/api";
import RejectForm from "../forms/RejectForm";

const API_BASE = "http://localhost:8000";

const BADGE_LABEL = {
  waiting_ai_analysis: "En attente IA",
  ai_approved_pending_review: "Approuvé IA",
  waiting_manual_validation: "Validation Manuelle",
  published_to_catalog: "Publié",
  ai_rejected: "Rejeté IA",
  rejected_by_admin: "Rejeté Admin",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ComparisonRow({ label, userValue, aiValue }) {
  const isIdentical =
    String(userValue ?? "") === String(aiValue ?? "") ||
    (!userValue && !aiValue);

  if (isIdentical) {
    const display = userValue || aiValue;
    if (!display) return null;
    return (
      <div className={`${style.comparisonPair} ${style.comparisonPairIdentical}`}>
        <div className={style.comparisonIdenticalIcon}>
          <Check size={14} />
          <span>{label}:</span>
          <span className={style.comparisonValue}>{display}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={style.comparisonPair}>
      <div className={style.comparisonSide}>
        <span className={style.comparisonLabel}>{label}</span>
        <span className={`${style.comparisonValue} ${!userValue ? style.comparisonValueMuted : ""}`}>
          {userValue || "Non renseigné"}
        </span>
      </div>
      <div className={style.comparisonArrow}>
        <ArrowRight size={18} />
      </div>
      <div className={style.comparisonSide}>
        <span className={style.comparisonAiLabel}>{label}</span>
        <span className={`${style.comparisonValue} ${!aiValue ? style.comparisonValueMuted : ""}`}>
          {aiValue || "Non corrigé"}
        </span>
      </div>
    </div>
  );
}

export default function SuggestionDrawer({
  suggestion,
  onClose,
  onUpdate,
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleClose = () => {
    setClosing(true);
  };

  const handleTransitionEnd = (e) => {
    if (e.propertyName === "transform" && closing) {
      onClose();
    }
  };

  const handleFastTrack = () => {
    setActionLoading(true);
    api
      .post("/admin/suggestions/approve", { id: suggestion.id })
      .then((res) => {
        const toolId = res?.data?.tool_id;
        onUpdate(suggestion.id, {
          status: "published_to_catalog",
          ...(toolId && { tool_id: toolId }),
        });
        handleClose();
      })
      .catch((err) => alert(err.message || "Erreur"))
      .finally(() => setActionLoading(false));
  };

  const handleRejectConfirm = (reason) => {
    setActionLoading(true);
    api
      .post("/admin/suggestions/reject", { id: suggestion.id, reason })
      .then(() => {
        onUpdate(suggestion.id, { status: "rejected_by_admin" });
        handleClose();
      })
      .catch((err) => alert(err.message || "Erreur"))
      .finally(() => setActionLoading(false));
  };

  const handleViewTool = () => {
    if (suggestion.tool_id) {
      window.open(`/tool/${suggestion.tool_id}`, "_blank");
    }
  };

  const {
    name,
    logo_url,
    website_url,
    status,
    category_name,
    fixed_category_name,
    provider_name,
    fixed_provider_name,
    model_name,
    fixed_model_name,
    existing_feature_names,
    fixed_feature_names,
    release_date,
    fixed_release_date,
    description,
    why_this_tool,
    ai_moderation_notes,
    rejection_reason,
    fixed_name,
    fixed_url,
    model_names,
    fixed_model_names,
    ai_global_rating,
    fixed_description,
  } = suggestion;

  const displayName = fixed_name || name;
  const displayUrl = fixed_url || website_url;
  const userFeatures = Array.isArray(existing_feature_names) ? existing_feature_names : [];
  const aiFeatures = Array.isArray(fixed_feature_names) ? fixed_feature_names : [];

  const badgeClass =
    status === "waiting_ai_analysis" ? style.drawerBadgeWaiting :
    status === "ai_approved_pending_review" ? style.drawerBadgeApproved :
    status === "waiting_manual_validation" ? style.drawerBadgeManual :
    status === "published_to_catalog" ? style.drawerBadgePublished :
    status === "ai_rejected" ? style.drawerBadgeRejected :
    status === "rejected_by_admin" ? style.drawerBadgeRejectedAdmin :
    "";

  return (
    <>
      <div
        className={`${style.drawerOverlay} ${closing ? style.drawerOverlayOut : style.drawerOverlayIn}`}
        onClick={handleClose}
      />
      <div
        className={`${style.drawer} ${closing ? style.drawerClosing : style.drawerOpen}`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* HEADER */}
        <div className={style.drawerHeader}>
          <button className={style.drawerCloseBtn} onClick={handleClose}>
            <X size={16} />
          </button>
          {logo_url ? (
            <img src={logo_url.startsWith("http") ? logo_url : API_BASE + logo_url} alt="" className={style.drawerLogo} />
          ) : (
            <div className={style.drawerLogoPlaceholder}>
              {(displayName || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className={style.drawerInfo}>
            <div className={style.drawerTitle}>{displayName}</div>
            {displayUrl && (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={style.drawerLink}
              >
                <ExternalLink size={12} />
                {displayUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
          <span className={`${style.drawerBadge} ${badgeClass}`}>
            {BADGE_LABEL[status] || status}
          </span>
        </div>

        {/* BODY */}
        <div className={style.drawerBody}>
          {/* METADATA COMPARISON */}
          <div className={style.comparisonGrid}>
            <div className={style.comparisonTitle}>Comparaison des métadonnées</div>

            <ComparisonRow label="Nom" userValue={name} aiValue={fixed_name} />
            <ComparisonRow label="URL" userValue={website_url} aiValue={fixed_url} />
            <ComparisonRow label="Catégorie" userValue={category_name} aiValue={fixed_category_name} />
            <ComparisonRow label="Fournisseur" userValue={provider_name} aiValue={fixed_provider_name} />
            <ComparisonRow
              label="Modèles"
              userValue={Array.isArray(model_names) && model_names.length ? model_names.join(", ") : model_name || null}
              aiValue={Array.isArray(fixed_model_names) && fixed_model_names.length ? fixed_model_names.join(", ") : fixed_model_name || null}
            />
            <ComparisonRow
              label="Fonctionnalités"
              userValue={userFeatures.length > 0 ? userFeatures.join(", ") : null}
              aiValue={aiFeatures.length > 0 ? aiFeatures.join(", ") : null}
            />
            <ComparisonRow
              label="Date de sortie"
              userValue={formatDate(release_date)}
              aiValue={formatDate(fixed_release_date)}
            />
            {ai_global_rating && (
              <div className={style.comparisonPairIdentical} style={{ padding: "10px 14px" }}>
                <div className={style.comparisonIdenticalIcon}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>Note IA:</span>
                  <span className={style.comparisonValue}>{ai_global_rating} / 5</span>
                </div>
              </div>
            )}
          </div>

          {/* AUDIT */}
          <div className={style.auditBlock}>
            <div className={style.auditSection}>
              <span className={style.auditLabel}>Description</span>
              {fixed_description && fixed_description !== description ? (
                <div className={style.comparisonPair} style={{ marginTop: 8 }}>
                  <div className={style.comparisonSide}>
                    <span className={style.comparisonLabel}>Original</span>
                    <span className={style.comparisonValue}>{description || "Non renseigné"}</span>
                  </div>
                  <div className={style.comparisonArrow}><ArrowRight size={18} /></div>
                  <div className={style.comparisonSide}>
                    <span className={style.comparisonAiLabel}>Correction IA</span>
                    <span className={style.comparisonValue}>{fixed_description}</span>
                  </div>
                </div>
              ) : (
                <p className={style.auditText}>{description || "—"}</p>
              )}
            </div>
            {why_this_tool && (
              <div className={style.auditSection}>
                <span className={style.auditLabel}>Pourquoi cet outil</span>
                <p className={style.auditText}>{why_this_tool}</p>
              </div>
            )}
          </div>

          {ai_moderation_notes && (
            <div className={style.aiVerdictBlock}>
              <div className={style.aiVerdictIcon}><Bot size={18} /></div>
              <div className={style.aiVerdictText}>{ai_moderation_notes}</div>
            </div>
          )}

          {(status === "ai_rejected" || status === "rejected_by_admin") && rejection_reason && (
            <div className={style.rejectionBlock}>
              <div className={style.rejectionIcon}><AlertTriangle size={18} /></div>
              <div className={style.rejectionText}>{rejection_reason}</div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={style.drawerFooter}>
          <div className={style.footerActions}>
            {status === "ai_approved_pending_review" && (
              <button className={style.btnFastTrack} onClick={handleFastTrack} disabled={actionLoading}>
                <CheckCircle size={16} />
                {actionLoading ? "Publication..." : "Ajouter aux outils (Fast-Track)"}
              </button>
            )}
            {status === "waiting_manual_validation" && (
              <>
                <button className={style.btnApproveDrawer} onClick={handleFastTrack} disabled={actionLoading}>
                  <CheckCircle size={16} />
                  {actionLoading ? "Publication..." : "Approuver manuellement"}
                </button>
                <button className={style.btnRejectDrawer} onClick={() => setRejectOpen(true)} disabled={actionLoading}>
                  <XCircle size={16} />
                  Rejeter
                </button>
              </>
            )}
            {status === "published_to_catalog" && (
              <button className={style.btnViewTool} onClick={handleViewTool}>
                <ExternalLink size={16} />
                Voir l'outil en ligne
              </button>
            )}
            {["waiting_ai_analysis", "ai_rejected", "rejected_by_admin"].includes(status) && (
              <button className={style.btnDrawerClose} onClick={handleClose}>
                Fermer le dossier
              </button>
            )}
          </div>
          {rejectOpen && (
            <RejectForm
              onConfirm={handleRejectConfirm}
              onCancel={() => setRejectOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}
