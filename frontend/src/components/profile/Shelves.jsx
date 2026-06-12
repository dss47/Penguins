import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import style from "../../style/profile/Shelves.module.css"

const Shelves = () =>{
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/shelves")
            .then((res) => setShelves(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const timeAgo = (dateStr) => {
        if (!dateStr) return "";
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "1d ago";
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks === 1) return "1w ago";
        if (weeks < 5) return `${weeks}w ago`;
        const months = Math.floor(days / 30);
        return `${months}mo ago`;
    };

    if (loading) {
        return (
            <div className={style.card}>
                <div className={style.card_head}><h2>📚 My Shelves</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }

    const icons = ["📁", "📂", "🗂️", "📦", "🎯", "⚡", "🧩", "🛠️", "💼", "🎨", "🚀", "🧠"];

    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>📚 My Shelves {shelves.length > 0 && <span className={style.count}>({shelves.length})</span>}</h2>
        </div>
        <div className={style.card_body}>
          {shelves.length === 0 ? (
            <div className={style.empty}>No shelves yet.</div>
          ) : (
            <div className={style.shelf_list}>
              {shelves.slice(0, 10).map((s, i) => (
                <div key={s.id} className={style.shelf_item}>
                  <div className={style.shelf_left}>
                    <div className={style.shelf_icon}>{icons[i % icons.length]}</div>
                    <div>
                      <div className={style.shelf_name}>{s.name}</div>
                      <div className={style.shelf_desc}>{s.description || "No description"}</div>
                    </div>
                  </div>
                  <div className={style.shelf_right}>
                    <div className={style.shelf_count}>{s.tool_count ?? 0}</div>
                    <div className={style.shelf_count_label}>tools</div>
                    <div className={style.shelf_date}>Updated {timeAgo(s.updated_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}
export default Shelves