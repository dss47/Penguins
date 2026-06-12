import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import style from "../../style/profile/Insights.module.css"

const Insights = () =>{
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/user/stats")
            .then((res) => setStats(res.data || null))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={style.stats} style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
                <Loader2 size={24} className="animate-spin" />
            </div>
        );
    }
    if (!stats) return null;

    return(
        <div className={style.stats}>
        <div className={`${style.stat_card} ${style.accent}`}>
          <div className={style.icon}>⭐</div>
          <div className={style.num}>{stats.favorites ?? 0}</div>
          <div className={style.label}>Favorites</div>
        </div>
        <div className={`${style.stat_card} ${style.teal}`}>
          <div className={style.icon}>📚</div>
          <div className={style.num}>{stats.shelves ?? 0}</div>
          <div className={style.label}>Shelves</div>
        </div>
        <div className={style.stat_card}>
          <div className={style.icon}>✍️</div>
          <div className={style.num}>{stats.reviews ?? 0}</div>
          <div className={style.label}>Reviews</div>
        </div>
        <div className={style.stat_card}>
          <div className={style.icon}>🔍</div>
          <div className={style.num}>{stats.searches ?? 0}</div>
          <div className={style.label}>Searches</div>
        </div>
        <div className={`${style.stat_card} ${style.red}`}>
          <div className={style.icon}>💡</div>
          <div className={style.num}>{stats.suggestions ?? 0}</div>
          <div className={style.label}>Suggestions</div>
        </div>
      </div>
    )
}
export default Insights