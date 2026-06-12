import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import style from "../../style/profile/Reviews.module.css"

const Reviews = () =>{
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/user/reviews")
            .then((res) => setReviews(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={style.card}>
                <div className={style.card_head}><h2>✍️ Reviews</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`${style.star} ${i < count ? "" : style.empty}`}>★</span>
        ));
    };

    return(
        <div className={style.card}>
        <div className={style.card_head}>
          <h2>✍️ Reviews {reviews.length > 0 && <span className={style.count}>({reviews.length})</span>}</h2>
        </div>
        <div className={style.card_body}>
          {reviews.length === 0 ? (
            <div className={style.empty}>No reviews yet.</div>
          ) : (
            reviews.slice(0, 10).map((r) => (
              <div key={r.id} className={style.review_item}>
                <div className={style.review_header}>
                  <div className={style.review_tool}>
                    {r.tool_logo ? (
                      <img src={r.tool_logo.startsWith("/") ? "http://localhost:8000" + r.tool_logo : r.tool_logo} alt="" className={style.tool_badge} style={{ width: 20, height: 20, borderRadius: 4, objectFit: "cover" }} />
                    ) : (
                      <div className={style.tool_badge}>🔧</div>
                    )}
                    {r.tool_name || "Unknown tool"}
                  </div>
                  <span className={`${style.review_status} ${r.status === "approved" ? style.approved : style.pending}`}>{r.status}</span>
                </div>
                <div className={style.stars}>{renderStars(r.rating)}</div>
                {r.comment && <div className={style.review_comment}>{r.comment}</div>}
                <div className={style.review_date}>{r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
              </div>
            ))
          )}
        </div>
      </div>
    )
}
export default Reviews