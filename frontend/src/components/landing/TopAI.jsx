
import { useEffect, useRef } from "react";
import style from "../../style/landing/TopAI.module.css"
import Top3IACard from "./Top3IACard";
import Top8AICard from "./Top8IACard"

const TopAI = ({scrollRef}) =>{
    const sectionRef = useRef(null);
    const itemRefs = useRef([]);
    const aiTools = [
        { id:1 ,icon: "🤖", name: "ChatGPT", category: "Conversational AI", rate: 4.8 },
        { id:2 ,icon: "✨", name: "Gemini", category: "Multimodal Assistant", rate: 4.7 },
        { id:3 ,icon: "🧠", name: "Claude", category: "Conversational AI", rate: 4.8 },
        { id:4 ,icon: "🎨", name: "Midjourney", category: "Image Generation", rate: 4.9 },
        { id:5 ,icon: "🔍", name: "Perplexity", category: "AI Search Engine", rate: 4.6 },
        { id:6 ,icon: "🚀", name: "Copilot", category: "Coding & Productivity", rate: 4.5 },
        { id:7 ,icon: "🖌️", name: "DALL-E 3", category: "Image Generation", rate: 4.6 },
        { id:8 ,icon: "✍️", name: "Jasper", category: "Marketing & Copywriting", rate: 4.4 }
    ];
    const sortedIA = [...aiTools].sort((a,b)=>b.rate-a.rate);
    const rankedAI = sortedIA.map((ai,index)=>{
        return{
            rank : index+1,
            ...ai
        }
    })

    const top3AI = rankedAI.slice(0,3);
    const top8AI = rankedAI.slice(3,8);
    const top3StartIndex = 3;
    const top8LabelIndex = top3StartIndex + top3AI.length;
    const top8StartIndex = top8LabelIndex + 1;
    const setItemRef = (index) => (el) => {
        itemRefs.current[index] = el;
    };

    useEffect(() => {
        const timeouts = [];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    itemRefs.current.forEach((ref, index) => {
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

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
            timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        };
    }, []);
    return(
        <>
        <div ref={scrollRef}>

        <div className={style.TopAI} ref={sectionRef} >
            <div className={style.header}>
                <div className={`${style.hero} ${style.fromgrid}`} ref={setItemRef(0)}>
                    <span className={style.heroLine}></span>
                    COMMUNITY RATED
                </div>
                <h2 className={`${style.intro} ${style.fromgrid}`} ref={setItemRef(1)}>The Penguin Hall of Fame</h2>
                <p className={`${style.desc} ${style.fromgrid}`} ref={setItemRef(2)}>Ranked by thousands of verified community reviews.</p>
            </div>
            <div className={style.stage}>
                <div className={style.stageBackdrop} aria-hidden="true">
                    <span className={style.ringLarge}></span>
                    <span className={style.ringMid}></span>
                    <span className={style.ringSmall}></span>
                </div>
                <div className={style.stageDot} aria-hidden="true"></div>
                <div className={style.top3AI}>
                {top3AI.map((ai3, index)=> (
                    <Top3IACard 
                        key={ai3.id}
                        icon={ai3.icon}
                        name={ai3.name}
                        category={ai3.category}
                        rate={ai3.rate}
                        stars={"⭐".repeat(Math.round(ai3.rate))}
                        rank={ai3.rank}
                        className={style.fromgrid}
                        ref={setItemRef(top3StartIndex + index)}
                    />
                ))}
                </div>
                <div className={style.stageBase} aria-hidden="true"></div>
            </div>
            <div className={style.rankSection}>
                <div className={`${style.top8AIRank} ${style.fromgrid}`} ref={setItemRef(top8LabelIndex)}>Ranks 4 - 8</div>
                <div className={style.top8AI}>
                    {top8AI.map((ai8, index)=> (
                        <Top8AICard
                            key={ai8.id}
                            icon={ai8.icon}
                            name={ai8.name}
                            rate={ai8.rate}
                            rank={ai8.rank}
                            className={style.fromgrid}
                            ref={setItemRef(top8StartIndex + index)}
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