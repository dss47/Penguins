import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api, { API_BASE } from "../../services/api";
import style from "../../style/profile/Favorites.module.css"

const Favorites = () =>{
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/favorites")
            .then((res) => setFavorites(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={style.card}>
                <div className={style.card_head}><h2>⭐ Favorites</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }

    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>⭐ Favorites {favorites.length > 0 && <span className={style.count}>({favorites.length})</span>}</h2>
        </div>
        <div className={style.card_body}>
          {favorites.length === 0 ? (
            <div className={style.empty}>No favorites yet.</div>
          ) : (
            <div className={style.fav_grid}>
              {favorites.slice(0, 12).map((f) => (
                <div key={f.id} className={style.fav_card}>
                  <div className={style.fav_logo}>
                    {f.logo_url ? (
                      <img src={f.logo_url.startsWith("/") ? API_BASE + f.logo_url : f.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
                    ) : (
                      (f.name || "?")[0]
                    )}
                  </div>
                  <div className={style.fav_info}>
                    <div className={style.fav_name}>{f.name}</div>
                    <div className={style.fav_cat}>{f.category_name || "Uncategorized"}</div>
                    <div className={style.rating}>★ {f.global_rating ? Number(f.global_rating).toFixed(1) : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}
export default Favorites