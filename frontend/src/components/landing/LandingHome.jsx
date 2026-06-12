
import style from "../../style/landing/LandingHome.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const formatCount = (value) => new Intl.NumberFormat("fr-FR").format(Number(value) || 0);

const LandingHome = ({scrollRef}) => {
    const navigate = useNavigate()
    const statsRefs = useRef([])
    const hintsRefs = useRef([])
    const [prompt, setPrompt] = useState("")
    const [landingData, setLandingData] = useState({
        tool_count: 0,
        category_count: 0,
        community_members: 0,
        categories: [],
    })

    useEffect(() => {
        let cancelled = false

        api.get("/landing/summary")
            .then((res) => {
                if (!cancelled) setLandingData(res.data || {})
            })
            .catch(() => {
                if (!cancelled) {
                    setLandingData({ tool_count: 0, category_count: 0, community_members: 0, categories: [] })
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.toGrid)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        const stats = statsRefs.current
        const hints = hintsRefs.current

        stats.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        hints.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            stats.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
            hints.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
        }
    }, [landingData.categories?.length])

    const handleSearch = () => {
        const value = prompt.trim()
        if (!value) return
        navigate(`/HomeSearch?q=${encodeURIComponent(value)}`)
    }

    return(
        <>
        <main ref={scrollRef} className={style.main}>
            <p className={style.hero}><span className={style.bdot}></span>Plateforme de découverte basée sur l'IA</p>
            <p className={style.title}><span className={style.heroTitle1}>Trouvez le bon outil d'IA</span> <span className={style.heroTitle2}>avant de demander deux </span><span className={style.heroTitle2}>fois</span></p>
            <p className={style.introduction}>Penguin est un annuaire intelligent et communautaire. Décrivez ce dont vous avez besoin dans un langage simple - notre moteur d'IA trouve instantanément la solution idéale.</p>
            <div className={style.searchField}>
                <div className={style.submitionField}>
                    <div className={style.icon}><FontAwesomeIcon icon={faMagnifyingGlass} /></div> 
                    <input
                        className={style.input}
                        type="text"
                        placeholder="e.g. résumer des PDF pour mes cours"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className={style.searchBtn} onClick={handleSearch}>Search</button>
                </div>
                <div className={style.hints}>
                    {(landingData.categories || []).map((category, index) => (
                        <button key={category.id} className={`${style.hint} ${style.fromgrid}`} ref={(el) => hintsRefs.current[index] = el}>
                            {category.icon || "✦"} {category.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className={style.heroStats}>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[0] = el}>
                    <p className={style.statNum}>{formatCount(landingData.tool_count)}</p>
                    <p className={style.statValue}>Outils d'IA catalogués</p>
                </div>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[1] = el}>
                    <p className={style.statNum}>{formatCount(landingData.category_count)}</p>
                    <p className={style.statValue}>Catégories</p>
                </div>
                <div className={`${style.infos} ${style.fromgrid}`} ref={(el) => statsRefs.current[2] = el}>
                    <p className={style.statNum}>{formatCount(landingData.community_members)}</p>
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
