import style from "../../style/profile/Shelves.module.css"

const Shelves = () =>{
    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>📚 My Shelves <span className={style.count}>6</span></h2>
          <a href="#" className={style.see_all}>New shelf +</a>
        </div>
        <div className={style.card_body}>
          <div className={style.shelf_list}>
            <div className={style.shelf_item}>
              <div className={style.shelf_left}>
                <div className={style.shelf_icon}>🎨</div>
                <div>
                  <div className={style.shelf_name}>Design Arsenal</div>
                  <div className={style.shelf_desc}>My go-to tools for creative work</div>
                </div>
              </div>
              <div className={style.shelf_right}>
                <div className={style.shelf_count}>12</div>
                <div className={style.shelf_count_label}>tools</div>
                <div className={style.shelf_date}>Updated 2d ago</div>
              </div>
            </div>
            <div className={style.shelf_item}>
              <div className={style.shelf_left}>
                <div className={style.shelf_icon}>🚀</div>
                <div>
                  <div className={style.shelf_name}>Productivity Stack</div>
                  <div className={style.shelf_desc}>Writing, research & automation</div>
                </div>
              </div>
              <div className={style.shelf_right}>
                <div className={style.shelf_count}>9</div>
                <div className={style.shelf_count_label}>tools</div>
                <div className={style.shelf_date}>Updated 1w ago</div>
              </div>
            </div>
            <div className={style.shelf_item}>
              <div className={style.shelf_left}>
                <div className={style.shelf_icon}>🧠</div>
                <div>
                  <div className={style.shelf_name}>LLM Experiments</div>
                  <div className={style.shelf_desc}>Large language models I'm testing</div>
                </div>
              </div>
              <div className={style.shelf_right}>
                <div className={style.shelf_count}>7</div>
                <div className={style.shelf_count_label}>tools</div>
                <div className={style.shelf_date}>Updated 3d ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default Shelves