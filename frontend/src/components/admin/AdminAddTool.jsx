import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, Clock, Plus, AlertTriangle, Info } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";
import api from "../../services/api";

import sidebarStyles from "../../style/Pages/ProposerOutils.module.css";
import formStyles from "../../style/ProposerOutils/ProposerOutils.module.css";

const STATUS_MAP = {
    waiting_ai_analysis:        { class: "Pending",  label: "Analyse IA..." },
    ai_approved_pending_review: { class: "Accepted", label: "Approuvé (IA)" },
    ai_rejected:                { class: "Rejected", label: "Refusé (IA)" },
    waiting_manual_validation:  { class: "Pending",  label: "En attente" },
    published_to_catalog:       { class: "Accepted", label: "Publié" },
    rejected_by_admin:          { class: "Rejected", label: "Refusé" },
};

const API_BASE = "http://localhost:8000";

function diffRows(item) {
    const changes = [];
    if (item.fixed_name && item.fixed_name !== item.name) changes.push({ field: "Nom", from: item.name, to: item.fixed_name });
    if (item.fixed_url && item.fixed_url !== item.website_url) changes.push({ field: "URL", from: item.website_url, to: item.fixed_url });
    if (item.fixed_description && item.fixed_description !== item.description) changes.push({ field: "Description", from: item.description, to: item.fixed_description });
    if (item.fixed_category_id && Number(item.fixed_category_id) !== Number(item.category_id)) changes.push({ field: "Catégorie", from: item.category_name || String(item.category_id), to: item.fixed_category_name || String(item.fixed_category_id) });
    if (item.fixed_provider_id && Number(item.fixed_provider_id) !== Number(item.provider_id)) changes.push({ field: "Fournisseur", from: item.provider_name || String(item.provider_id), to: item.fixed_provider_name || String(item.fixed_provider_id) });
    if (item.fixed_release_date && item.fixed_release_date !== item.release_date) changes.push({ field: "Date de sortie", from: item.release_date, to: item.fixed_release_date });
    if (item.fixed_model_ids) {
        const from = (item.model_names && item.model_names.length > 0) ? item.model_names.join(", ") : (typeof item.model_ids === "string" ? item.model_ids : JSON.stringify(item.model_ids));
        const to = (item.fixed_model_names && item.fixed_model_names.length > 0) ? item.fixed_model_names.join(", ") : (typeof item.fixed_model_ids === "string" ? item.fixed_model_ids : JSON.stringify(item.fixed_model_ids));
        const normalize = (s) => JSON.stringify(s ? (s.startsWith("[") ? JSON.parse(s) : s.split(",").filter(Boolean).map(Number).sort()) : []);
        if (normalize(item.model_ids || "[]") !== normalize(item.fixed_model_ids || "[]")) changes.push({ field: "Modèles", from, to });
    }
    if (item.fixed_feature_ids) {
        const from = (item.existing_feature_names && item.existing_feature_names.length > 0) ? item.existing_feature_names.join(", ") : (typeof item.existing_feature_ids === "string" ? item.existing_feature_ids : JSON.stringify(item.existing_feature_ids));
        const to = (item.fixed_feature_names && item.fixed_feature_names.length > 0) ? item.fixed_feature_names.join(", ") : (typeof item.fixed_feature_ids === "string" ? item.fixed_feature_ids : JSON.stringify(item.fixed_feature_ids));
        const normalizeFeat = (s) => JSON.stringify(s ? (s.startsWith("[") ? JSON.parse(s) : s.split(",").filter(Boolean).map(Number).sort()) : []);
        if (normalizeFeat(item.existing_feature_ids || "[]") !== normalizeFeat(item.fixed_feature_ids || "[]")) changes.push({ field: "Fonctionnalités", from, to });
    }
    return changes;
}

