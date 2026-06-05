import style from "../../style/profile/Favorites.module.css"

const Favorites = () =>{
    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>⭐ Favorites <span className={style.count}>24</span></h2>
          <a href="#" className={style.see_all}>See all →</a>
        </div>
        <div className={style.card_body}>
          <div className={style.fav_grid}>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>🎨</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>Figma AI</div>
                <div className={style.fav_cat}>Design</div>
                <div className={style.rating}>★ 4.8</div>
              </div>
            </div>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>🤖</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>Claude</div>
                <div className={style.fav_cat}>Writing</div>
                <div className={style.rating}>★ 4.9</div>
              </div>
            </div>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>🖼️</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>DALL·E 3</div>
                <div className={style.fav_cat}>Image Gen</div>
                <div className={style.rating}>★ 4.6</div>
              </div>
            </div>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>📊</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>Julius AI</div>
                <div className={style.fav_cat}>Data Analysis</div>
                <div className={style.rating}>★ 4.5</div>
              </div>
            </div>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>🎵</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>Suno</div>
                <div className={style.fav_cat}>Audio</div>
                <div className={style.rating}>★ 4.4</div>
              </div>
            </div>
            <div className={style.fav_card}>
              <div className={style.fav_logo}>💬</div>
              <div className={style.fav_info}>
                <div className={style.fav_name}>Perplexity</div>
                <div className={style.fav_cat}>Search</div>
                <div className={style.rating}>★ 4.7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default Favorites