import { useState } from "react";
import style from "../../style/library/Favorite.module.css"

const Favorite = ({ icon, name, description, rating, category, accent, removeButton, onRemove }) => {
    const [hearted, setHearted] = useState(true);

    const handleHeart = () => {
        setHearted(!hearted);
    };

    return (
        <div className={`${style.toolCard} ${style.cardEnter}`} data-accent={accent}>
            <div className={style.cardTop}>
                <div className={style.logoBox}>{icon}</div>
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
                        <button className={style.bookmarkBtn} title="Remove from shelf" onClick={onRemove}>
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
