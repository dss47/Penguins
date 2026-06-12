import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import style from "../../style/library/Shelf.module.css"

const Shelf = ({ icon, title, description, toolCount, lastUpdated, shelfIndex, shelfData, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={style.shelfWrapper}>
            <Link
                to={`/Library/Shelf/${shelfIndex}`}
                state={{ shelf: shelfData }}
                className={`${style.shelfCard} ${style.cardEnter} ${style.shelfLink}`}
                data-shelf={shelfIndex}
            >
                <div className={style.shelfHeader}>
                    <div className={style.shelfIcon}>{icon}</div>
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
            <div className={style.dotsWrapper} ref={menuRef}>
                <button
                    className={style.dotsBtn}
                    title="Options"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ⋮
                </button>
                {menuOpen && (
                    <div className={style.dropdownMenu}>
                        <button
                            className={style.dropdownItem}
                            onClick={() => { setMenuOpen(false); onEdit?.(); }}
                        >
                            <Pencil size={15} />
                            Renommer
                        </button>
                        <button
                            className={`${style.dropdownItem} ${style.dropdownDanger}`}
                            onClick={() => { setMenuOpen(false); onDelete?.(); }}
                        >
                            <Trash2 size={15} />
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Shelf
