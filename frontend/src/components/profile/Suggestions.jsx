import style from "../../style/profile/Suggestions.module.css"

const Suggestions = () =>{
    return(
        <div className={`${style.card} ${style.full}`}>
        <div className={style.card_head}>
          <h2>💡 My Suggestions <span className={style.count}>3</span></h2>
          <a href="#" className={style.see_all}>Submit new →</a>
        </div>
        <div className={style.card_body}>
          <div className={style.suggestion_list}>
            <div className={style.suggestion_item}>
              <div className={style.sug_header}>
                <div>
                  <div className={style.sug_name}>Framer AI</div>
                  <div className={style.sug_website}>framer.com</div>
                </div>
                <span className={`${style.sug_status} ${style.approved}`}>approved</span>
              </div>
              <div className={style.sug_desc}>AI-powered website builder with real-time design suggestions and CMS integration. Allows designers to go from prototype to production without writing code.</div>
              <div className={style.sug_footer}>
                <span className={style.sug_chip}><span>Category</span> Design</span>
                <span className={style.sug_chip}><span>Provider</span> Framer Inc.</span>
                <span className={style.sug_chip}><span>Release</span> Jan 2024</span>
                <span className={style.sug_chip}>🏷️ no-code, website builder</span>
              </div>
            </div>
            <div className={style.suggestion_item}>
              <div className={style.sug_header}>
                <div>
                  <div className={style.sug_name}>Luma AI</div>
                  <div className={style.sug_website}>lumalabs.ai</div>
                </div>
                <span className={`${style.sug_status} ${style.pending_manager}`}>pending manager</span>
              </div>
              <div className={style.sug_desc}>3D scene capture and neural radiance field rendering for product shots and immersive media. Particularly useful for e-commerce and architecture visualization.</div>
              <div className={style.sug_footer}>
                <span className={style.sug_chip}><span>Category</span> 3D / Vision</span>
                <span className={style.sug_chip}><span>Provider</span> Luma AI</span>
                <span className={style.sug_chip}><span>Release</span> Mar 2024</span>
                <span className={style.sug_chip}>🏷️ NeRF, 3D capture</span>
              </div>
            </div>
            <div className={style.suggestion_item}>
              <div className={style.sug_header}>
                <div>
                  <div className={style.sug_name}>MusicGen Studio</div>
                  <div className={style.sug_website}>musicgen.ai</div>
                </div>
                <span className={`${style.sug_status} ${style.rejected_ai}`}>rejected by AI</span>
              </div>
              <div className={style.sug_desc}>Text-to-music generation tool with stem separation and DAW plugin support. Focused on royalty-free music generation for content creators.</div>
              <div className={style.sug_footer}>
                <span className={style.sug_chip}><span>Category</span> Audio</span>
                <span className={style.sug_chip}><span>Provider</span> Proposed: MetaAI</span>
              </div>
              <div className={style.sug_rejection}>⚠️ Rejection reason: Duplicate entry — a similar tool with overlapping features already exists in the Audio category. Please review existing listings before re-submitting.</div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default Suggestions