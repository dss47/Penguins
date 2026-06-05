import styles from "../../style/toolDetails/tooldetailsside.module.css"
import { ExternalLink,Copy } from "lucide-react";

export default function ToolDetailsSide({ Tool }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(Tool.website_url);
    };

    return (
        <div className={styles.sideContainer}>
            <h1 className={styles.sectionTitle}>Informations</h1>
            <div className={styles.infoList}>
                <div className={styles.infoLine}>
                    <h3>Statut</h3>
                    <span className={styles.statusActive}>{Tool.status}</span>
                </div>
                <div className={styles.infoLine}>
                    <h3>Catégorie</h3>
                    <p>{Tool.category}</p>
                </div>
                <div className={styles.infoLine}>
                    <h3>Date de sortie</h3>
                    <p>{Tool.release_date}</p>
                </div>
                <div className={styles.infoLine}>
                    <h3>Note globale</h3>
                    <p>{Tool.global_rating}</p>
                </div>
            </div>
            <div className={styles.websiteBtns}>
                <a href={Tool.website_url} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                    Visiter le site <ExternalLink size={18} />
                </a>
                <span className={styles.orDivider}>ou</span>
                <button onClick={handleCopy} className={styles.secondaryBtn}>
                    Copier le lien <Copy size={18} />
                </button>
            </div>
        </div>
    );
}