import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import style from "../../style/profile/SearchHistory.module.css"

const SearchHistory = () =>{
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/user/search-history")
            .then((res) => setHistory(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={style.card}>
                <div className={style.card_head}><h2>🔍 Search History</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }

    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>🔍 Search History {history.length > 0 && <span className={style.count}>({history.length})</span>}</h2>
        </div>
        <div className={style.card_body}>
          {history.length === 0 ? (
            <div className={style.empty}>No search history yet.</div>
          ) : (
            <div className={style.history_list}>
              {history.slice(0, 10).map((h) => (
                <div key={h.id} className={style.history_item}>
                  <div className={`${style.history_type_icon} ${h.search_type === "ai_prompt" ? style.ai : style.keyword}`}>
                    {h.search_type === "ai_prompt" ? "✦" : "⌕"}
                  </div>
                  <div className={style.history_content}>
                    <div className={style.history_title}>{h.title}</div>
                    {h.prompt_text && <div className={style.history_prompt}>{h.prompt_text}</div>}
                  </div>
                  <div className={style.history_meta}>
                    <div className={style.history_type_label}>{h.search_type === "ai_prompt" ? "AI Prompt" : "Keyword"}</div>
                    <div className={style.history_date}>
                      {h.created_at ? new Date(h.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}
export default SearchHistory