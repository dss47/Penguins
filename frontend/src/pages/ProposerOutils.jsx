import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Clock, Plus, AlertTriangle, Info } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinux } from "@fortawesome/free-brands-svg-icons";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";
import sidebarStyles from "../style/Pages/ProposerOutils.module.css";
import formStyles from "../style/ProposerOutils/ProposerOutils.module.css";
import api, { API_BASE } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

const STATUS_MAP = {
    waiting_ai_analysis:        { class: "Pending",  label: "Analyse IA..." },
    ai_approved_pending_review: { class: "Pending",  label: "En attente admin" },
    ai_rejected:                { class: "Rejected", label: "Refusé (IA)" },
    waiting_manual_validation:  { class: "Pending",  label: "En attente admin" },
    published_to_catalog:       { class: "Accepted", label: "Publié ✓" },
    rejected_by_admin:          { class: "Rejected", label: "Refusé" },
};

const STEP_LABELS = [
    { title: "Informations", sub: "Détails de l'outil" },
    { title: "Analyse IA",   sub: "Vérification automatique" },
    { title: "Validation",   sub: "En attente admin" },
    { title: "Résultat",     sub: "Final" },
];

function statusToStep(status) {
    if (!status) return 1;
    if (status === "waiting_ai_analysis") return 2;
    if (status === "ai_approved_pending_review" || status === "waiting_manual_validation") return 3;
    return 4;
}

