import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Bookmark, ArrowRight } from "lucide-react"
import styles from "../../style/tools/toolcomponent.module.css"

const ToolCard = ({ id, icon, name, rating, features, provider, isFavorited, onToggleFavorite, onOpenShelfPicker }) => {
    const [hearted, setHearted] = useState(isFavorited);

    const handleHeart = () => {
        const next = !hearted;
        setHearted(next);
        onToggleFavorite(id, next);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    <img src={icon} alt={name} className={styles.toolIconImage} />
                </div>
                <div className={styles.headerInfo}>
                    <h3 className={styles.toolName}>{name}</h3>
                    <p className={styles.provider}>By {provider}</p>
                    <div className={styles.rating}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span>{rating}</span>
                    </div>
                </div>
            </div>

            <ul className={styles.featureList}>
                {features?.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                        {feature}
                    </li>
                ))}
            </ul>

            <div className={styles.cardFooter}>
                <button
                    className={`${styles.secondaryBtn} ${hearted ? styles.heartActive : styles.favorite}`}
                    aria-label="Ajouter aux favoris"
                    onClick={handleHeart}
                >
                    <Heart size={20} fill={hearted ? "#ec4899" : "none"} />
                </button>
                <button
                    className={styles.secondaryBtn}
                    aria-label="Sauvegarder dans la bibliothèque"
                    onClick={() => onOpenShelfPicker(id)}
                >
                    <Bookmark size={20} />
                </button>
                <Link to={`/tool/${name}`} className={styles.actionBtn}>
                    Détails
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

export default function ToolComponent({ tools = [], favoriteIds = new Set(), onToggleFavorite, onOpenShelfPicker }) {
    return (
        <>
            {tools.map((tool, index) => (
                <ToolCard
                    key={index}
                    {...tool}
                    isFavorited={favoriteIds.has(tool.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenShelfPicker={onOpenShelfPicker}
                />
            ))}
        </>
    );
}
