import { forwardRef } from "react";
import style from "../../style/landing/Top3IACard.module.css"

const Top3IACard = forwardRef(({rank , icon , name , category , stars , rate, className}, ref) => {
    const classes = [
        rank === 1 ? style.rank1Card : rank === 2 ? style.rank2Card : style.rank3Card,
        style.Top3card,
        className
    ].filter(Boolean).join(" ");
    return(
        <>
            <div ref={ref} className={classes}>
                <div className={`${rank===1 ? style.rank1 : rank===2? style.rank2 : style.rank3} ${style.rank}`}>{rank}</div>
                {/* <img src={icon} className={style.icon}/> */}
                <div className={style.icon}>{icon}</div>
                <div className={style.name}>{name}</div>
                <div className={style.category}>{category}</div>
                <div className={style.stars}>{stars}</div>
                <div className={style.rate}>{rate}/5</div>
            </div>
        </>
    )
})
Top3IACard.displayName = "Top3IACard";
export default Top3IACard