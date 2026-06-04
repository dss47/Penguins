import styles from "../../style/tools/toolcomponent.module.css"
import { Star, Heart, Bookmark, ArrowRight } from "lucide-react"

const ToolCard = ({ icon, name, rating, features, provider }) => {
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
                {features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                        {feature}
                    </li>
                ))}
            </ul>

            <div className={styles.cardFooter}>
                <button className={`${styles.secondaryBtn} ${styles.favorite}`} aria-label="Ajouter aux favoris">
                    <Heart size={20} />
                </button>
                <button className={styles.secondaryBtn} aria-label="Sauvegarder dans la bibliothèque">
                    <Bookmark size={20} />
                </button>
                <button className={styles.actionBtn}>
                    Détails
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default function ToolComponent({ tools = [] }) {
    return (
        <>
            {tools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
            ))}
        </>
    );
}
