import styles from "../../style/toolDetails/tooldetailsmain.module.css"

export default function ToolDetailsMain({Tool}) {
    return (
        <>
        <div className={styles.mainContainer}>
            <div className={styles.section}>
                <h1 className={styles.sectionTitle}>À propos</h1>
                <p className={styles.description}>{Tool.description}</p>
            </div>
            
            {Tool.features && Tool.features.length > 0 && (
                <div className={styles.section}>
                    <h1 className={styles.sectionTitle}>Fonctionnalités</h1>
                    <div className={styles.featuresGrid}>
                        {Tool.features.map((feature, index) => (
                            <span key={index} className={styles.featureBadge}>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}