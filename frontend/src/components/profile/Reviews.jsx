import style from "../../style/profile/Reviews.module.css"


const Reviews = () =>{
    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>✍️ Reviews <span className={style.count}>18</span></h2>
          <a href="#" className={style.see_all}>See all →</a>
        </div>
        <div className={style.card_body}>
          <div className={style.review_item}>
            <div className={style.review_header}>
              <div className={style.review_tool}>
                <div className={style.tool_badge}>🤖</div>
                Midjourney
              </div>
              <span className={`${style.review_status} ${style.approved}`}>approved</span>
            </div>
            <div className={style.stars}>
              <span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span>
            </div>
            <div className={style.review_comment}>Absolutely transformed my design workflow. The v6 model is insane for concept art generation — I can ideate 10× faster now.</div>
            <div className={style.review_date}>May 14, 2025</div>
          </div>
          <div className={style.review_item}>
            <div className={style.review_header}>
              <div className={style.review_tool}>
                <div className={style.tool_badge}>✍️</div>
                Notion AI
              </div>
              <span className={`${style.review_status} ${style.approved}`}>approved</span>
            </div>
            <div className={style.stars}>
              <span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span><span className={`${style.star} ${style.empty}`}>★</span>
            </div>
            <div className={style.review_comment}>Great for summarizing meeting notes. Wish the writing suggestions were a bit more context-aware, but overall solid.</div>
            <div className={style.review_date}>Apr 29, 2025</div>
          </div>
          <div className={style.review_item}>
            <div className={style.review_header}>
              <div className={style.review_tool}>
                <div className={style.tool_badge}>🎧</div>
                ElevenLabs
              </div>
              <span className={`${style.review_status} ${style.pending}`}>pending</span>
            </div>
            <div className={style.stars}>
              <span className={style.star}>★</span><span className={style.star}>★</span><span className={style.star}>★</span><span className={`${style.star} ${style.empty}`}>★</span><span className={`${style.star} ${style.empty}`}>★</span>
            </div>
            <div className={style.review_comment}>Voice cloning is impressive but pricing feels steep for small teams. The API could use better documentation too.</div>
            <div className={style.review_date}>Jun 1, 2025</div>
          </div>
        </div>
      </div>
    )
}
export default Reviews