import { useState } from "react";
import style from "../../style/ProposerOutils/ProposerOutils.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
// import RobotSidebar from "./Robotsidebar"; 
import CreatableSelect from "react-select/creatable";

function Main() {
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
    console.log({ provider, name, categorie, description, url, features, dateReleased, model, whyTool });
  };

  return (
    <div className={style["proposer-layout"]}>
      {/* <RobotSidebar /> */}

      <div className={style["form-wrapper"]}>
        <div className={style.stepper}>
          <div className={`${style.step} ${step === 1 ? style["step-active"] : ""}`}>
            <div className={style["step-number"]}>1</div>
            <div className={style["step-info"]}>
              <span className={style["step-title"]}>Informations</span>
              <span className={style["step-sub"]}>Détails principaux</span>
            </div>
          </div>
          <div className={style["step-line"]}></div>

          <div className={`${style.step} ${step === 2 ? style["step-active"] : ""}`}>
            <div className={style["step-number"]}>2</div>
            <div className={style["step-info"]}>
              <span className={style["step-title"]}>Détails</span>
              <span className={style["step-sub"]}>Fonctionnalités</span>
            </div>
          </div>
          <div className={style["step-line"]}></div>

          <div className={`${style.step} ${step === 3 ? style["step-active"] : ""}`}>
            <div className={style["step-number"]}>3</div>
            <div className={style["step-info"]}>
              <span className={style["step-title"]}>Vérification</span>
              <span className={style["step-sub"]}>Prévisualisation</span>
            </div>
          </div>
          <div className={style["step-line"]}></div>

          <div className={`${style.step} ${step === 4 ? style["step-active"] : ""}`}>
            <div className={style["step-number"]}>4</div>
            <div className={style["step-info"]}>
              <span className={style["step-title"]}>Soumission</span>
              <span className={style["step-sub"]}>En attente</span>
            </div>
          </div>
        </div>

        <form className={style["form-card"]} method="POST" action="" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              {/* LIGNE 1 : Image (Pleine largeur) */}
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

              {/* LIGNE 2 : Name & Url (50/50) */}
              <div className={style["form-row-half"]}>
                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Name *</label>
                  <input
                    type="text"
                    className={style["form-input"]}
                    placeholder="Ex : ChatGPT"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span className={style["form-hint"]}>Le nom officiel de l'outil</span>
                </div>

                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Url *</label>
                  <input
                    type="url"
                    className={style["form-input"]}
                    placeholder="https://exemple.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <span className={style["form-hint"]}>Le lien officiel vers l'outil</span>
                </div>
              </div>

              {/* LIGNE 3 : Description (Pleine largeur) */}
              <div className={style["form-row-full"]}>
                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Description *</label>
                  <textarea
                    className={style["form-textarea"]}
                    placeholder="Décrivez brièvement cet outil et son utilité"
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <span className={style["form-counter"]}>{description.length}/500</span>
                  <span className={style["form-hint"]}>Résumé clair et concis de l'outil</span>
                </div>
              </div>

              {/* LIGNE 4 : Category & Features (50/50) */}
              <div className={style["form-row-half"]}>
                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Category *</label>
                  <CreatableSelect
                    isMulti
                    classNamePrefix="react-select"
                    options={categoryOptions}
                    value={categorie}
                    onChange={setCategorie}
                    placeholder="Selectionnez ou créez..."
                  />
                  <span className={style["form-hint"]}>Choisissez ou créez une catégorie</span>
                </div>

                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Features *</label>
                  <CreatableSelect
                    isMulti
                    classNamePrefix="react-select"
                    options={featureOptions}
                    value={features}
                    onChange={setFeatures}
                    placeholder="Ajoutez des fonctionnalités..."
                  />
                  <span className={style["form-hint"]}>Tapez puis appuyez sur Entrée pour créer</span>
                </div>
              </div>

              {/* LIGNE 5 : Provider, Released Date, Model (3 colonnes) */}
              <div className={style["form-row-thirds"]}>
                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Provider *</label>
                  <CreatableSelect
                    isMulti
                    classNamePrefix="react-select"
                    options={providerOptions}
                    value={provider}
                    onChange={setProvider}
                    placeholder="Ex:OpenAI"
                  />
                  <span className={style["form-hint"]}>L'entreprise ou l'organisation qui propose cet outil</span>
                </div>

                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Released date *</label>
                  <input
                    type="date"
                    className={style["form-input"]}
                    value={dateReleased}
                    onChange={(e) => setDateReleased(e.target.value)}
                  />
                  <span className={style["form-hint"]}>Date de lancement ou de sortie de l'outil</span>
                </div>

                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Model</label>
                  <CreatableSelect
                    isMulti
                    classNamePrefix="react-select"
                    options={modelOptions}
                    value={model}
                    onChange={setModel}
                    placeholder="Ex : GPT-4"
                  />
                  <span className={style["form-hint"]}>Le modèle ou la technologie utilisée (si applicable)</span>
                </div>
              </div>

              {/* LIGNE 6 : Why this tool (Pleine largeur) */}
              <div className={style["form-row-full"]}>
                <div className={style["form-field"]}>
                  <label className={style["form-label"]}>Why this tool? *</label>
                  <textarea
                    className={style["form-textarea"]}
                    placeholder="Pourquoi cet outil mérite d'être dans notre annuaire ? Quelle valeur apporte-t-il aux utilisateurs ?"
                    maxLength={500}
                    value={whyTool}
                    onChange={(e) => setWhyTool(e.target.value)}
                  />
                  <span className={style["form-counter"]}>{whyTool.length}/500</span>
                  <span className={style["form-hint"]}>Expliquez en quoi cet outil est unique et utile pour la communauté</span>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className={style["step-text-title"]}>Étape 2 — Détails</p>
            </>
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
            <>
              <div className={style["success-container"]}>
                <h2 className={style["success-title"]}>✓ Soumis avec succès !</h2>
                <p className={style["step-text-detail"]}>Votre outil est en attente de validation.</p>
              </div>
            </>
          )}

          <div className={style["form-footer"]}>
            <button
              type="button"
              className={style["btn-cancel"]}
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Annuler
            </button>

            <span className={style["form-autosave"]}>✓ Enregistré automatiquement</span>
            <button
              type={step === 4 ? "submit" : "button"}
              className={style["btn-submit"]}
              onClick={() => step < 4 && setStep(step + 1)}
            >
              {step === 4 ? "Soumettre ✓" : "Suivant →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Main;
