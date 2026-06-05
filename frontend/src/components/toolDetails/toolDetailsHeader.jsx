import styles from "../../style/toolDetails/tooldetailsheader.module.css"
import { ArrowLeft,Star } from "lucide-react";

export default function ToolDetailsHeader({Tool}) {
    return (
        <>
        <div className={styles.toolHeader}>
            <button type="button" className={styles.backBtn} onClick={() => window.history.back()}>
                <ArrowLeft size={18} />
                Retour
            </button>
            <div className={styles.toolNameContainer}>
                <div className={styles.iconWrapper}>
                    <img src={Tool.logo_url} alt={Tool.name} className={styles.toolIconImage} />
                </div>
                <div className={styles.headerInfo}>
                    <div className={styles.titleRow}>
                        <div>
                            <h3 className={styles.toolName}>{Tool.name}</h3>
                            <p className={styles.provider}>By {Tool.provider}</p>
                        </div>
                        <div className={styles.rating}>
                            <div className={styles.starWrapper}>
                                <Star size={24} fill="currentColor" />
                            </div>
                            <div>
                                <span className={styles.ratingScore}>{Tool.global_rating}</span>
                                <span className={styles.ratingMax}>/ 5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}