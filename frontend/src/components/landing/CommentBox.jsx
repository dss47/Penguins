import style from "../../style/landing/CommentBox.module.css"

const CommentBox = ({ logo , rate , fullName , profession , country , icon , AIName , comment}) => {
    return(
        <>
            <div className={style.CommentBox}>
                <div className={style.topSection}>
                    <div className={style.logo}>{logo}</div>
                    <div className={style.rate}>{rate}</div>
                </div>
                <div className={style.userDetailsContainer}>
                    <div className={style.fullName}>{fullName}</div>
                    <div className={style.userInfo}>{profession} · {country}</div>
                </div>
                <div className={style.iaName}>{icon} {AIName}</div>
                <div className={style.comment}>{comment}</div>
            </div>
        </>
    )
}
export default CommentBox