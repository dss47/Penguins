import styles from "../../style/toolDetails/similartools.module.css";

export default function SimilarTools({ tools }) {
    if (!tools || tools.length === 0) {
        return null;
    }

    return (
        <section className={styles.similarContainer}>
            <h2 className={styles.similarTitle}>Outils Similaires</h2>
            <div className={styles.similarGrid}>
                {tools.map((tool, index) => (
                    <div key={index} className={styles.miniCard}>
                        <div className={styles.miniCardLogo}>
                            <img src={tool.logo_url} alt={tool.name} />
                        </div>
                        <span className={styles.miniCardName}>{tool.name}</span>
                        <a href="#" className={styles.miniCardBtn}>View</a>
                    </div>
                ))}
            </div>
        </section>
    );
}