function ProposerOutils() {
    const { isAuthenticated } = useAuth();
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
    const [whyTool, setWhyTool] = useState("");
    const [logoFile, setLogoFile] = useState(null);

    const [options, setOptions] = useState({ categories: [], providers: [], features: [], models: [] });
    const [optionsLoading, setOptionsLoading] = useState(true);

    const historyItem = selectedHistoryId ? historyData[selectedHistoryId] : null;
    const step = historyItem ? statusToStep(historyItem.status) : 1;

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
            .catch(() => {})
            .finally(() => setOptionsLoading(false));
    }, []);

    const fetchHistory = () => {
        api.get("/suggestions/history")
            .then((res) => {
                const items = res.data || [];
                setHistory(items.map((s) => ({ id: s.id, title: s.name, status: s.status })));
                const data = {};
                items.forEach((s) => { data[s.id] = s; });
                setHistoryData(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchHistory();
    }, [isAuthenticated]);

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
        formData.append("why_this_tool", whyTool);
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

        api.post("/suggestions/create", formData)
            .then((res) => {
                const item = res.data;
                if (!item?.id) {
                    setHistoryData((prev) => ({
                        ...prev,
                        [tempId]: { ...prev[tempId], status: "waiting_manual_validation" },
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
            .catch(() => {
                setHistoryData((prev) => ({
                    ...prev,
                    [tempId]: { ...prev[tempId], status: "waiting_manual_validation" },
                }));
                setHistory((prev) => prev.map((h) =>
                    h.id === tempId ? { ...h, status: "waiting_manual_validation" } : h
                ));
            })
            .finally(() => setSubmitting(false));
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
        setWhyTool("");
        setLogoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (!isAuthenticated) return <LoginPrompt />;

    return (
        <div className={sidebarStyles.proposerPage}>
            <div className={sidebarStyles.proposerLayout}>
                <aside className={`${sidebarStyles.sidebar} ${!sidebarExpanded ? sidebarStyles.sidebarCollapsed : ""}`} style={{ left: 0, top: "80px", height: "calc(100vh - 80px)" }}>
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

                <div className={sidebarStyles.mainContent}>
                    <div className={formStyles["page-header"]}>
                        <h1>
                            <span className="logo"><FontAwesomeIcon icon={faLinux} /></span>
                            {" "}Proposer un outil <span className="ia">IA</span>
                        </h1>
                    </div>

                    <div className={formStyles["proposer-layout"]} style={{ padding: "0 0.5rem 2rem", minHeight: "auto", width: "100%", maxWidth: "960px", margin: "0 auto" }}>
                        <div className={formStyles["form-wrapper"]}>
                            <div className={formStyles.stepper}>
                                {STEP_LABELS.map((label, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <div className={formStyles["step-line"]}></div>}
                                        <div className={`${formStyles.step} ${step >= i + 1 ? formStyles["step-active"] : ""} ${step === i + 1 ? formStyles["step-current"] : ""}`}>
                                            <div className={formStyles["step-number"]}>{step > i + 1 ? "✓" : i + 1}</div>
                                            <div className={formStyles["step-info"]}>
                                                <span className={formStyles["step-title"]}>{label.title}</span>
                                                <span className={formStyles["step-sub"]}>{label.sub}</span>
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

                                        <div className={formStyles["form-row-full"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Why this tool? *</label>
                                                <textarea className={formStyles["form-textarea"]} placeholder="Pourquoi cet outil mérite d'être dans notre annuaire ?" maxLength={500} value={whyTool} onChange={(e) => setWhyTool(e.target.value)} />
                                                <span className={formStyles["form-counter"]}>{whyTool.length}/500</span>
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

                                {historyItem && step === 2 && (
                                    <div className={formStyles["history-view"]}>
                                        <div className={formStyles["avatar-frame"]}>
                                            {historyItem.logo_url ? (
                                                <img src={historyItem.logo_url.startsWith("http") ? historyItem.logo_url : API_BASE + historyItem.logo_url} alt={historyItem.name} />
                                            ) : (
                                                <div className={formStyles["avatar-fallback"]}>🤖</div>
                                            )}
                                        </div>
                                        <h2 className={formStyles["history-detail-title"]}>{historyItem.fixed_name || historyItem.name}</h2>
                                        <span className={`${formStyles.capsule} ${formStyles["capsule-pending"]}`}>
                                            Analyse IA en cours...
                                        </span>
                                        <div className={formStyles["info-box"]}>
                                            <Info size={20} className={formStyles["alert-icon"]} color="#0ea5e9" />
                                            <div className={formStyles["alert-content"]}>
                                                <span className={formStyles["history-detail-label"]}>ANALYSE IA EN COURS</span>
                                                <p className={formStyles["alert-text"]}>L'IA vérifie les informations de l'outil. Veuillez patienter...</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "center", padding: "12px 0" }}>
                                            <div className={formStyles["spinner"]}></div>
                                        </div>
                                    </div>
                                )}

                                {historyItem && step === 3 && (
                                    <div className={formStyles["history-view"]}>
                                        <div className={formStyles["avatar-frame"]}>
                                            {historyItem.logo_url ? (
                                                <img src={historyItem.logo_url.startsWith("http") ? historyItem.logo_url : API_BASE + historyItem.logo_url} alt={historyItem.name} />
                                            ) : (
                                                <div className={formStyles["avatar-fallback"]}>🤖</div>
                                            )}
                                        </div>
                                        <h2 className={formStyles["history-detail-title"]}>{historyItem.fixed_name || historyItem.name}</h2>
                                        <span className={`${formStyles.capsule} ${formStyles["capsule-pending"]}`}>
                                            En attente de validation
                                        </span>
                                        <div className={formStyles["alert-box"]}>
                                            <Info size={20} className={formStyles["alert-icon"]} color="#fbbf24" />
                                            <div className={formStyles["alert-content"]}>
                                                <span className={formStyles["history-detail-label"]}>EN ATTENTE</span>
                                                <p className={formStyles["alert-text"]}>
                                                    Votre soumission a été vérifiée par l'IA et est en attente de validation par un administrateur.
                                                    Vous serez notifié dès qu'une décision sera prise.
                                                </p>
                                            </div>
                                        </div>
                                        {historyItem.ai_moderation_notes && (
                                            <div className={formStyles["info-box"]}>
                                                <Info size={20} className={formStyles["alert-icon"]} color="#0ea5e9" />
                                                <div className={formStyles["alert-content"]}>
                                                    <span className={formStyles["history-detail-label"]}>NOTES DE MODÉRATION IA</span>
                                                    <p className={formStyles["alert-text"]}>{historyItem.ai_moderation_notes}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className={formStyles["history-bottom-grid"]}>
                                            <div className={formStyles["history-detail-field"]}>
                                                <span className={formStyles["history-detail-label"]}>SITE WEB</span>
                                                <a className={formStyles["detail-link"]} href={historyItem.fixed_url || historyItem.website_url} target="_blank" rel="noopener noreferrer">{historyItem.fixed_url || historyItem.website_url}</a>
                                            </div>
                                            <div className={formStyles["history-detail-field"]}>
                                                <span className={formStyles["history-detail-label"]}>SOUMIS LE</span>
                                                <span className={formStyles["detail-date"]}>{historyItem.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {historyItem && step === 4 && (
                                    <div className={formStyles["history-view"]}>
                                        <div className={formStyles["avatar-frame"]}>
                                            {historyItem.logo_url ? (
                                                <img src={historyItem.logo_url.startsWith("http") ? historyItem.logo_url : API_BASE + historyItem.logo_url} alt={historyItem.name} />
                                            ) : (
                                                <div className={formStyles["avatar-fallback"]}>🤖</div>
                                            )}
                                        </div>
                                        <h2 className={formStyles["history-detail-title"]}>{historyItem.fixed_name || historyItem.name}</h2>
                                        <span className={`${formStyles.capsule} ${
                                            historyItem.status === "published_to_catalog" ? formStyles["capsule-approved"] :
                                            formStyles["capsule-rejected"]
                                        }`}>
                                            {historyItem.status === "published_to_catalog" ? "Accepté et publié" : "Refusé"}
                                        </span>
                                        {(historyItem.status === "ai_rejected" || historyItem.status === "rejected_by_admin") && historyItem.rejection_reason && (
                                            <div className={formStyles["alert-box"]}>
                                                <AlertTriangle size={20} className={formStyles["alert-icon"]} color="#f87171" />
                                                <div className={formStyles["alert-content"]}>
                                                    <span className={formStyles["history-detail-label"]}>RAISON DU REFUS</span>
                                                    <p className={formStyles["alert-text"]}>{historyItem.rejection_reason}</p>
                                                </div>
                                            </div>
                                        )}
                                        {historyItem.status === "published_to_catalog" && (
                                            <div className={formStyles["alert-box-success"]}>
                                                <Info size={20} className={formStyles["alert-icon"]} color="#34d399" />
                                                <div className={formStyles["alert-content"]}>
                                                    <span className={formStyles["history-detail-label"]}>VALIDÉ ET PUBLIÉ</span>
                                                    <p className={formStyles["alert-text"]}>Votre outil a été accepté et est désormais visible dans l'annuaire.</p>
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
                                        <div className={formStyles["history-bottom-grid"]}>
                                            <div className={formStyles["history-detail-field"]}>
                                                <span className={formStyles["history-detail-label"]}>SITE WEB</span>
                                                <a className={formStyles["detail-link"]} href={historyItem.fixed_url || historyItem.website_url} target="_blank" rel="noopener noreferrer">{historyItem.fixed_url || historyItem.website_url}</a>
                                            </div>
                                            <div className={formStyles["history-detail-field"]}>
                                                <span className={formStyles["history-detail-label"]}>SOUMIS LE</span>
                                                <span className={formStyles["detail-date"]}>{historyItem.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>

                            {step !== 1 && (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                    <button type="button" className={formStyles["btn-reset"]} onClick={resetSelection}>
                                        Nouvelle soumission
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProposerOutils;