export default function AdminAddTool() {
    const location = useLocation();
    const isManager = location.pathname.startsWith("/manager");
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);
    const fileInputRef = useRef(null);

    const [history, setHistory] = useState([]);
    const [historyData, setHistoryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [provider, setProvider] = useState(null);
    const [name, setName] = useState("");
    const [categorie, setCategorie] = useState(null);
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [features, setFeatures] = useState(null);
    const [dateReleased, setDateReleased] = useState("");
    const [model, setModel] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    const [options, setOptions] = useState({ categories: [], providers: [], features: [], models: [] });
    const [optionsLoading, setOptionsLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editModels, setEditModels] = useState(null);
    const [editFeatures, setEditFeatures] = useState(null);
    const [saving, setSaving] = useState(false);

    const historyItem = selectedHistoryId ? historyData[selectedHistoryId] : null;

    useEffect(() => {
        api.get("/admin/data/lists")
            .then((res) => {
                const d = res.data || {};
                setOptions({
                    categories: (d.categories || []).map((c) => ({ value: c.id, label: c.name })),
                    providers:  (d.providers || []).map((p) => ({ value: p.id, label: p.name })),
                    features:   (d.features || []).map((f) => ({ value: f.id, label: f.name })),
                    models:     (d.models || []).map((m) => ({ value: m.id, label: m.name })),
                });
            })
            .catch((err) => console.error("Error fetching form data lists:", err))
            .finally(() => setOptionsLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        api.get("/admin/suggestions/history")
            .then((res) => {
                const items = res.data || [];
                setHistory(items.map((s) => ({ id: s.id, title: s.name, status: s.status })));
                const data = {};
                items.forEach((s) => { data[s.id] = s; });
                setHistoryData(data);
            })
            .catch((err) => console.error("Error fetching suggestion history:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (historyItem) {
            setStep(2);
        } else {
            setStep(1);
        }
    }, [selectedHistoryId, historyItem]);

    const handleHistoryClick = (id) => {
        setSelectedHistoryId(id);
    };

    const resetSelection = () => {
        setSelectedHistoryId(null);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("website_url", url);
        formData.append("description", description);
        formData.append("category_id", categorie?.value ?? "");
        formData.append("provider_id", provider?.value ?? "");
        formData.append("model_id", model?.[0]?.value ?? "");
        formData.append("model_ids", JSON.stringify(model?.map((m) => m.value) ?? []));
        formData.append("existing_feature_ids", features?.map((f) => f.value).join(",") ?? "");
        formData.append("release_date", dateReleased || "");
        if (logoFile) formData.append("logo", logoFile);

        const tempId = `temp_${Date.now()}`;
        setHistory((prev) => [{ id: tempId, title: name, status: "waiting_ai_analysis" }, ...prev]);
        setHistoryData((prev) => ({
            ...prev,
            [tempId]: {
                id: tempId, name, status: "waiting_ai_analysis",
                website_url: url, created_at: new Date().toISOString(),
            },
        }));
        setSelectedHistoryId(tempId);
        setStep(2);

        api.post("/admin/suggestions/create", formData)
            .then((res) => {
                const item = res.data;
                if (!item?.id) {
                    const message = item?.message || "Erreur de traitement de la réponse serveur";
                    setHistoryData((prev) => ({
                        ...prev,
                        [tempId]: { ...prev[tempId], status: "waiting_manual_validation", rejection_reason: message },
                    }));
                    setHistory((prev) => prev.map((h) =>
                        h.id === tempId ? { ...h, status: "waiting_manual_validation" } : h
                    ));
                    return;
                }
                setHistory((prev) => prev.map((h) =>
                    h.id === tempId ? { id: item.id, title: item.name, status: item.status } : h
                ));
                setHistoryData((prev) => {
                    const next = { ...prev };
                    delete next[tempId];
                    next[item.id] = item;
                    return next;
                });
                setSelectedHistoryId(item.id);
            })
            .catch((err) => {
                const message = err?.message || err?.details || "Erreur lors de la soumission";
                setHistoryData((prev) => ({
                    ...prev,
                    [tempId]: {
                        ...prev[tempId],
                        status: "waiting_manual_validation",
                        rejection_reason: message,
                    },
                }));
                setHistory((prev) => prev.map((h) =>
                    h.id === tempId ? { ...h, status: "waiting_manual_validation" } : h
                ));
            })
            .finally(() => setSubmitting(false));
    };

    const handleFinalizeAdd = () => {
        api.post("/admin/suggestions/approve", { id: selectedHistoryId })
            .then(() => {
                setHistory((prev) => prev.filter((h) => h.id !== selectedHistoryId));
                setHistoryData((prev) => {
                    const next = { ...prev };
                    delete next[selectedHistoryId];
                    return next;
                });
                resetSelection();
            })
            .catch((err) => alert(err.message || "Erreur lors de l'approbation"));
    };

    const startEditing = () => {
        setIsEditing(true);
        setEditForm({
            name: historyItem?.fixed_name || historyItem?.name || "",
            website_url: historyItem?.fixed_url || historyItem?.website_url || "",
            description: historyItem?.description || "",
            category_id: String(historyItem?.fixed_category_id || historyItem?.category_id || ""),
            provider_id: String(historyItem?.fixed_provider_id || historyItem?.provider_id || ""),
            existing_feature_ids: historyItem?.fixed_feature_ids || historyItem?.existing_feature_ids || "",
            release_date: historyItem?.fixed_release_date || historyItem?.release_date || "",
        });
        const rawModels = historyItem?.fixed_model_ids || historyItem?.model_ids || "";
        const ids = typeof rawModels === "string" ? (rawModels.startsWith("[") ? JSON.parse(rawModels) : rawModels ? rawModels.split(",").map(Number) : []) : (rawModels || []);
        setEditModels(options.models.filter((m) => ids.includes(m.value)));
        const rawFeats = historyItem?.fixed_feature_ids || historyItem?.existing_feature_ids || "";
        const fid = typeof rawFeats === "string" ? (rawFeats.startsWith("[") ? JSON.parse(rawFeats) : rawFeats ? rawFeats.split(",").map(Number) : []) : (rawFeats || []);
        setEditFeatures(options.features.filter((f) => fid.includes(f.value)));
    };

    const handleEditChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditForm({});
        setEditModels(null);
        setEditFeatures(null);
    };

    const saveEditing = () => {
        setSaving(true);
        const payload = {
            id: selectedHistoryId,
            fixed_name: editForm.name,
            fixed_url: editForm.website_url,
            fixed_description: editForm.description,
            fixed_category_id: editForm.category_id,
            fixed_provider_id: editForm.provider_id,
            fixed_model_ids: editModels ? JSON.stringify(editModels.map((m) => m.value)) : "[]",
            fixed_feature_ids: editFeatures ? JSON.stringify(editFeatures.map((f) => f.value)) : "[]",
            fixed_release_date: editForm.release_date || null,
        };
        api.post("/admin/suggestions/update", payload)
            .then((res) => {
                const updated = res.data;
                setHistoryData((prev) => ({ ...prev, [selectedHistoryId]: updated }));
                setIsEditing(false);
                setEditForm({});
                setEditModels(null);
                setEditFeatures(null);
            })
            .catch((err) => alert(err.message || "Erreur lors de la sauvegarde"))
            .finally(() => setSaving(false));
    };

    const resetForm = () => {
        setProvider(null);
        setName("");
        setCategorie(null);
        setDescription("");
        setUrl("");
        setFeatures(null);
        setDateReleased("");
        setModel(null);
        setLogoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setStep(1);
    };

    return (
        <div className={sidebarStyles.proposerPage} style={{ background: "transparent" }}>
            <div className={sidebarStyles.proposerLayout}>
                <aside className={`${sidebarStyles.sidebar} ${!sidebarExpanded ? sidebarStyles.sidebarCollapsed : ""}`} style={isManager ? { left: 0, top: "144px", height: "calc(100vh - 144px)", zIndex: 101 } : undefined}>
                    <div className={sidebarStyles.sidebarHeader}>
                        <button className={sidebarStyles.toggleBtn} onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                    <button className={sidebarStyles.newSearchBtn} onClick={resetSelection}>
                        <Plus size={18} />
                        <span className={sidebarStyles.newSearchBtnLabel}>Nouvel outil</span>
                    </button>
                    <div className={sidebarStyles.historyLabel}>Historique</div>
                    <div className={sidebarStyles.historyList}>
                        {loading ? (
                            <div className={sidebarStyles.historyItem} style={{ justifyContent: "center", opacity: 0.5 }}>
                                <Clock size={14} />
                                {sidebarExpanded && <span style={{ marginLeft: 8 }}>Chargement...</span>}
                            </div>
                        ) : history.length === 0 ? (
                            <div className={sidebarStyles.historyItem} style={{ justifyContent: "center", opacity: 0.5 }}>
                                <Clock size={14} />
                                {sidebarExpanded && <span style={{ marginLeft: 8 }}>Aucun historique</span>}
                            </div>
                        ) : history.map((item) => {
                            const statusInfo = STATUS_MAP[item.status] || { class: "Pending", label: "En attente" };
                            return (
                                <button
                                    key={item.id}
                                    className={`${sidebarStyles.historyItem} ${selectedHistoryId === item.id ? sidebarStyles.historyItemActive : ""}`}
                                    onClick={() => handleHistoryClick(item.id)}
                                >
                                    <Clock size={14} className={sidebarStyles.historyIcon} />
                                    <div className={sidebarStyles.historyItemContent}>
                                        <span className={sidebarStyles.historyItemTitle}>{item.title}</span>
                                        <span className={`${sidebarStyles.historyItemStatus} ${sidebarStyles[`status${statusInfo.class}`]}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className={sidebarStyles.mainContent} style={{ padding: "2rem" }}>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "1rem 0 2rem", color: "var(--text-head)", textAlign: "center" }}>
                        Ajouter un outil IA
                    </h1>

                    <div className={formStyles["proposer-layout"]} style={{ padding: 0, minHeight: "auto", width: "100%", maxWidth: "960px", margin: "0 auto" }}>
                        <div className={formStyles["form-wrapper"]}>
                            {/* Stepper (2 steps) */}
                            <div className={formStyles.stepper}>
                                {["Informations", "Résultat"].map((label, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <div className={formStyles["step-line"]}></div>}
                                        <div className={`${formStyles.step} ${step >= i + 1 ? formStyles["step-active"] : ""} ${step === i + 1 ? formStyles["step-current"] : ""}`}>
                                            <div className={formStyles["step-number"]}>{step > i + 1 ? "✓" : i + 1}</div>
                                            <div className={formStyles["step-info"]}>
                                                <span className={formStyles["step-title"]}>{label}</span>
                                                <span className={formStyles["step-sub"]}>
                                                    {i === 0 ? "Détails de l'outil" : "Validation"}
                                                </span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <form className={formStyles["form-card"]} onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <>
                                        <div className={formStyles["form-row-full"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Image *</label>
                                                <label className={formStyles["upload-zone"]}>
                                                    <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/webp" onChange={(e) => setLogoFile(e.target.files[0] || null)} />
                                                    <span><FontAwesomeIcon icon={faCloudArrowUp} className={formStyles["upload-icon"]} /></span>
                                                    <span className={formStyles["upload-text"]}>{logoFile ? logoFile.name : <><span>Glissez-déposez une image ou </span><strong>cliquez pour parcourir</strong></>}</span>
                                                    <span className={formStyles["upload-hint"]}>PNG, JPG ou WebP (max. 5MB)</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className={formStyles["form-row-half"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Name *</label>
                                                <input type="text" className={formStyles["form-input"]} placeholder="Ex : ChatGPT" value={name} onChange={(e) => setName(e.target.value)} />
                                                <span className={formStyles["form-hint"]}>Le nom officiel de l'outil</span>
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Url *</label>
                                                <input type="url" className={formStyles["form-input"]} placeholder="https://exemple.com" value={url} onChange={(e) => setUrl(e.target.value)} />
                                                <span className={formStyles["form-hint"]}>Le lien officiel vers l'outil</span>
                                            </div>
                                        </div>

                                        <div className={formStyles["form-row-full"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Description *</label>
                                                <textarea className={formStyles["form-textarea"]} placeholder="Décrivez brièvement cet outil et son utilité" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
                                                <span className={formStyles["form-counter"]}>{description.length}/500</span>
                                            </div>
                                        </div>

                                        <div className={formStyles["form-row-half"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Category *</label>
                                                <CreatableSelect classNamePrefix="react-select" options={options.categories} value={categorie} onChange={setCategorie} placeholder="Sélectionnez..." isLoading={optionsLoading} />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Features *</label>
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={options.features} value={features} onChange={setFeatures} placeholder="Ajoutez des fonctionnalités..." isLoading={optionsLoading} />
                                            </div>
                                        </div>

                                        <div className={formStyles["form-row-thirds"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Provider *</label>
                                                <CreatableSelect classNamePrefix="react-select" options={options.providers} value={provider} onChange={setProvider} placeholder="Ex: OpenAI" isLoading={optionsLoading} />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Released date *</label>
                                                <input type="date" className={formStyles["form-input"]} value={dateReleased} onChange={(e) => setDateReleased(e.target.value)} />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Model</label>
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={options.models} value={model} onChange={setModel} placeholder="Ex : GPT-4" isLoading={optionsLoading} />
                                            </div>
                                        </div>

                                        <div className={formStyles["form-footer"]}>
                                            <button type="button" className={formStyles["btn-reset"]} onClick={resetForm}>
                                                Réinitialiser
                                            </button>
                                                <button type="submit" className={formStyles["btn-submit"]} disabled={submitting}>
                                                    {submitting ? "Analyse IA..." : "Soumettre"}
                                                </button>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    historyItem ? (
                                        <div className={formStyles["history-view"]}>
                                            <div className={formStyles["avatar-frame"]}>
                                                {historyItem.logo_url ? (
                                                    <img src={historyItem.logo_url.startsWith("http") ? historyItem.logo_url : API_BASE + historyItem.logo_url} alt={historyItem.name} />
                                                ) : (
                                                    <div className={formStyles["avatar-fallback"]}>🤖</div>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                                                <h2 className={formStyles["history-detail-title"]} style={{ margin: 0 }}>
                                                    {historyItem.fixed_name || historyItem.name}
                                                </h2>
                                                {!isEditing && (
                                                    <button type="button" onClick={startEditing} title="Modifier les données" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted, #94a3b8)", padding: "4px" }}>
                                                        ✏️
                                                    </button>
                                                )}
                                            </div>
                                            <span className={`${formStyles.capsule} ${
                                                historyItem.status === "ai_approved_pending_review" || historyItem.status === "published_to_catalog" ? formStyles["capsule-approved"] :
                                                historyItem.status === "ai_rejected" || historyItem.status === "rejected_by_admin" ? formStyles["capsule-rejected"] :
                                                formStyles["capsule-pending"]
                                            }`}>
                                                {STATUS_MAP[historyItem.status]?.label || "En attente"}
                                            </span>
                                            {historyItem.status === "waiting_ai_analysis" && (
                                                <div className={formStyles["info-box"]}>
                                                    <div className={formStyles["alert-content"]}>
                                                        <span className={formStyles["history-detail-label"]}>ANALYSE IA EN COURS</span>
                                                        <p className={formStyles["alert-text"]}>L'IA vérifie les informations de l'outil. Veuillez patienter...</p>
                                                    </div>
                                                </div>
                                            )}
                                            {(historyItem.status === 'ai_rejected' || historyItem.status === 'rejected_by_admin') && historyItem.rejection_reason && (
                                                <div className={formStyles["alert-box"]}>
                                                    <AlertTriangle size={20} className={formStyles["alert-icon"]} color="#f87171" />
                                                    <div className={formStyles["alert-content"]}>
                                                        <span className={formStyles["history-detail-label"]}>RAISON DU REFUS</span>
                                                        <p className={formStyles["alert-text"]}>{historyItem.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {historyItem.ai_moderation_notes && (
                                                <div className={formStyles["info-box"]}>
                                                    <Info size={20} className={formStyles["alert-icon"]} color="#0ea5e9" />
                                                    <div className={formStyles["alert-content"]}>
                                                        <span className={formStyles["history-detail-label"]}>NOTES DE MODÉRATION IA</span>
                                                        <p className={formStyles["alert-text"]}>{historyItem.ai_moderation_notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {diffRows(historyItem).length > 0 && (
                                                <div className={formStyles["history-view"]} style={{ marginTop: "1rem" }}>
                                                    <span className={formStyles["history-detail-label"]}>MODIFICATIONS EFFECTUÉES</span>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                                                        <thead>
                                                            <tr style={{ borderBottom: "1px solid var(--border-color, #e2e8f0)" }}>
                                                                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--text-muted, #94a3b8)" }}>Champ</th>
                                                                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--text-muted, #94a3b8)" }}>Avant</th>
                                                                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--text-muted, #94a3b8)" }}>Après</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {diffRows(historyItem).map((r, i) => (
                                                                <tr key={i} style={{ borderBottom: "1px solid var(--border-color, #e2e8f0)" }}>
                                                                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>{r.field}</td>
                                                                    <td style={{ padding: "0.5rem", color: "#f87171" }}>{r.from}</td>
                                                                    <td style={{ padding: "0.5rem", color: "#34d399" }}>{r.to}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            <div className={formStyles["history-bottom-grid"]}>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>SITE WEB</span>
                                                    <a className={formStyles["detail-link"]} href={historyItem.fixed_url || historyItem.website_url} target="_blank" rel="noopener noreferrer">{historyItem.fixed_url || historyItem.website_url}</a>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>CATÉGORIE</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.fixed_category_name || historyItem.category_name || historyItem.fixed_category_id || historyItem.category_id || "—"}</span>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>FOURNISSEUR</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.fixed_provider_name || historyItem.provider_name || historyItem.fixed_provider_id || historyItem.provider_id || "—"}</span>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>DESCRIPTION</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.description || "—"}</span>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>NOTE IA</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.ai_global_rating ? historyItem.ai_global_rating + " / 5" : "—"}</span>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>DATE DE SORTIE</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.fixed_release_date || historyItem.release_date || "—"}</span>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>SOUMIS LE</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.created_at}</span>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.25rem", padding: "1rem", borderTop: "1px solid var(--border-color, #e2e8f0)", width: "100%" }}>
                                                    <span className={formStyles["history-detail-label"]}>MODIFIER LA SUGGESTION</span>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Nom</label>
                                                            <input type="text" className={formStyles["form-input"]} value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>URL</label>
                                                            <input type="url" className={formStyles["form-input"]} value={editForm.website_url} onChange={(e) => handleEditChange("website_url", e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Catégorie</label>
                                                            <CreatableSelect
                                                                classNamePrefix="react-select"
                                                                placeholder="Choisir une catégorie"
                                                                isClearable
                                                                options={options.categories}
                                                                value={options.categories.find((c) => String(c.value) === String(editForm.category_id)) || null}
                                                                onChange={(opt) => handleEditChange("category_id", opt ? opt.value : "")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Fournisseur</label>
                                                            <CreatableSelect
                                                                classNamePrefix="react-select"
                                                                placeholder="Choisir un fournisseur"
                                                                isClearable
                                                                options={options.providers}
                                                                value={options.providers.find((p) => String(p.value) === String(editForm.provider_id)) || null}
                                                                onChange={(opt) => handleEditChange("provider_id", opt ? opt.value : "")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Modèles</label>
                                                            <CreatableSelect
                                                                classNamePrefix="react-select"
                                                                placeholder="Choisir des modèles"
                                                                isClearable
                                                                isMulti
                                                                options={options.models}
                                                                value={editModels || []}
                                                                onChange={(opt) => setEditModels(opt || [])}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Fonctionnalités</label>
                                                            <CreatableSelect
                                                                classNamePrefix="react-select"
                                                                placeholder="Choisir des fonctionnalités"
                                                                isClearable
                                                                isMulti
                                                                options={options.features}
                                                                value={editFeatures || []}
                                                                onChange={(opt) => setEditFeatures(opt || [])}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Description</label>
                                                            <textarea className={formStyles["form-textarea"]} value={editForm.description} onChange={(e) => handleEditChange("description", e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className={formStyles["form-row-full"]}>
                                                        <div className={formStyles["form-field"]}>
                                                            <label className={formStyles["form-label"]}>Date de sortie</label>
                                                            <input type="date" className={formStyles["form-input"]} value={editForm.release_date} onChange={(e) => handleEditChange("release_date", e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
                                                        <button type="button" className={formStyles["btn-reset"]} onClick={cancelEditing} disabled={saving}>
                                                            Annuler
                                                        </button>
                                                        <button type="button" className={formStyles["btn-submit"]} onClick={saveEditing} disabled={saving}>
                                                            {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {historyItem.status === "waiting_ai_analysis" && (
                                                <div style={{ textAlign: "center", padding: "12px 0" }}>
                                                    <div className={formStyles["spinner"]}></div>
                                                </div>
                                            )}
                                            {(historyItem.status === "ai_approved_pending_review" || historyItem.status === "waiting_manual_validation") && (
                                                <button type="button" className={formStyles["btn-finalize"]} onClick={handleFinalizeAdd}>
                                                    Ajouter aux outils
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={formStyles["success-container"]}>
                                            <h2 className={formStyles["success-title"]}>✓ Analyse en cours...</h2>
                                            <p className={formStyles["step-text-detail"]}>L'IA analyse votre soumission. Veuillez patienter.</p>
                                        </div>
                                    )
                                )}

                                {step === 2 && (
                                    <div className={formStyles["form-footer"]}>
                                        <button type="button" className={formStyles["btn-reset"]} onClick={resetForm}>
                                            {historyItem ? "Nouvel ajout" : "Ajouter un autre"}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
