import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../style/library/Favorite.module.css"

const Favorite = ({ icon, name, description, rating, category, accent, removeButton, onRemove, isFavorited, onToggleFavorite }) => {
    const navigate = useNavigate();
    const [hearted, setHearted] = useState(isFavorited ?? true);

    const handleHeart = (e) => {
        e.stopPropagation();
        const next = !hearted;
        setHearted(next);
        onToggleFavorite?.(next);
    };

    const isUrl = typeof icon === "string" && (icon.startsWith("http") || icon.startsWith("/"));

    return (
        <div className={`${style.toolCard} ${style.cardEnter}`} data-accent={accent} onClick={() => navigate("/tool/" + encodeURIComponent(name))}>
            <div className={style.cardTop}>
                <div className={style.logoBox}>{isUrl ? <img src={icon} alt={name} className={style.favLogo} /> : icon}</div>
                <span className={style.toolName}>{name}</span>
                <div className={style.topActions}>
                    <button
                        className={`${style.heartBtn} ${hearted ? style.heartActive : ''}`}
                        title={hearted ? "Remove from favorites" : "Add to favorites"}
                        onClick={handleHeart}
                    >
                        {hearted ? '❤️' : '🤍'}
                    </button>
                    {removeButton && onRemove && (
                        <button className={style.bookmarkBtn} title="Remove from shelf" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <p className={style.cardDesc}>{description}</p>
            <div className={style.cardFooter}>
                <span className={style.rating}>⭐ {rating}</span>
                <span className={style.tagPill}>{category}</span>
            </div>
        </div>
    )
}
export default Favorite
