import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import style from "../../style/profile/Suggestions.module.css"

const statusClass = (status) => {
    if (status === "approved" || status === "published" || status === "ai_approved_pending_review") return style.approved;
    if (status === "rejected_ai" || status === "rejected") return style.rejected_ai;
    return style.pending_manager;
};

const statusLabel = (status) => {
    const labels = {
        "approved": "approved",
        "published": "published",
        "ai_approved_pending_review": "pending review",
        "rejected_ai": "rejected by AI",
        "rejected": "rejected",
        "waiting_ai_analysis": "AI analysis...",
        "pending_manager": "pending manager",
    };
    return labels[status] || status;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const Suggestions = () =>{
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/suggestions/history")
            .then((res) => setSuggestions(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={`${style.card} ${style.full}`}>
                <div className={style.card_head}><h2>💡 My Suggestions</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }

    return(
        <div className={`${style.card} ${style.full}`}>
        <div className={style.card_head}>
          <h2>💡 My Suggestions {suggestions.length > 0 && <span className={style.count}>({suggestions.length})</span>}</h2>
        </div>
        <div className={style.card_body}>
          {suggestions.length === 0 ? (
            <div className={style.empty}>No suggestions yet.</div>
          ) : (
            <div className={style.suggestion_list}>
              {suggestions.slice(0, 10).map((s) => (
                <div key={s.id} className={style.suggestion_item}>
                  <div className={style.sug_header}>
                    <div>
                      <div className={style.sug_name}>{s.name}</div>
                      <div className={style.sug_website}>{s.website_url ? s.website_url.replace(/^https?:\/\//, "") : ""}</div>
                    </div>
                    <span className={`${style.sug_status} ${statusClass(s.status)}`}>{statusLabel(s.status)}</span>
                  </div>
                  <div className={style.sug_desc}>{s.description}</div>
                  <div className={style.sug_footer}>
                    {s.category_name && (
                        <span className={style.sug_chip}><span>Category</span> {s.category_name}</span>
                    )}
                    {s.provider_name && (
                        <span className={style.sug_chip}><span>Provider</span> {s.provider_name}</span>
                    )}
                    {s.release_date && (
                        <span className={style.sug_chip}><span>Release</span> {formatDate(s.release_date)}</span>
                    )}
                  </div>
                  {s.rejection_reason && (
                    <div className={style.sug_rejection}>⚠️ {s.rejection_reason}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}
export default Suggestions