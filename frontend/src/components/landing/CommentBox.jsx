import style from "../../style/landing/CommentBox.module.css"

const CommentBox = ({ logo , rate , fullName , profession , country , icon , AIName , comment}) => {
    const rating = Number(rate) || 0
    const stars = rating > 0 ? "★".repeat(Math.round(rating)) : rate
    const userInfo = [profession, country].filter(Boolean).join(" · ")

    return(
        <>
            <div className={style.CommentBox}>
                <div className={style.topSection}>
                    <div className={style.logo}>{logo}</div>
                    <div className={style.rate}>{stars}</div>
                </div>
                <div className={style.userDetailsContainer}>
                    <div className={style.fullName}>{fullName}</div>
                    {userInfo && <div className={style.userInfo}>{userInfo}</div>}
                </div>
                {AIName && <div className={style.iaName}>{icon} {AIName}</div>}
                <div className={style.comment}>{comment}</div>
            </div>
        </>
    )
}
export default CommentBox
