import style from "../../style/profile/SearchHistory.module.css"

const SearchHistory = () =>{
    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>🔍 Search History <span className={style.count}>52</span></h2>
          <a href="#" className={style.see_all}>Clear →</a>
        </div>
        <div className={style.card_body}>
          <div className={style.history_list}>
            <div className={style.history_item}>
              <div className={`${style.history_type_icon} ${style.ai}`}>✦</div>
              <div className={style.history_content}>
                <div className={style.history_title}>Best tools for UX wireframing in 2025</div>
                <div className={style.history_prompt}>Find me AI-powered wireframing tools that integrate with Figma...</div>
                <div className={style.history_cats}>
                  <span className={style.history_cat_tag}>Design</span>
                  <span className={style.history_cat_tag}>Productivity</span>
                </div>
              </div>
              <div className={style.history_meta}>
                <div className={style.history_type_label}>AI Prompt</div>
                <div className={style.history_date}>Jun 1</div>
              </div>
            </div>
            <div className={style.history_item}>
              <div className={`${style.history_type_icon} ${style.keyword}`}>⌕</div>
              <div className={style.history_content}>
                <div className={style.history_title}>voice synthesis free tier</div>
                <div className={style.history_prompt}>voice synthesis free tier</div>
                <div className={style.history_cats}>
                  <span className={style.history_cat_tag}>Audio</span>
                </div>
              </div>
              <div className={style.history_meta}>
                <div className={style.history_type_label}>Keyword</div>
                <div className={style.history_date}>May 29</div>
              </div>
            </div>
            <div className={style.history_item}>
              <div className={`${style.history_type_icon} ${style.ai}`}>✦</div>
              <div className={style.history_content}>
                <div className={style.history_title}>AI tools for competitor analysis</div>
                <div className={style.history_prompt}>Suggest tools for market research and brand tracking with AI...</div>
                <div className={style.history_cats}>
                  <span className={style.history_cat_tag}>Analytics</span>
                  <span className={style.history_cat_tag}>Research</span>
                </div>
              </div>
              <div className={style.history_meta}>
                <div className={style.history_type_label}>AI Prompt</div>
                <div className={style.history_date}>May 24</div>
              </div>
            </div>
            <div className={style.history_item}>
              <div className={`${style.history_type_icon} ${style.keyword}`}>⌕</div>
              <div className={style.history_content}>
                <div className={style.history_title}>open source llm deployment</div>
                <div className={style.history_prompt}>open source llm deployment</div>
              </div>
              <div className={style.history_meta}>
                <div className={style.history_type_label}>Keyword</div>
                <div className={style.history_date}>May 18</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default SearchHistory