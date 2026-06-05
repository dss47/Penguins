import style from "../../style/profile/ProfileHeader.module.css"

const ProfileHeader = () =>{
    return(
        <div className={style.hero}>
        <div className={style.avatar_wrap}>
          <div className={style.avatar}>SA</div>
          <div className={style.avatar_status}></div>
        </div>
        <div className={style.hero_info}>
          <h1>Sarah Amara</h1>
          <div className={style.email}>sarah.amara@aitools.io</div>
          <div className={style.tags}>
            <span className={`${style.tag} ${style.role}`}><span className={style.dot}></span> Manager</span>
            <span className={`${style.tag} ${style.status}`}><span className={style.dot}></span> Active</span>
            <span className={`${style.tag} ${style.prof}`}>🎨 UX Designer</span>
          </div>
        </div>
        <div className={style.hero_meta}>
          <div className={style.meta_item}>
            <strong>127</strong>
            days active
          </div>
          <div className={style.meta_item} style={{marginTop:"8px", fontSize:".7rem"}}>
            Joined March 2025
          </div>
        </div>
      </div>
    )
}
export default ProfileHeader