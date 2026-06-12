import { useState } from "react";
import styles from "../../style/toolDetails/tooldetailsheader.module.css"
import { Star, Heart, Bookmark } from "lucide-react";

export default function ToolDetailsHeader({ Tool, isFavorited, onToggleFavorite, onOpenShelfPicker }) {
    const getInitials = (name) => name.slice(0, 2).toUpperCase();
    const [hearted, setHearted] = useState(isFavorited);

    const handleHeart = () => {
        const next = !hearted;
        setHearted(next);
        onToggleFavorite(Tool.id, next);
    };

    return (
        <div className={styles.hero}>
            <div className={styles.heroIcon}>
                {Tool.icon ? (
                    <img src={Tool.icon} alt={Tool.name} className={styles.heroImg} />
                ) : (
                    <span className={styles.initials}>{getInitials(Tool.name)}</span>
                )}
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
                    <button
                        className={`${styles.actionIconBtn} ${hearted ? styles.heartActive : ""}`}
                        title="Ajouter aux favoris"
                        onClick={handleHeart}
                    >
                        <Heart size={15} fill={hearted ? "#ec4899" : "none"} />
                    </button>
                    <button
                        className={styles.actionIconBtn}
                        title="Ajouter à une collection"
                        onClick={() => onOpenShelfPicker(Tool.id)}
                    >
                        <Bookmark size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}