import style from "../../style/landing/CommunityVoices.module.css"
import CommentBox from "../landing/CommentBox"
import { useEffect, useRef, useState } from "react"
import api from "../../services/api"

const initials = (name) => (name || "AI")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AI"

const CommunityVoices = ({scrollRef}) => {
    const commentRefs = useRef([])
    const [comments, setComments] = useState([])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.toComment)
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        const refs = commentRefs.current

        refs.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => {
            refs.forEach((ref) => {
                if (ref) observer.unobserve(ref)
            })
        }
    }, [comments.length])

    useEffect(() => {
        let cancelled = false

        api.get("/reviews/top")
            .then((res) => {
                if (!cancelled) setComments(res.data || [])
            })
            .catch(() => {
                if (!cancelled) setComments([])
            })

        return () => {
            cancelled = true
        }
    }, [])

    return(
        <>
            <div className={style.Community} ref={scrollRef}>
                <div className={style.hero}>Les voix de la communauté</div>
                <div className={style.intro}>Apprécié des constructeurs et des créateurs</div>
                <div className={style.comments}>
                {comments.map((e, index) =>(
                    <div 
                        key={e.id}
                        ref={(el) => commentRefs.current[index] = el}
                    >
                        <CommentBox 
                            logo={initials(e.user_name)}
                            rate={e.rating}
                            fullName={e.user_name}
                            profession={e.profession_name || "Membre Penguin"}
                            icon="✦"
                            AIName={e.tool_name}
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
