
import { useEffect, useRef, useState } from "react";
import style from "../../style/landing/TopAI.module.css"
import Top3IACard from "./Top3IACard";
import Top8AICard from "./Top8IACard"
import api, { API_BASE } from "../../services/api";

const logoUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const normalizeRating = (tool) => Number(tool.global_rating || tool.website_rating || 0);

const TopAI = ({scrollRef}) =>{
    const sectionRef = useRef(null);
    const [aiTools, setAiTools] = useState([]);

    useEffect(() => {
        let cancelled = false;

        api.get("/tools")
            .then((res) => {
                if (cancelled) return;
                const ranked = (res.data || [])
                    .map((tool) => ({
                        id: tool.id,
                        imageUrl: logoUrl(tool.logo_url),
                        name: tool.name,
                        category: tool.category_name || "AI Tool",
                        rate: normalizeRating(tool),
                    }))
                    .sort((a, b) => b.rate - a.rate)
                    .slice(0, 8);
                setAiTools(ranked);
            })
            .catch(() => {
                if (!cancelled) setAiTools([]);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const rankedAI = aiTools.map((ai,index)=>{
        return{
            rank : index+1,
            ...ai
        }
    })

    const top3AI = rankedAI.slice(0,3);
    const top8AI = rankedAI.slice(3,8);

    useEffect(() => {
        const timeouts = [];
        const section = sectionRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll(`.${style.fromgrid}`);
                    items.forEach((ref, index) => {
                        if (!ref) return;
                        const timeoutId = window.setTimeout(() => {
                            ref.classList.add(style.togrid);
                        }, index * 140);
                        timeouts.push(timeoutId);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (section) {
            observer.observe(section);
        }

        return () => {
            observer.disconnect();
            timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        };
    }, [aiTools.length]);
    return(
        <>
        <div ref={scrollRef}>

        <div className={style.TopAI} ref={sectionRef} >
            <div className={style.header}>
                <div className={`${style.hero} ${style.fromgrid}`}>
                    <span className={style.heroLine}></span>
                    COMMUNITY RATED
                </div>
                <h2 className={`${style.intro} ${style.fromgrid}`}>The Penguin Hall of Fame</h2>
                <p className={`${style.desc} ${style.fromgrid}`}>Ranked by thousands of verified community reviews.</p>
            </div>
            <div className={style.stage}>
                <div className={style.stageBackdrop} aria-hidden="true">
                    <span className={style.ringLarge}></span>
                    <span className={style.ringMid}></span>
                    <span className={style.ringSmall}></span>
                </div>
                <div className={style.stageDot} aria-hidden="true"></div>
                <div className={style.top3AI}>
                {top3AI.map((ai3)=> (
                    <Top3IACard 
                        key={ai3.id}
                        imageUrl={ai3.imageUrl}
                        name={ai3.name}
                        category={ai3.category}
                        rate={ai3.rate.toFixed(1)}
                        stars={"⭐".repeat(Math.round(ai3.rate))}
                        rank={ai3.rank}
                        className={style.fromgrid}
                    />
                ))}
                </div>
                <div className={style.stageBase} aria-hidden="true"></div>
            </div>
            <div className={style.rankSection}>
                <div className={`${style.top8AIRank} ${style.fromgrid}`}>Ranks 4 - 8</div>
                <div className={style.top8AI}>
                    {top8AI.map((ai8)=> (
                        <Top8AICard
                            key={ai8.id}
                            imageUrl={ai8.imageUrl}
                            name={ai8.name}
                            rate={ai8.rate.toFixed(1)}
                            rank={ai8.rank}
                            className={style.fromgrid}
                        />
                    ))}
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default TopAI
