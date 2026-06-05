import styles from "../style/Pages/tooldetailspage.module.css"
import ToolDetailsHeader from "../components/toolDetails/toolDetailsHeader";
import ToolDetailsMain from "../components/toolDetails/toolDetailsMain";
import ToolDetailsSide from "../components/toolDetails/toolDetailsSide";

const TOOL_DATA = {
    created_by: "Salma Sabiri",
    validated_by: "Ahmed Lagmili",
    name: "ChatGPT",
    description: "ChatGPT est une intelligence artificielle conversationnelle et un grand modèle de langage qui utilise le traitement du langage naturel pour comprendre des instructions complexes et générer du texte, de l'audio et des images de manière très naturelle. L'acronyme 'GPT' signifie 'Generative Pre-trained Transformer' (Transformateur génératif pré-entraîné), décrivant une architecture d'IA qui est entraînée sur de vastes quantités de données internet. Au lieu de penser comme un humain, il fonctionne comme un moteur avancé de reconnaissance de modèles qui prédit la suite de mots la plus probable pour aider les utilisateurs à trouver des idées, rédiger des textes, résoudre des bugs de programmation et analyser divers contenus. Accessible directement via un navigateur web, il s'améliore continuellement grâce aux retours pour fournir une assistance à des centaines de millions d'utilisateurs à travers le monde, agissant comme un assistant numérique extrêmement polyvalent.",
    provider: "OpenAI",
    logo_url: "https://openai.com/favicon.ico",
    website_url: "https://chat.openai.com",
    global_rating: 4.9,
    release_date: "2024-01-15",
    status: "active",
    category: "Chatbot",
    created_at: "2024-01-10 14:22:11",
    updated_at: "2024-05-03 09:15:42",
    features: ["Conversation", "IA de référence", "OpenAI", "Génération de texte", "Analyse de données"],
    ratings: [
        {
            name: "Sami El Idrissi",
            stars: 5,
            comment: "Super utile pour la productivite et la redaction. Reponses claires et rapides.",
            date: "2025-06-03",
            hour: "14:32"
        },
        {
            name: "Lina Boussouf",
            stars: 4,
            comment: "Tres pratique pour resumer des articles et preparer des presentations.",
            date: "2025-06-01",
            hour: "09:18"
        },
        {
            name: "Yassine El Amrani",
            stars: 5,
            comment: "Reponses rapides et bien structurees. Ideal pour le support technique.",
            date: "2025-05-28",
            hour: "21:05"
        }
    ]
};

export default function ToolDetailsPage() {
    const renderValue = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value;
    };

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < count ? styles.starFilled : styles.starEmpty}>
                ★
            </span>
        ));
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <ToolDetailsHeader Tool={TOOL_DATA}/>
                <div className={styles.mainContainer}>
                    <ToolDetailsMain Tool={TOOL_DATA}/>
                    <ToolDetailsSide Tool={TOOL_DATA}/>
                </div>

                <section className={styles.metaContainer}>
                    <h2 className={styles.metaTitle}>Metadonnées</h2>
                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Created By</span>
                            <span className={styles.metaValue}>{renderValue(TOOL_DATA.created_by)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Validated By</span>
                            <span className={styles.metaValue}>{renderValue(TOOL_DATA.validated_by)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Created At</span>
                            <span className={styles.metaValue}>{renderValue(TOOL_DATA.created_at)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Updated At</span>
                            <span className={styles.metaValue}>{renderValue(TOOL_DATA.updated_at)}</span>
                        </div>
                    </div>
                </section>

                {TOOL_DATA.ratings && TOOL_DATA.ratings.length > 0 && (
                    <section className={styles.reviewsContainer}>
                        <h2 className={styles.reviewsTitle}>Avis</h2>
                        <div className={styles.ratingsGrid}>
                            {TOOL_DATA.ratings.map((rating, index) => (
                                <div key={`${rating.name}-${index}`} className={styles.ratingCard}>
                                    <div className={styles.ratingHeader}>
                                        <div>
                                            <p className={styles.ratingName}>{rating.name}</p>
                                            <p className={styles.ratingMeta}>
                                                {rating.date} {rating.hour}
                                            </p>
                                        </div>
                                        <div className={styles.ratingStars}>
                                            {renderStars(rating.stars)}
                                        </div>
                                    </div>
                                    <p className={styles.ratingComment}>{rating.comment}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}