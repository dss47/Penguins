
import style from "../../style/landing/LandingHome.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from "react"

const LandingHome = ({scrollRef}) => {
    const statsRefs = useRef([])
    const hintsRefs = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.toGrid)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        statsRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        hintsRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            statsRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
            hintsRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
        }
    }, [])
    return(
        <>
        <main ref={scrollRef} className={style.main}>
            <p className={style.hero}><span className={style.bdot}></span>Plateforme de découverte basée sur l'IA</p>
            <p className={style.title}><span className={style.heroTitle1}>Trouvez le bon outil d'IA</span> <span className={style.heroTitle2}>avant de demander deux </span><span className={style.heroTitle2}>fois</span></p>
            <p className={style.introduction}>Penguin est un annuaire intelligent et communautaire. Décrivez ce dont vous avez besoin dans un langage simple - notre moteur d'IA trouve instantanément la solution idéale.</p>
            <div className={style.searchField}>
                <div className={style.submitionField}>
                    <div className={style.icon}><FontAwesomeIcon icon={faMagnifyingGlass} /></div> 
                    <input  className={style.input} type="text" placeholder="e.g."/>
                    <button className={style.searchBtn} >Search</button>
                </div>
                <div className={style.hints}>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[0] = el}>✍️ AI writing</button>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[1] = el}>🎙️ Voice cloning</button>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[2] = el}>🎨 Image gen</button>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[3] = el}>📊 Data analysis</button>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[4] = el}>🎬 Video creation</button>
                    <button className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[5] = el}>💻 Code assistant</button>
                </div>
            </div>
            <div className={style.heroStats}>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[0] = el}>
                    <p className={style.statNum}>3,200</p>
                    <p className={style.statValue}>Outils d'IA catalogués</p>
                </div>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[1] = el}>
                    <p className={style.statNum}>4 8</p>
                    <p className={style.statValue}>Catégories</p>
                </div>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[2] = el}>
                    <p className={style.statNum}>12k+</p>
                    <p className={style.statValue}>Membres de la communauté</p>
                </div>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[3] = el}>
                    <p className={style.statNum}>99.99%</p>
                    <p className={style.statValue}>Temps de disponibilité</p>
                </div>
            </div>
        </main>
        </>
    )
}
export default LandingHome