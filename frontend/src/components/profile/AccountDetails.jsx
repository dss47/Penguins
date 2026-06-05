import style from "../../style/profile/AccountDetails.module.css"

const AccountDetails = () =>{
    return(
        <div className={`${style.card} ${style.full}`}>
        <div className={style.card_head}>
          <h2>⚙️ Account Details</h2>
          <a href="#" className={style.see_all}>Edit →</a>
        </div>
        <div className={style.card_body}>
          <div className={style.settings_grid}>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Full Name</div>
              <div className={style.settings_val}>Sarah Amara</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Email Address</div>
              <div className={`${style.settings_val} ${style.monospace}`}>sarah.amara@aitools.io</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Role</div>
              <div className={style.settings_val}>Manager</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Account Status</div>
              <div className={style.settings_val} style={{color:"var(--ng)"}}>● Active</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Profession</div>
              <div className={style.settings_val}>UX Designer</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Password</div>
              <div className={`${style.settings_val} ${style.redacted}`}>●●●●●●●●●●</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Member Since</div>
              <div className={style.settings_val}>March 6, 2025</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Last Updated</div>
              <div className={style.settings_val}>June 1, 2025</div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default AccountDetails