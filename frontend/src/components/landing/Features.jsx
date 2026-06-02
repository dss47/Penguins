import style from "../../style/landing/Features.module.css"
import { useEffect, useRef } from "react"

const Features = ({scrollRef}) => {
    const gridRefs = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.togrid)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        gridRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            gridRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
        }
    }, [])

    return(
        <>
            <div ref={scrollRef} className={style.Featuers}>
                <div className={style.FeaturesHero}>Caractéristiques de la plateforme</div>
                <div className={style.Featuresintro}>Tout ce dont vous avez besoin.</div>
                <div className={style.Featuresintro}>Rien de ce que vous ne faites pas.</div>
                <div className={style.desc}>Cinq systèmes fonctionnant ensemble pour que vous découvriez plus intelligemment et construisiez plus rapidement</div>
                <div className={style.gridContainer}>
                    <div className={`${style.grid1} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[0] = el}>
                        <div className={style.icon}>🔍</div>
                        <div className={style.gridtitle}>Recherche sémantique d'IA</div>
                        <div className={style.gridintro}>orget des mots-clés. Décrivez ce dont vous avez besoin, l'IA de Penguin comprend l'intention et renvoie des outils parfaitement adaptés, en enregistrant automatiquement chaque recherche dans votre barre latérale.</div>
                        <div className={style.gridhero}>AI-powered intent engine</div>
                    </div>
                    <div className={`${style.grid2} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[1] = el}>
                        <div className={style.icon}>🛡️</div>
                        <div className={style.gridtitle}>Modération automatique</div>
                        <div className={style.gridintro}>Chaque avis est analysé instantanément. Les contenus toxiques ou indésirables sont signalés discrètement avant d'être diffusés auprès de la communauté.</div>
                        <div className={style.gridhero}>Bouclier communautaire</div>
                    </div>
                    <div className={`${style.grid3} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[2] = el}>
                        <div className={style.icon}>✨</div>
                        <div className={style.gridtitle}>Conservation avec intervention humaine</div>
                        <div className={style.gridintro}>Les utilisateurs proposent des outils, l'IA pré-nettoie les données, les gestionnaires approuvent en un clic. Un catalogue toujours impeccable.</div>
                        <div className={style.gridhero}>curation collaborative</div>
                    </div>
                    <div className={`${style.grid4} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[3] = el}>
                        <div className={style.icon}>❤️</div>
                        <div className={style.gridtitle}>Étagères personnalisées</div>
                        <div className={style.gridintro}>Enregistrez rapidement vos favoris ou créez des étagères personnalisées, comme des listes de lecture pour votre environnement d'IA. « Mes outils audio », « Arsenal de programmation »…</div>
                        <div className={style.gridhero}>moteur de fidélisation des utilisateurs</div>
                    </div>
                    <div className={`${style.grid5} ${style.gridsbox} ${style.fromgrid}`} ref={(el) => gridRefs.current[4] = el}>
                        <div className={style.icon}>🔐</div>
                        <div className={style.gridtitle}>RBAC d'entreprise</div>
                        <div className={style.gridintro}>Invité, Utilisateur, Gestionnaire, Administrateur — autorisations strictes, suppression réversible et périodes de grâce de 30 jours avec nettoyage nocturne.</div>
                        <div className={style.gridhero}>accès basé sur les rôles</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Features