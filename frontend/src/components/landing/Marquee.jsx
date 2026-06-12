import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../style/landing/Marquee.module.css"
import api, { API_BASE } from "../../services/api";

const logoUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const Marquee = () => {
    const marqueeRef = useRef(null);
    const [tools, setTools] = useState([]);

    useEffect(() => {
        let cancelled = false;

        api.get("/tools")
            .then((res) => {
                if (cancelled) return;
                setTools((res.data || []).map((tool) => ({
                    id: tool.id,
                    name: tool.name,
                    logo: logoUrl(tool.logo_url),
                })));
            })
            .catch(() => {
                if (!cancelled) setTools([]);
            });

        return () => {
            cancelled = true;
        };
    }, []);

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

    const renderTool = (tool, key) => (
        <Link key={key} className={style.aiPill} to={`/tool/${encodeURIComponent(tool.name)}`}>
            {tool.logo ? (
                <img className={style.aiLogo} src={tool.logo} alt={tool.name} />
            ) : (
                <span className={style.aiFallback}>{tool.name?.slice(0, 2).toUpperCase() || "AI"}</span>
            )}
            <span>{tool.name}</span>
        </Link>
    );

    return(
        <>
            <div className={`${style.marqueeContainer} ${style.fromMarquee}`} ref={marqueeRef}>
            <div className={style.marqueeTrack}>
                {tools.map((tool, index) => (
                    renderTool(tool, `first-${tool.id || index}`)
                ))}
                {tools.map((tool, index) => (
                    renderTool(tool, `second-${tool.id || index}`)
                ))}
            </div>
        </div>
        </>
    )
}
export default Marquee
