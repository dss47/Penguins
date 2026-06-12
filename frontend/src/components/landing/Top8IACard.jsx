import { forwardRef } from "react";
import style from "../../style/landing/Top8AICard.module.css"
const Top8IACard = forwardRef(({rank , imageUrl , name , rate, className}, ref) => {
    const classes = [style.Top8AI, className].filter(Boolean).join(" ");
    return(
        <>
            <div ref={ref} className={classes}>
                <div className={style.rank}>{rank}</div>
                {imageUrl ? (
                    <img src={imageUrl} className={style.icon} alt={name} />
                ) : (
                    <div className={style.icon}>{name?.slice(0, 2).toUpperCase() || "AI"}</div>
                )}
                <div className={style.second}>
                    <div className={style.name}>{name}</div>
                    <div className={style.rate}>{rate}</div>
                </div>
            </div>
        </>
    )
})
Top8IACard.displayName = "Top8IACard";
export default Top8IACard
