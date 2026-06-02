import style from "../../style/landing/whyPenguin.module.css"
import {useEffect , useRef} from "react"
import { Link } from "react-router-dom";
const WhyPenguin = ({scrollRef}) =>{
    const sectionRef = useRef(null);
    const gridRefs = useRef([]);
    useEffect(() =>{
        const timeouts = [];
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach((entry)=>{
                if(entry.isIntersecting){
                    gridRefs.current.forEach((ref, index) => {
                        if (!ref) return;
                        const timeoutId = window.setTimeout(() => {
                            ref.classList.add(style.togrid);
                        }, index * 160);
                        timeouts.push(timeoutId);
                    });
                    observer.unobserve(entry.target);
                }
            })
        },{threshold:0.2})
        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }
    return () => {
        observer.disconnect();
        timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    }
},[])
    return(
        <>
        <div ref={scrollRef}>

        <div className={style.WhyPenguin} ref={sectionRef}>
            <div className={`${style.WhyPenguinHero} ${style.fromgrid}`} ref={(el) => gridRefs.current[0] = el}>Pourquoi nous</div>
            <div className={`${style.WhyPenguinintro} ${style.fromgrid}`} ref={(el) => gridRefs.current[1] = el}>Pourquoi choisir Penguin ?</div>
            <div className={`${style.desc} ${style.fromgrid}`} ref={(el) => gridRefs.current[2] = el}>Trois raisons pour lesquelles des milliers de constructeurs nous font confiance plutôt qu'à tout autre annuaire.</div>
            <div className={style.gridContainer}>
                <div className={`${style.grid1} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[3] = el}>
                    <div className={style.icon}>🧠</div>
                    <div className={style.gridtitle}>Une IA qui vous comprend vraiment</div>
                    <div className={style.gridintro}>Plus besoin de deviner les mots-clés. Notre moteur sémantique comprend votre intention, pas seulement vos mots. Trouvez l'outil idéal du premier coup, à chaque fois.</div>
                </div>
                <div className={`${style.grid2} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[4] = el}>
                    <div className={style.icon}>🌍</div>
                    <div className={style.gridtitle}>Qualité vérifiée par la communauté</div>
                    <div className={style.gridintro}>Chaque note, chaque avis est authentique — modéré par une IA et validé par des milliers d'utilisateurs. Pas de fausses étoiles, pas de placement payant.</div>
                </div>
                <div className={`${style.grid3} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[5] = el}>
                    <div className={style.icon}>⚡</div>
                    <div className={style.gridtitle}>Votre espace de travail personnel en IA</div>
                    <div className={style.gridintro}>Sauvegardez vos outils, créez des étagères, consultez à nouveau vos recherches. Penguin évolue avec votre flux de travail : un second cerveau pour votre infrastructure d’IA, toujours à portée de main.</div>
                </div>
            </div>
            <div className={`${style.grid4}  ${style.fromgrid}`} ref={(el) => gridRefs.current[6] = el}>
                <div className={style.grid4title}>Rejoignez <span className={style.gridtitleSpan}>plus de 12 000 constructeurs</span> qui découvrent des solutions plus intelligentes.</div>
                <div className={style.grid4intro}>Free forever. No credit card required.</div>
                <button className={style.btn}><Link to="/signUp"></Link>Commencez la découverte →</button>
            </div>
        </div>
        </div>
        </>
    )
}
export default WhyPenguin