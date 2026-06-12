import styles from "../style/Pages/tooldetailspage.module.css"
import ToolDetailsHeader from "../components/toolDetails/toolDetailsHeader";
import ToolDetailsMain from "../components/toolDetails/toolDetailsMain";
import ToolDetailsSide from "../components/toolDetails/toolDetailsSide";
import { useParams, useNavigate } from "react-router-dom";
import SimilarTools from "../components/toolDetails/SimilarTools";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Star, Send, Clock, AlertTriangle, CheckCircle, Edit2, Trash2 } from "lucide-react";
import api, { API_BASE } from "../services/api";
import ShelfPicker from "../components/library/ShelfPicker";
import { useAuth } from "../context/AuthContext";

const MAX_VISIBLE_REVIEWS = 6;

const ToolDetailsPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [pickerToolId, setPickerToolId] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewResult, setReviewResult] = useState(null);
    const [editReviewId, setEditReviewId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [starFilter, setStarFilter] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        const fetchTool = api.get("/tools?name=" + encodeURIComponent(name));
        const fetchFavs = api.get("/favorites").catch(() => ({ data: [] }));

        Promise.all([fetchTool, fetchFavs])
            .then(([toolRes, favRes]) => {
                const t = toolRes?.data;
                if (!t) {
                    setError(true);
                    return;
                }
                t.icon = t.logo_url?.startsWith("/") ? API_BASE + t.logo_url : t.logo_url;
                t.provider = t.provider_name;
                t.category = t.category_name;
                t.rating = t.global_rating;
                t.created_by = t.created_by_name;
                t.validated_by = t.validated_by_name;
                if (t.similar_tools) {
                    t.similar_tools = t.similar_tools.map(st => ({
                        ...st,
                        logo_url: st.logo_url?.startsWith("/") ? API_BASE + st.logo_url : st.logo_url,
                    }));
                }
                setTool(t);

                const favs = favRes?.data || [];
                setIsFavorited(favs.some(f => Number(f.id) === Number(t.id)));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [name]);

    const refreshReviews = useCallback(() => {
        if (!tool?.id) return;
        api.get("/tools/reviews?tool_id=" + tool.id)
            .then((res) => {
                setReviews(res.data?.reviews || []);
                setUserReview(res.data?.user_review || null);
            })
            .catch(() => {});
    }, [tool?.id]);

    useEffect(() => {
        if (!tool?.id) return;
        setReviewsLoading(true);
        refreshReviews();
        setReviewsLoading(false);
    }, [tool?.id, refreshReviews]);

    const handleToggleFavorite = useCallback((toolId, next) => {
        api.post("/favorites/toggle", { tool_id: toolId }).catch(() => {});
        setIsFavorited(next);
    }, []);

    const handleSubmitReview = () => {
        if (reviewRating < 1 || reviewRating > 5) return;
        if (!tool?.id) return;

        setReviewSubmitting(true);
        setReviewResult(null);

        const isEdit = editReviewId !== null;
        const endpoint = isEdit ? "/reviews/update" : "/reviews/submit";
        const payload = isEdit
            ? { id: editReviewId, rating: reviewRating, comment: reviewComment.trim() || "" }
            : { tool_id: tool.id, rating: reviewRating, comment: reviewComment.trim() || "" };

        api.post(endpoint, payload)
            .then((res) => {
                const msg = res.message || "";
                if (msg.includes("moderation")) {
                    setReviewResult({ type: "pending", message: "Votre avis modifié a été soumis pour modération." });
                } else {
                    setReviewResult({ type: "success", message: isEdit ? "Votre avis a été modifié." : "Merci pour votre avis !" });
                }
                setShowReviewForm(false);
                setEditReviewId(null);
                setReviewRating(0);
                setReviewComment("");
                refreshReviews();
            })
            .catch((err) => {
                const detail = err?.response?.data?.message || err?.message || err?.data?.message || "Erreur lors de l'envoi";
                setReviewResult({ type: "error", message: detail });
            })
            .finally(() => setReviewSubmitting(false));
    };

    const handleStartEdit = (review) => {
        setEditReviewId(review.id);
        setReviewRating(Number(review.rating));
        setReviewComment(review.comment || "");
        setShowReviewForm(true);
        setReviewResult(null);
        setDeleteConfirmId(null);
    };

    const handleCancelEdit = () => {
        setEditReviewId(null);
        setReviewRating(0);
        setReviewComment("");
        setShowReviewForm(false);
    };

    const handleDeleteReview = () => {
        if (!deleteConfirmId) return;
        api.post("/reviews/delete", { id: deleteConfirmId })
            .then(() => {
                setDeleteConfirmId(null);
                setReviewResult({ type: "success", message: "Votre avis a été supprimé." });
                refreshReviews();
            })
            .catch((err) => {
                const detail = err?.response?.data?.message || err?.message || err?.data?.message || "Erreur lors de la suppression";
                setReviewResult({ type: "error", message: detail });
                setDeleteConfirmId(null);
            });
    };

    const renderStarsText = (count) => {
        const filled = '★'.repeat(count);
        const empty = '☆'.repeat(5 - count);
        return filled + empty;
    };

    const renderValue = (value) => {
        if (value === null || value === undefined || value === "") return "-";
        return value;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
        });
    };

    const publicReviews = userReview
        ? reviews.filter(r => Number(r.id) !== Number(userReview.id))
        : reviews;

    const filteredReviews = starFilter === 0
        ? publicReviews
        : publicReviews.filter(r => Number(r.rating) === starFilter);

    const hasMoreReviews = filteredReviews.length > MAX_VISIBLE_REVIEWS;
    const displayedReviews = showAllReviews || !hasMoreReviews
        ? filteredReviews
        : filteredReviews.slice(0, MAX_VISIBLE_REVIEWS);

    const visibleCount = (userReview ? 1 : 0) + displayedReviews.length;
    const totalCount = (userReview ? 1 : 0) + publicReviews.length;

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "var(--text-muted)", gap: 12 }}>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Chargement...</span>
                </div>
            </div>
        );
    }

    if (!tool || error) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.contentWrapper}>
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
                        <h2>Outil introuvable</h2>
                        <p>Cet outil n'existe pas ou a été retiré.</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderReviewForm = () => {
        const isEdit = editReviewId !== null;
        return (
            <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
            }}>
                <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>Votre note</div>
                    <div style={{ display: "flex", gap: "4px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "2px",
                                    color: star <= reviewRating ? "#f59e0b" : "var(--border)",
                                    transition: "color 0.15s",
                                }}
                            >
                                <Star size={24} fill={star <= reviewRating ? "#f59e0b" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                        Commentaire <span style={{ fontWeight: 400, color: "var(--text-muted)", opacity: 0.6 }}>(optionnel — sera modéré par l'IA)</span>
                    </div>
                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Partagez votre expérience avec cet outil..."
                        maxLength={1000}
                        style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "10px 12px",
                            background: "var(--bg-card-h)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            color: "var(--text-primary)",
                            fontSize: "13.5px",
                            fontFamily: "inherit",
                            resize: "vertical",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />
                    <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{reviewComment.length}/1000</div>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                        onClick={handleCancelEdit}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid var(--border)",
                            borderRadius: "9px",
                            background: "transparent",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "13px",
                        }}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmitReview}
                        disabled={reviewRating < 1 || reviewSubmitting}
                        style={{
                            padding: "8px 18px",
                            border: "none",
                            borderRadius: "9px",
                            background: reviewRating < 1 ? "var(--border)" : "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                            color: reviewRating < 1 ? "var(--text-muted)" : "#fff",
                            cursor: reviewRating < 1 ? "not-allowed" : "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        {reviewSubmitting ? "Envoi..." : <><Send size={13} /> {isEdit ? "Modifier" : "Envoyer"}</>}
                    </button>
                </div>
            </div>
        );
    };

    const renderReviewCard = (review, isOwn) => {
        const isRatingOnly = !review.comment;
        const isPending = review.status === "flagged" || review.status === "pending";
        return (
            <div key={review.id} className={`${styles.reviewCard} ${isOwn ? styles.reviewCardOwn : ""}`}>
                <div className={styles.reviewHeader}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div className={styles.reviewerName}>{review.user_name || "Anonyme"}</div>
                            {isRatingOnly && isOwn && (
                                <span className={styles.privateBadge}>
                                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    Privé
                                </span>
                            )}
                            {isPending && isOwn && (
                                <span className={styles.privateBadge}>
                                    <Clock size={10} />
                                    En modération
                                </span>
                            )}
                        </div>
                        {review.profession_name && (
                            <div className={styles.professionBadge}>{review.profession_name}</div>
                        )}
                        <div className={styles.reviewDate}>{formatDate(review.created_at)}</div>
                    </div>
                    <div className={styles.reviewStars}>{renderStarsText(review.rating)}</div>
                </div>
                {!isRatingOnly && <p className={styles.reviewText}>{review.comment}</p>}

                {deleteConfirmId === review.id ? (
                    <div className={styles.deleteConfirm}>
                        <span className={styles.deleteConfirmText}>Confirmer la suppression ?</span>
                        <div className={styles.deleteConfirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)}>Annuler</button>
                            <button className={styles.confirmBtn} onClick={handleDeleteReview}>Supprimer</button>
                        </div>
                    </div>
                ) : isOwn ? (
                    <div className={styles.reviewActions}>
                        <button className={styles.reviewActionBtn} onClick={() => handleStartEdit(review)}>
                            <Edit2 size={12} /> Modifier
                        </button>
                        <button className={`${styles.reviewActionBtn} ${styles.reviewActionBtnDelete}`} onClick={() => setDeleteConfirmId(review.id)}>
                            <Trash2 size={12} /> Supprimer
                        </button>
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className={styles.backLink}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Retour
                </a>

                <ToolDetailsHeader
                    Tool={tool}
                    isFavorited={isFavorited}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenShelfPicker={(id) => setPickerToolId(id)}
                />
                
                <div className={styles.contentGrid}>
                    <ToolDetailsMain Tool={tool}/>
                    <ToolDetailsSide Tool={tool}/>

                    <div className={styles.metaSection}>
                        <h2>Metadonnées</h2>
                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <div className={styles.metaItemLabel}>Created By</div>
                                <div className={styles.metaItemValue}>{renderValue(tool.created_by)}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaItemLabel}>Validated By</div>
                                <div className={styles.metaItemValue}>{renderValue(tool.validated_by)}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaItemLabel}>Created At</div>
                                <div className={styles.metaItemValue}>{renderValue(tool.created_at)}</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaItemLabel}>Updated At</div>
                                <div className={styles.metaItemValue}>{renderValue(tool.updated_at)}</div>
                            </div>
                        </div>
                    </div>

                    <section className={styles.reviewsSection}>
                        <div className={styles.reviewsHeader}>
                            <h2>
                                Avis
                                {totalCount > 0 && (
                                    <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-muted)" }}> ({totalCount})</span>
                                )}
                            </h2>
                            {isAuthenticated && !userReview && (
                                <button className={styles.btnReview} onClick={() => {
                                    if (editReviewId) handleCancelEdit();
                                    else setShowReviewForm(!showReviewForm);
                                }}>
                                    {showReviewForm ? "Annuler" : <>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                                        Écrire un avis
                                    </>}
                                </button>
                            )}
                        </div>

                        {showReviewForm && renderReviewForm()}

                        {reviewResult && (
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                marginBottom: "16px",
                                background: reviewResult.type === "error" ? "rgba(239,68,68,0.1)" : reviewResult.type === "pending" ? "rgba(251,191,36,0.1)" : "rgba(34,197,94,0.1)",
                                border: `1px solid ${
                                    reviewResult.type === "error" ? "rgba(239,68,68,0.2)" : reviewResult.type === "pending" ? "rgba(251,191,36,0.2)" : "rgba(34,197,94,0.2)"
                                }`,
                                fontSize: "13.5px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.5",
                            }}>
                                {reviewResult.type === "error" ? <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} /> :
                                 reviewResult.type === "pending" ? <Clock size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} /> :
                                 <CheckCircle size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />}
                                <span>{reviewResult.message}</span>
                            </div>
                        )}

                        {(totalCount > 0 || publicReviews.length > 0) && (
                            <div className={styles.reviewFilters}>
                                <button
                                    className={`${styles.filterBtn} ${starFilter === 0 ? styles.filterBtnActive : ""}`}
                                    onClick={() => setStarFilter(0)}
                                >
                                    Tous
                                </button>
                                {[5, 4, 3, 2, 1].map(s => (
                                    <button
                                        key={s}
                                        className={`${styles.filterBtn} ${starFilter === s ? styles.filterBtnActive : ""}`}
                                        onClick={() => setStarFilter(s)}
                                    >
                                        {s}★
                                    </button>
                                ))}
                            </div>
                        )}

                        {reviewsLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0", color: "var(--text-muted)" }}>
                                <Loader2 size={20} className="animate-spin" />
                            </div>
                        ) : totalCount === 0 && !showReviewForm ? (
                            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-muted)", fontSize: "14px" }}>
                                {isAuthenticated ? "Aucun avis pour le moment. Soyez le premier à donner votre avis !" : "Connectez-vous pour laisser un avis."}
                            </div>
                        ) : (
                            <>
                                <div className={styles.reviewsGrid}>
                                    {userReview && renderReviewCard(userReview, true)}
                                    {displayedReviews.map(r => renderReviewCard(r, false))}
                                </div>
                                {hasMoreReviews && !showAllReviews && (
                                    <button className={styles.seeMoreBtn} onClick={() => setShowAllReviews(true)}>
                                        Voir plus ({filteredReviews.length - MAX_VISIBLE_REVIEWS} avis supplémentaires)
                                    </button>
                                )}
                            </>
                        )}
                    </section>

                    <SimilarTools tools={tool.similar_tools} />
                </div>
            </div>

            {pickerToolId && (
                <ShelfPicker toolId={pickerToolId} onClose={() => setPickerToolId(null)} />
            )}
        </div>
    );
};

export default ToolDetailsPage;
