import styles from "../../style/toolDetails/tooldetailsside.module.css"
import { ExternalLink,Copy } from "lucide-react";

export default function ToolDetailsSide({ Tool }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(Tool.website_url);
    };

    return (
        <div className={styles.infoCard}>
            <h2>Informations</h2>
            <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Statut</span>
                    <span className={styles.badgeActive}>Active</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Catégorie</span>
                    <span className={styles.infoCategory}>{Tool.category}</span>
                </div>
                {Tool.pricing && (
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Pricing</span>
                        <span className={styles.badgeFreemium}>{Tool.pricing}</span>
                    </div>
                )}
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Date de sortie</span>
                    <span className={styles.infoValue}>{Tool.release_date}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Note globale</span>
                    <span className={styles.infoValue} style={{color:"var(--yellow)"}}>★★★★★</span>
                </div>
            </div>

            <a href={Tool.website_url} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Visiter le site
                <ExternalLink size={14} />
            </a>

            <div className={styles.dividerOr}>ou</div>

            <button className={styles.btnSecondary} onClick={handleCopy}>
                <Copy size={14} />
                Copier le lien
            </button>
        </div>
    );
}