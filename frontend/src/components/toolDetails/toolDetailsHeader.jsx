import styles from "../../style/toolDetails/tooldetailsheader.module.css"
import { Star, Heart, Share2 } from "lucide-react";

export default function ToolDetailsHeader({Tool}) {
    const getInitials = (name) => name.slice(0, 2).toUpperCase();

    return (
        <div className={styles.hero}>
            <div className={styles.heroIcon}>
                <span className={styles.initials}>{getInitials(Tool.name)}</span>
            </div>
            <div className={styles.heroInfo}>
                <h1 className={styles.heroTitle}>{Tool.name}</h1>
                <p className={styles.heroBy}>par <span>{Tool.provider}</span></p>
                <div className={styles.heroActions}>
                    <div className={styles.ratingBadge}>
                        <span className={styles.star}>★</span>
                        <strong>{Tool.global_rating}</strong>
                        <span>/ 5</span>
                    </div>
                    <button className={styles.actionIconBtn} title="Ajouter aux favoris">
                        <Heart size={15} />
                    </button>
                    <button className={styles.actionIconBtn} title="Partager">
                        <Share2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}