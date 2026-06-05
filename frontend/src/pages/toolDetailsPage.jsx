import styles from "../style/Pages/tooldetailspage.module.css"
import ToolDetailsHeader from "../components/toolDetails/toolDetailsHeader";
import ToolDetailsMain from "../components/toolDetails/toolDetailsMain";
import ToolDetailsSide from "../components/toolDetails/toolDetailsSide";
import { useParams } from "react-router-dom";
import { TOOLS_DATA } from "../data/tools.js";
import SimilarTools from "../components/toolDetails/SimilarTools";

const ToolDetailsPage = () => {
    const { name } = useParams();
    const tool = TOOLS_DATA.find((t) => t.name === name);

    if (!tool) {
        return <div>Tool not found</div>;
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
                <a href="#" className={styles.backLink}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Retour
                </a>

                <ToolDetailsHeader Tool={tool}/>
                
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
        </div>
    );
};

export default ToolDetailsPage;
