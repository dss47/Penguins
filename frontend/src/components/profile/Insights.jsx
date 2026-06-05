import style from "../../style/profile/Insights.module.css"

const Insights = () =>{
    return(
        <div className={style.stats}>
        <div className={`${style.stat_card} ${style.accent}`}>
          <div className={style.icon}>⭐</div>
          <div className={style.num}>24</div>
          <div className={style.label}>Favorites</div>
        </div>
        <div className={`${style.stat_card} ${style.teal}`}>
          <div className={style.icon}>📚</div>
          <div className={style.num}>6</div>
          <div className={style.label}>Shelves</div>
        </div>
        <div className={style.stat_card}>
          <div className={style.icon}>✍️</div>
          <div className={style.num}>18</div>
          <div className={style.label}>Reviews</div>
        </div>
        <div className={style.stat_card}>
          <div className={style.icon}>🔍</div>
          <div className={style.num}>52</div>
          <div className={style.label}>Searches</div>
        </div>
        <div className={`${style.stat_card} ${style.red}`}>
          <div className={style.icon}>💡</div>
          <div className={style.num}>3</div>
          <div className={style.label}>Suggestions</div>
        </div>
      </div>
    )
}
export default Insights