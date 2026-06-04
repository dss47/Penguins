import { Link } from 'react-router-dom'
import style from "../../style/library/Shelf.module.css"

const Shelf = ({ icon, title, description, toolCount, lastUpdated, shelfIndex, shelfData }) => {
    return (
        <Link
            to={`/Library/Shelf/${shelfIndex}`}
            state={{ shelf: shelfData }}
            className={`${style.shelfCard} ${style.cardEnter} ${style.shelfLink}`}
            data-shelf={shelfIndex}
        >
            <div className={style.shelfHeader}>
                <div className={style.shelfIcon}>{icon}</div>
                <button className={style.dotsBtn} title="Options" onClick={(e) => e.preventDefault()}>⋮</button>
            </div>
            <div className={style.shelfBody}>
                <h3 className={style.shelfName}>{title}</h3>
                <p className={style.shelfDesc}>{description}</p>
            </div>
            <div className={style.shelfFooter}>
                <span className={style.toolCountBadge}>{toolCount}</span>
                <span className={style.shelfUpdated}>{lastUpdated}</span>
            </div>
        </Link>
    )
}
export default Shelf
