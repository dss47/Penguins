import styles from "../../style/toolDetails/tooldetailsmain.module.css"

export default function ToolDetailsMain({Tool}) {
    return (
        <div className={styles.leftColumn}>
            <div className={styles.aboutCard}>
                <h2>À propos</h2>
                <p>{Tool.description}</p>
            </div>
            
            {Tool.features && Tool.features.length > 0 && (
                <div className={styles.featuresCard}>
                    <h2>Fonctionnalités</h2>
                    <div className={styles.tags}>
                        {Tool.features.map((feature, index) => (
                            <span key={index} className={styles.tag}>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {Tool.models && Tool.models.length > 0 && (
                <div className={styles.modelsCard}>
                    <h2>Modèles supportés</h2>
                    <div className={styles.modelTags}>
                        {Tool.models.map((model, index) => (
                            <span key={index} className={styles.modelTag}>
                                {model}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}