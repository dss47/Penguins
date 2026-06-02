import style from "../../style/landing/CommunityVoices.module.css"
import CommentBox from "../landing/CommentBox"
import { useEffect, useRef } from "react"

const CommunityVoices = ({scrollRef}) => {
    const commentRefs = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.toComment)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        commentRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            commentRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
        }
    }, [])

    const testimonials = [
  {
    id: 1,
    logo: "SR",
    rate: "⭐⭐⭐⭐⭐",
    fullName: "Sadia Rahman",
    profession: "Productrice de Podcast",
    country: "Maroc",
    icon: "🎤",
    category: "ElevenLabs",
    comment: "J'ai trouvé un outil de clonage vocal en 8 secondes. J'ai décrit exactement ce dont j'avais besoin, et Penguin a visé juste. Je l'ai sauvegardé dans mon dossier podcast. C'est vraiment impressionnant."
  },
  {
    id: 2,
    logo: "JD",
    rate: "⭐⭐⭐⭐⭐",
    fullName: "James Donovan",
    profession: "Développeur Indépendant",
    country: "Canada",
    icon: "💻",
    category: "GitHub Copilot",
    comment: "La recherche sémantique change la donne. Je cherchais une IA obscure de refactorisation de code et Penguin l'a trouvée instantanément. Les dossiers personnalisés m'aident à organiser."
  },
  {
    id: 3,
    logo: "ML",
    rate: "⭐⭐⭐⭐⭐",
    fullName: "Mei Lin",
    profession: "Designer UI/UX",
    country: "Singapour",
    icon: "🎨",
    category: "Midjourney",
    comment: "Passer au crible des centaines de générateurs d'images IA était épuisant. Les filtres de catégories et les avis vérifiés de la communauté de Penguin m'ont aidé à choisir l'outil parfait pour mon flux de travail."
  }
];
    return(
        <>
            <div className={style.Community} ref={scrollRef}>
                <div className={style.hero}>Les voix de la communauté</div>
                <div className={style.intro}>Apprécié des constructeurs et des créateurs</div>
                <div className={style.comments}>
                {testimonials.map((e, index) =>(
                    <div 
                        key={e.id}
                        ref={(el) => commentRefs.current[index] = el}
                    >
                        <CommentBox 
                            logo={e.logo}
                            rate={e.rate}
                            fullName={e.fullName}
                            profession={e.profession}
                            country={e.country}
                            icon={e.icon}
                            AIName={e.AIName}
                            comment={e.comment}
                        />
                    </div>
                ))}
                </div>
            </div>
        </>
    )
}
export default CommunityVoices