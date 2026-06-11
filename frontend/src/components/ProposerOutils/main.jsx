import React, { useState, useEffect } from "react";
import style from "../../style/ProposerOutils/ProposerOutils.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { AlertTriangle } from "lucide-react";
import CreatableSelect from "react-select/creatable";

const MOCK_PENDING = null;

const MOCK_HISTORY_DATA = {
    1: { id: 42, name: "Chatbot Ninja", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Chatbot%20Ninja", website_url: "https://chatbotninja.io", status: "rejected_ai", rejection_reason: "The provided URL returned a 404 server error. Please ensure the link is fully public and active before resubmitting.", created_at: "2026-06-11 12:00:00" },
    2: { id: 43, name: "DesignEngine AI", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=DesignEngine%20AI", website_url: "https://designengine.ai", status: "approved", rejection_reason: null, created_at: "2026-06-11 12:05:00" },
    3: { id: 44, name: "Claude AI", logo_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Claude%20AI", website_url: "https://claude.ai", status: "pending", rejection_reason: null, created_at: "2026-06-11 12:10:00" },
};

function Main({ selectedHistoryId, onResetSelection }) {
    const historyItem = selectedHistoryId ? MOCK_HISTORY_DATA[selectedHistoryId] : null;
    const [provider, setProvider] = useState(null);
    const [name, setName] = useState("");
    const [categorie, setCategorie] = useState(null);
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [features, setFeatures] = useState(null);
    const [dateReleased, setDateReleased] = useState("");
    const [model, setModel] = useState(null);
    const [whyTool, setWhyTool] = useState("");
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (historyItem) {
            setStep(4);
        } else {
            setStep(1);
        }
    }, [selectedHistoryId]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(4);
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
        setStep(1);
        if (onResetSelection) onResetSelection();
    };

    if (MOCK_PENDING && !selectedHistoryId) {
        return (
            <div className={style["pending-container"]}>
                <h2 className={style["pending-title"]}>Soumission en cours</h2>
                <p className={style["pending-text"]}>
                    Vous avez une soumission en attente à l'étape <strong>{MOCK_PENDING.currentStep}</strong>.
                    Vous ne pouvez pas soumettre un nouvel outil tant que celle-ci n'est pas acceptée ou refusée.
                </p>
                <div className={style["pending-step-indicator"]}>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`${style["pending-step"]} ${s <= MOCK_PENDING.currentStep ? style["pending-step-done"] : ""} ${s === MOCK_PENDING.currentStep ? style["pending-step-current"] : ""}`}>
                            {s <= MOCK_PENDING.currentStep ? "✓" : s}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={style["proposer-layout"]}>
            <div className={style["form-wrapper"]}>
                <div className={style.stepper}>
                    {["Informations", "Détails", "Vérification", "Soumission"].map((label, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <div className={style["step-line"]}></div>}
                            <div className={`${style.step} ${step >= i + 1 ? style["step-active"] : ""} ${step === i + 1 ? style["step-current"] : ""}`}>
                                <div className={style["step-number"]}>{step > i + 1 ? "✓" : i + 1}</div>
                                <div className={style["step-info"]}>
                                    <span className={style["step-title"]}>{label}</span>
                                    <span className={style["step-sub"]}>
                                        {i === 0 ? "Détails principaux" : i === 1 ? "Fonctionnalités" : i === 2 ? "Prévisualisation" : "En attente"}
                                    </span>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <form className={style["form-card"]} onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <div className={style["form-row-full"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Image *</label>
                                    <label className={style["upload-zone"]}>
                                        <input type="file" accept="image/png,image/jpeg,image/webp" />
                                        <span><FontAwesomeIcon icon={faCloudArrowUp} className={style["upload-icon"]} /></span>
                                        <span className={style["upload-text"]}>Glissez-déposez une image ou <strong>cliquez pour parcourir</strong></span>
                                        <span className={style["upload-hint"]}>PNG, JPG ou WebP (max. 5MB)</span>
                                    </label>
                                </div>
                            </div>

                            <div className={style["form-row-half"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Name *</label>
                                    <input type="text" className={style["form-input"]} placeholder="Ex : ChatGPT" value={name} onChange={(e) => setName(e.target.value)} />
                                    <span className={style["form-hint"]}>Le nom officiel de l'outil</span>
                                </div>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Url *</label>
                                    <input type="url" className={style["form-input"]} placeholder="https://exemple.com" value={url} onChange={(e) => setUrl(e.target.value)} />
                                    <span className={style["form-hint"]}>Le lien officiel vers l'outil</span>
                                </div>
                            </div>

                            <div className={style["form-row-full"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Description *</label>
                                    <textarea className={style["form-textarea"]} placeholder="Décrivez brièvement cet outil et son utilité" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <span className={style["form-counter"]}>{description.length}/500</span>
                                </div>
                            </div>

                            <div className={style["form-row-half"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Category *</label>
                                    <CreatableSelect isMulti classNamePrefix="react-select" options={categoryOptions} value={categorie} onChange={setCategorie} placeholder="Selectionnez ou créez..." />
                                </div>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Features *</label>
                                    <CreatableSelect isMulti classNamePrefix="react-select" options={featureOptions} value={features} onChange={setFeatures} placeholder="Ajoutez des fonctionnalités..." />
                                </div>
                            </div>

                            <div className={style["form-row-thirds"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Provider *</label>
                                    <CreatableSelect isMulti classNamePrefix="react-select" options={providerOptions} value={provider} onChange={setProvider} placeholder="Ex:OpenAI" />
                                </div>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Released date *</label>
                                    <input type="date" className={style["form-input"]} value={dateReleased} onChange={(e) => setDateReleased(e.target.value)} />
                                </div>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Model</label>
                                    <CreatableSelect isMulti classNamePrefix="react-select" options={modelOptions} value={model} onChange={setModel} placeholder="Ex : GPT-4" />
                                </div>
                            </div>

                            <div className={style["form-row-full"]}>
                                <div className={style["form-field"]}>
                                    <label className={style["form-label"]}>Why this tool? *</label>
                                    <textarea className={style["form-textarea"]} placeholder="Pourquoi cet outil mérite d'être dans notre annuaire ?" maxLength={500} value={whyTool} onChange={(e) => setWhyTool(e.target.value)} />
                                    <span className={style["form-counter"]}>{whyTool.length}/500</span>
                                </div>
                            </div>

                            <div className={style["form-footer"]}>
                                <button type="button" className={style["btn-reset"]} onClick={resetForm}>
                                    Réinitialiser
                                </button>
                                <button type="submit" className={style["btn-submit"]}>
                                    Soumettre
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <p className={style["step-text-title"]}>Étape 2 — Détails</p>
                    )}

                    {step === 3 && (
                        <>
                            <p className={style["step-text-title"]}>Étape 3 — Vérification</p>
                            <p className={style["step-text-detail"]}>Name : {name}</p>
                            <p className={style["step-text-detail"]}>Url : {url}</p>
                            <p className={style["step-text-detail"]}>Provider : {provider ? provider.map(p => p.label).join(", ") : ""}</p>
                        </>
                    )}

                    {step === 4 && (
                        historyItem ? (
                            <div className={style["history-view"]}>
                                <div className={style["avatar-frame"]}>
                                    {historyItem.logo_url ? (
                                        <img src={historyItem.logo_url} alt={historyItem.name} />
                                    ) : (
                                        <div className={style["avatar-fallback"]}>🤖</div>
                                    )}
                                </div>
                                <h2 className={style["history-detail-title"]}>{historyItem.name}</h2>
                                <span className={`${style.capsule} ${
                                    historyItem.status === "approved" ? style["capsule-approved"] :
                                    historyItem.status === "rejected_ai" ? style["capsule-rejected"] :
                                    style["capsule-pending"]
                                }`}>
                                    {historyItem.status === "approved" ? "Accepté" :
                                     historyItem.status === "rejected_ai" ? "Refusé" :
                                     "En attente"}
                                </span>
                                {historyItem.rejection_reason && (
                                    <div className={style["alert-box"]}>
                                        <AlertTriangle size={20} className={style["alert-icon"]} color="#f87171" />
                                        <div className={style["alert-content"]}>
                                            <span className={style["history-detail-label"]}>RAISON DU REFUS</span>
                                            <p className={style["alert-text"]}>{historyItem.rejection_reason}</p>
                                        </div>
                                    </div>
                                )}
                                <div className={style["history-bottom-grid"]}>
                                    <div className={style["history-detail-field"]}>
                                        <span className={style["history-detail-label"]}>SITE WEB</span>
                                        <a className={style["detail-link"]} href={historyItem.website_url} target="_blank" rel="noopener noreferrer">{historyItem.website_url}</a>
                                    </div>
                                    <div className={style["history-detail-field"]}>
                                        <span className={style["history-detail-label"]}>SOUMIS LE</span>
                                        <span className={style["detail-date"]}>{historyItem.created_at}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={style["success-container"]}>
                                <h2 className={style["success-title"]}>✓ Soumis avec succès !</h2>
                                <p className={style["step-text-detail"]}>Votre outil est en attente de validation.</p>
                            </div>
                        )
                    )}

                    {step !== 1 && step !== 4 && (
                        <div className={style["form-footer"]}>
                            <button type="button" className={style["btn-reset"]} onClick={resetForm}>
                                Réinitialiser
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Main;
