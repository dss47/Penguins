import { useEffect, useRef } from "react";
import style from "../../style/landing/Marquee.module.css"

const Marquee = () => {
    const marqueeRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(style.toMarquee);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (marqueeRef.current) {
            observer.observe(marqueeRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);
    const tools = [
        { name: "Runway ML", icon: "📹" },
        { name: "Claude", icon: "🤖" },
        { name: "Julius AI", icon: "📊" },
        { name: "Suno AI", icon: "🎵" },
        { name: "Perplexity", icon: "🔍" },
        { name: "GitHub Copilot", icon: "💻" },
        { name: "DALL·E 3", icon: "🎨" },
        { name: "Notion AI", icon: "🧠" },
        { name: "Otter.ai", icon: "📝" },
        { name: "Pika Labs", icon: "🎬" },
        { name: "Gemini", icon: "✨" },
        { name: "ElevenLabs", icon: "🎙️" },
        { name: "Midjourney", icon: "🖌️" },
    ];
    return(
        <>
            <div className={`${style.marqueeContainer} ${style.fromMarquee}`} ref={marqueeRef}>
            <div className={style.marqueeTrack}>
                {tools.map((tool, index) => (
                    <div key={`first-${index}`} className={style.aiPill}>
                        <span>{tool.icon}</span>
                        <span>{tool.name}</span>
                    </div>
                ))}
                {tools.map((tool, index) => (
                    <div key={`second-${index}`} className={style.aiPill}>
                        <span>{tool.icon}</span>
                        <span>{tool.name}</span>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
export default Marquee