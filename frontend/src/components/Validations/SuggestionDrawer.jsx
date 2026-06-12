import { useState } from "react";
import { X, ExternalLink, Bot, AlertTriangle, CheckCircle, XCircle, ArrowRight, Check, Star, Pencil, Save, Trash2 } from "lucide-react";
import CreatableSelect from "react-select/creatable";
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
  formOptions = { categories: [], providers: [], models: [], features: [] },
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    fixed_name: suggestion.fixed_name || suggestion.name || "",
    fixed_url: suggestion.fixed_url || suggestion.website_url || "",
    fixed_description: suggestion.description || "",
    fixed_category_id: String(suggestion.fixed_category_id || suggestion.category_id || ""),
    fixed_provider_id: String(suggestion.fixed_provider_id || suggestion.provider_id || ""),
    fixed_release_date: suggestion.fixed_release_date || suggestion.release_date || "",
  });
  const [editModels, setEditModels] = useState(null);
  const [editFeatures, setEditFeatures] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const optionsMap = {
    categories: (formOptions.categories || []).map((c) => ({ value: c.id, label: c.name })),
    providers: (formOptions.providers || []).map((p) => ({ value: p.id, label: p.name })),
    models: (formOptions.models || []).map((m) => ({ value: m.id, label: m.name })),
    features: (formOptions.features || []).map((f) => ({ value: f.id, label: f.name })),
  };

  const parseIds = (raw) => {
    if (!raw) return [];
    const str = typeof raw === "string" ? raw : JSON.stringify(raw);
    const ids = str.startsWith("[") ? (JSON.parse(str) || []) : str ? str.split(",").map(Number) : [];
    return ids;
  };

  const startEditing = () => {
    setEditForm({
      fixed_name: suggestion.fixed_name || suggestion.name || "",
      fixed_url: suggestion.fixed_url || suggestion.website_url || "",
      fixed_description: suggestion.description || "",
      fixed_category_id: String(suggestion.fixed_category_id || suggestion.category_id || ""),
      fixed_provider_id: String(suggestion.fixed_provider_id || suggestion.provider_id || ""),
      fixed_release_date: suggestion.fixed_release_date || suggestion.release_date || "",
    });
    const modelIds = parseIds(suggestion.fixed_model_ids || suggestion.model_ids);
    setEditModels(optionsMap.models.filter((m) => modelIds.includes(Number(m.value))));
    const featIds = parseIds(suggestion.fixed_feature_ids || suggestion.existing_feature_ids);
    setEditFeatures(optionsMap.features.filter((f) => featIds.includes(Number(f.value))));
    setLogoFile(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setLogoFile(null);
  };

  const saveEditing = () => {
    setSaving(true);
    const hasFile = logoFile !== null;
    const payload = {
      id: suggestion.id,
      fixed_name: editForm.fixed_name,
      fixed_url: editForm.fixed_url,
      fixed_description: editForm.fixed_description,
      fixed_category_id: editForm.fixed_category_id,
      fixed_provider_id: editForm.fixed_provider_id,
      fixed_model_ids: editModels ? JSON.stringify(editModels.map((m) => m.value)) : "[]",
      fixed_feature_ids: editFeatures ? JSON.stringify(editFeatures.map((f) => f.value)) : "[]",
      fixed_release_date: editForm.fixed_release_date || null,
    };

    const sendData = () => {
      if (hasFile) {
        const fd = new FormData();
        fd.append("logo", logoFile);
        Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v ?? "")));
        return api.post("/admin/suggestions/update", fd);
      }
      return api.post("/admin/suggestions/update", payload);
    };

    sendData()
      .then((res) => {
        const updated = res.data;
        if (updated) {
          onUpdate(suggestion.id, updated);
        }
        setIsEditing(false);
        setLogoFile(null);
      })
      .catch((err) => alert(err.message || "Erreur lors de la sauvegarde"))
      .finally(() => setSaving(false));
  };

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
        onUpdate(suggestion.id, { status: "rejected_by_admin", rejection_reason: reason });
        handleClose();
      })
      .catch((err) => alert(err.message || "Erreur"))
      .finally(() => setActionLoading(false));
  };

  const handleDeleteSuggestion = () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette suggestion de la base de données ? Cette action est irréversible.")) {
      return;
    }
    setActionLoading(true);
    api
      .post("/admin/suggestions/delete", { id: suggestion.id })
      .then(() => {
        onUpdate(suggestion.id, { deleted: true });
        handleClose();
      })
      .catch((err) => alert(err.message || "Erreur lors de la suppression"))
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

  const fs = () => ({
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    width: "100%",
    marginBottom: "1rem",
  });

  const inputStyle = {
    background: "var(--bg-card-h, rgba(255,255,255,0.05))",
    border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
    borderRadius: "10px",
    color: "var(--tp, #fff)",
    fontSize: "0.88rem",
    padding: "0.65rem 0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

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
          <button
            onClick={isEditing ? cancelEditing : startEditing}
            title={isEditing ? "Annuler" : "Modifier"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isEditing ? "#f87171" : "var(--text-muted, #94a3b8)",
              padding: "6px",
              marginLeft: "0.5rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className={style.drawerBody}>
          {isEditing ? (
            <div style={{ padding: "0.25rem 0" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
                ✏️ Modifier la suggestion
              </div>

              {/* Logo upload */}
              <div style={fs("logo")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Logo</label>
                <label style={{
                  border: "2px dashed var(--border-color, rgba(255,255,255,0.15))",
                  borderRadius: "10px",
                  padding: "1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--text-muted, #94a3b8)",
                  fontSize: "0.82rem",
                  transition: "border-color 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                }}>
                  <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }} onChange={(e) => setLogoFile(e.target.files[0] || null)} />
                  {logoFile ? logoFile.name : (logo_url ? "Changer le logo" : "Ajouter un logo")}
                  <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>PNG, JPG, WebP (max 5MB)</span>
                </label>
              </div>

              {/* Name */}
              <div style={fs("name")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Nom</label>
                <input type="text" style={inputStyle} value={editForm.fixed_name} onChange={(e) => setEditForm((p) => ({ ...p, fixed_name: e.target.value }))} />
              </div>

              {/* URL */}
              <div style={fs("url")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>URL</label>
                <input type="url" style={inputStyle} value={editForm.fixed_url} onChange={(e) => setEditForm((p) => ({ ...p, fixed_url: e.target.value }))} />
              </div>

              {/* Category */}
              <div style={fs("cat")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Catégorie</label>
                <CreatableSelect
                  classNamePrefix="react-select"
                  placeholder="Choisir une catégorie"
                  isClearable
                  options={optionsMap.categories}
                  value={optionsMap.categories.find((c) => String(c.value) === String(editForm.fixed_category_id)) || null}
                  onChange={(opt) => setEditForm((p) => ({ ...p, fixed_category_id: opt ? String(opt.value) : "" }))}
                />
              </div>

              {/* Provider */}
              <div style={fs("prov")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Fournisseur</label>
                <CreatableSelect
                  classNamePrefix="react-select"
                  placeholder="Choisir un fournisseur"
                  isClearable
                  options={optionsMap.providers}
                  value={optionsMap.providers.find((p) => String(p.value) === String(editForm.fixed_provider_id)) || null}
                  onChange={(opt) => setEditForm((p) => ({ ...p, fixed_provider_id: opt ? String(opt.value) : "" }))}
                />
              </div>

              {/* Models */}
              <div style={fs("models")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Modèles</label>
                <CreatableSelect
                  classNamePrefix="react-select"
                  placeholder="Choisir des modèles"
                  isClearable
                  isMulti
                  options={optionsMap.models}
                  value={editModels || []}
                  onChange={(opt) => setEditModels(opt || [])}
                />
              </div>

              {/* Features */}
              <div style={fs("feats")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Fonctionnalités</label>
                <CreatableSelect
                  classNamePrefix="react-select"
                  placeholder="Choisir des fonctionnalités"
                  isClearable
                  isMulti
                  options={optionsMap.features}
                  value={editFeatures || []}
                  onChange={(opt) => setEditFeatures(opt || [])}
                />
              </div>

              {/* Description */}
              <div style={fs("desc")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical", fontFamily: "inherit" }} value={editForm.fixed_description} onChange={(e) => setEditForm((p) => ({ ...p, fixed_description: e.target.value }))} />
              </div>

              {/* Release date */}
              <div style={fs("date")}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted, #94a3b8)" }}>Date de sortie</label>
                <input type="date" style={inputStyle} value={editForm.fixed_release_date} onChange={(e) => setEditForm((p) => ({ ...p, fixed_release_date: e.target.value }))} />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  style={{
                    padding: "0.6rem 1.4rem",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "var(--text-muted, #94a3b8)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={saveEditing}
                  disabled={saving}
                  style={{
                    padding: "0.6rem 1.4rem",
                    border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Save size={15} />
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* FOOTER */}
        {!isEditing && (
          <div className={style.drawerFooter}>
            <div className={style.footerActions}>
              {status === "ai_approved_pending_review" && (
                <>
                  <button className={style.btnFastTrack} onClick={handleFastTrack} disabled={actionLoading}>
                    <CheckCircle size={16} />
                    {actionLoading ? "Publication..." : "Ajouter aux outils (Fast-Track)"}
                  </button>
                  <button className={style.btnRejectDrawer} onClick={() => setRejectOpen(true)} disabled={actionLoading}>
                    <XCircle size={16} />
                    Rejeter
                  </button>
                </>
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
              {!suggestion.tool_id && (
                <button 
                  className={style.btnRejectDrawer} 
                  style={{ marginLeft: "auto", backgroundColor: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" }}
                  onClick={handleDeleteSuggestion} 
                  disabled={actionLoading}
                  title="Supprimer la suggestion"
                >
                  <Trash2 size={16} />
                  Supprimer
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
        )}
      </div>
    </>
  );
}
