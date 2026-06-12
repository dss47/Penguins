import styles from "../style/Pages/tooldetailspage.module.css"
import ToolDetailsHeader from "../components/toolDetails/toolDetailsHeader";
import ToolDetailsMain from "../components/toolDetails/toolDetailsMain";
import ToolDetailsSide from "../components/toolDetails/toolDetailsSide";
import { useParams, useNavigate } from "react-router-dom";
import SimilarTools from "../components/toolDetails/SimilarTools";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import api, { API_BASE } from "../services/api";
import ShelfPicker from "../components/library/ShelfPicker";

const ToolDetailsPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [pickerToolId, setPickerToolId] = useState(null);

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

    const handleToggleFavorite = useCallback((toolId, next) => {
        api.post("/favorites/toggle", { tool_id: toolId }).catch(() => {});
        setIsFavorited(next);
    }, []);

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

    const renderValue = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value;
    };

    const renderStarsText = (count) => {
        const filled = '★'.repeat(count);
        const empty = '☆'.repeat(5 - count);
        return filled + empty;
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

                    {tool.ratings_full && tool.ratings_full.length > 0 && (
                        <section className={styles.reviewsSection}>
                            <div className={styles.reviewsHeader}>
                                <h2>Avis</h2>
                                <button className={styles.btnReview}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                                    Écrire un avis
                                </button>
                            </div>
                            <div className={styles.reviewsGrid}>
                                {tool.ratings_full.map((rating, index) => (
                                    <div key={index} className={styles.reviewCard}>
                                        <div className={styles.reviewHeader}>
                                            <div>
                                                <div className={styles.reviewerName}>{rating.name}</div>
                                                <div className={styles.reviewDate}>{rating.date} {rating.hour}</div>
                                            </div>
                                            <div className={styles.reviewStars}>
                                                {renderStarsText(rating.stars)}
                                            </div>
                                        </div>
                                        <p className={styles.reviewText}>{rating.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
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
