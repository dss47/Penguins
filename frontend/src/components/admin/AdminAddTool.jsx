import React, { useState, useRef, useEffect } from "react";
import { Menu, ArrowLeft, Clock, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";

import sidebarStyles from "../../style/Pages/ProposerOutils.module.css";
import formStyles from "../../style/ProposerOutils/ProposerOutils.module.css";

const STATUS_MAP = {
    approved: { class: "Accepted", label: "Accepté" },
    rejected_ai: { class: "Rejected", label: "Refusé" },
    pending: { class: "Pending", label: "En attente" },
};

const MOCK_HISTORY = [
    { id: 1, title: "Chatbot Ninja", status: "rejected_ai" },
    { id: 2, title: "DesignEngine AI", status: "approved" },
    { id: 3, title: "Claude AI", status: "pending" },
];

const MOCK_HISTORY_DATA = {
    1: { id: 1, name: "Chatbot Ninja", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Chatbot%20Ninja", website_url: "https://chatbotninja.io", status: "rejected_ai", rejection_reason: "The provided URL returned a 404 server error. Please ensure the link is fully public and active before resubmitting.", created_at: "2026-06-11 12:00:00" },
    2: { id: 2, name: "DesignEngine AI", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=DesignEngine%20AI", website_url: "https://designengine.ai", status: "approved", rejection_reason: null, created_at: "2026-06-11 12:05:00" },
    3: { id: 3, name: "Claude AI", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Claude%20AI", website_url: "https://claude.ai", status: "pending", rejection_reason: null, created_at: "2026-06-11 12:10:00" },
};

export default function AdminAddTool() {
    // Layout states
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedHistoryId, setSelectedHistoryId] = useState(null);
    const sidebarRef = useRef(null);
    
    // Form states
    const historyItem = selectedHistoryId ? MOCK_HISTORY_DATA[selectedHistoryId] : null;
    const [provider, setProvider] = useState(null);
    const [name, setName] = useState("");
    const [categorie, setCategorie] = useState(null);
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [features, setFeatures] = useState(null);
    const [dateReleased, setDateReleased] = useState("");
    const [model, setModel] = useState(null);
    
    // 2-step stepper
    const [step, setStep] = useState(1);

    // Sidebar click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync step with history selection
    useEffect(() => {
        if (historyItem) {
            setStep(2);
        } else {
            setStep(1);
        }
    }, [selectedHistoryId, historyItem]);

    const handleHistoryClick = (id) => {
        setSelectedHistoryId(id);
        setSidebarOpen(false);
    };

    const resetSelection = () => {
        setSelectedHistoryId(null);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
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
        setStep(1);
    };

    const providerOptions = [
        { value: "OpenAI", label: "OpenAI" },
        { value: "Google", label: "Google" },
        { value: "Anthropic", label: "Anthropic" },
    ];

    const categoryOptions = [
        { value: "texte", label: "Génération de texte" },
        { value: "image", label: "Génération d'images" },
        { value: "code", label: "Code & Dev" },
        { value: "productivite", label: "Productivité" },
    ];

    const modelOptions = [
        { value: "GPT-4", label: "GPT-4" },
        { value: "Claude 3", label: "Claude 3" },
        { value: "Gemini", label: "Gemini" },
    ];

    const featureOptions = [
        { value: "Chat", label: "Chat" },
        { value: "API", label: "API" },
        { value: "Image", label: "Image" },
    ];

    return (
        <div className={sidebarStyles.proposerPage} style={{ background: "transparent", minHeight: "auto", margin: "-32px" }}>
            <div className={sidebarStyles.proposerLayout} style={{ minHeight: "auto" }}>
                <aside ref={sidebarRef} className={`${sidebarStyles.sidebar} ${!sidebarOpen ? sidebarStyles.sidebarHidden : ""}`} style={{ height: "calc(100vh - 64px)", top: "32px", position: "sticky" }}>
                    <div className={sidebarStyles.sidebarHeader}>
                        <div className={sidebarStyles.closeRow}>
                            <button className={sidebarStyles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                        <button className={sidebarStyles.newSearchBtn} onClick={resetSelection}>
                            <Plus size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
                            Nouvel outil
                        </button>
                    </div>
                    <div className={sidebarStyles.historyLabel}>Historique</div>
                    <div className={sidebarStyles.historyList}>
                        {MOCK_HISTORY.map((item) => {
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

                {!sidebarOpen && (
                    <div className={sidebarStyles.sidebarToggleBar} style={{ position: "fixed", top: "2rem", left: "calc(240px + 1.5rem)" }}>
                        <button className={sidebarStyles.toggleBtn} onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <button className={sidebarStyles.floatingNewSearch} onClick={resetSelection}>
                            <Plus size={20} />
                        </button>
                    </div>
                )}

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
                                                    <input type="file" accept="image/png,image/jpeg,image/webp" />
                                                    <span><FontAwesomeIcon icon={faCloudArrowUp} className={formStyles["upload-icon"]} /></span>
                                                    <span className={formStyles["upload-text"]}>Glissez-déposez une image ou <strong>cliquez pour parcourir</strong></span>
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
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={categoryOptions} value={categorie} onChange={setCategorie} placeholder="Selectionnez ou créez..." />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Features *</label>
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={featureOptions} value={features} onChange={setFeatures} placeholder="Ajoutez des fonctionnalités..." />
                                            </div>
                                        </div>

                                        <div className={formStyles["form-row-thirds"]}>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Provider *</label>
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={providerOptions} value={provider} onChange={setProvider} placeholder="Ex:OpenAI" />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Released date *</label>
                                                <input type="date" className={formStyles["form-input"]} value={dateReleased} onChange={(e) => setDateReleased(e.target.value)} />
                                            </div>
                                            <div className={formStyles["form-field"]}>
                                                <label className={formStyles["form-label"]}>Model</label>
                                                <CreatableSelect isMulti classNamePrefix="react-select" options={modelOptions} value={model} onChange={setModel} placeholder="Ex : GPT-4" />
                                            </div>
                                        </div>

                                        <div className={formStyles["form-footer"]}>
                                            <button type="button" className={formStyles["btn-reset"]} onClick={resetForm}>
                                                Réinitialiser
                                            </button>
                                            <button type="submit" className={formStyles["btn-submit"]}>
                                                Ajouter
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    historyItem ? (
                                        <div className={formStyles["history-view"]}>
                                            <div className={formStyles["avatar-frame"]}>
                                                {historyItem.logo_url ? (
                                                    <img src={historyItem.logo_url} alt={historyItem.name} />
                                                ) : (
                                                    <div className={formStyles["avatar-fallback"]}>🤖</div>
                                                )}
                                            </div>
                                            <h2 className={formStyles["history-detail-title"]}>{historyItem.name}</h2>
                                            <span className={`${formStyles.capsule} ${
                                                historyItem.status === "approved" ? formStyles["capsule-approved"] :
                                                historyItem.status === "rejected_ai" ? formStyles["capsule-rejected"] :
                                                formStyles["capsule-pending"]
                                            }`}>
                                                {historyItem.status === "approved" ? "Accepté" :
                                                 historyItem.status === "rejected_ai" ? "Refusé" :
                                                 "En attente"}
                                            </span>
                                            {historyItem.rejection_reason && (
                                                <div className={formStyles["alert-box"]}>
                                                    <AlertTriangle size={20} className={formStyles["alert-icon"]} color="#f87171" />
                                                    <div className={formStyles["alert-content"]}>
                                                        <span className={formStyles["history-detail-label"]}>RAISON DU REFUS</span>
                                                        <p className={formStyles["alert-text"]}>{historyItem.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className={formStyles["history-bottom-grid"]}>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>SITE WEB</span>
                                                    <a className={formStyles["detail-link"]} href={historyItem.website_url} target="_blank" rel="noopener noreferrer">{historyItem.website_url}</a>
                                                </div>
                                                <div className={formStyles["history-detail-field"]}>
                                                    <span className={formStyles["history-detail-label"]}>SOUMIS LE</span>
                                                    <span className={formStyles["detail-date"]}>{historyItem.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={formStyles["success-container"]}>
                                            <h2 className={formStyles["success-title"]}>✓ Ajouté avec succès !</h2>
                                            <p className={formStyles["step-text-detail"]}>L'outil a bien été enregistré.</p>
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