import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import style from "../../style/library/ShelfItems.module.css"
import Favorite from "./Favorite"

const fallbackShelves = {
    1: {
        icon: "🎙️",
        title: "Podcast Stack",
        description: "All tools I use for recording, editing, and distributing my weekly podcast.",
        tools: [
            { icon: "🔊", name: "ElevenLabs", description: "Ultra-realistic AI voice synthesis and cloning — produce studio-quality voiceovers from text in seconds.", rating: 4.9, category: "Voice Cloning", accent: "violet" },
            { icon: "✂️", name: "Descript", description: "Edit audio and video by editing the transcript — transcription, overdub, and screen recording in one.", rating: 4.6, category: "Podcasting", accent: "purple" },
            { icon: "🎵", name: "Suno AI", description: "Generate full songs with vocals and instruments from a simple text prompt. Music creation reimagined.", rating: 4.7, category: "Music Gen", accent: "green" }
        ]
    },
    2: {
        icon: "🎬",
        title: "Video Editing",
        description: "My go-to video production toolkit — from raw footage to final export-ready content.",
        tools: [
            { icon: "🎬", name: "Runway ML", description: "Next-generation AI video editing suite — remove backgrounds, generate clips, and apply cinematic effects.", rating: 4.7, category: "Video Editing", accent: "teal" }
        ]
    },
    3: {
        icon: "✍️",
        title: "Content Writing",
        description: "AI writing, grammar, SEO, and research tools for crafting high-performing content.",
        tools: [
            { icon: "🧠", name: "Perplexity AI", description: "AI-powered research assistant delivering cited, real-time answers across any subject with depth.", rating: 4.8, category: "Research", accent: "blue" }
        ]
    },
    4: {
        icon: "💻",
        title: "Web Development",
        description: "Frontend and backend frameworks, IDEs, and deployment services for building web apps.",
        tools: [
            { icon: "🎨", name: "Midjourney", description: "Industry-leading AI image generation with stunning artistic fidelity and stylistic range.", rating: 4.8, category: "Image Gen", accent: "rose" }
        ]
    },
    5: {
        icon: "🎨",
        title: "Graphic Design",
        description: "Vector illustration, photo editing, and UI/UX design software for creative projects.",
        tools: []
    }
};

const ShelfItems = () => {
    const { shelfIndex } = useParams();
    const location = useLocation();
    const shelfFromState = location.state?.shelf;

    const shelf = shelfFromState || fallbackShelves[shelfIndex] || fallbackShelves[1];

    const [tools, setTools] = useState(shelf.tools || []);

    const handleRemove = (indexToRemove) => {
        setTools(tools.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className={style.pageWrapper}>
            <div className={style.pageContainer}>
                <div className={style.shelfHeader}>
                    <Link to="/Library" className={style.backBtn}>
                        ← Back to Library
                    </Link>
                    <div className={style.shelfInfo}>
                        <div className={style.shelfIconLarge}>{shelf.icon}</div>
                        <div>
                            <h1 className={style.shelfTitle}>{shelf.title}</h1>
                            <p className={style.shelfDesc}>{shelf.description}</p>
                        </div>
                    </div>
                    <div className={style.toolCount}>
                        {tools.length} tool{tools.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {tools.length > 0 ? (
                    <div className={style.toolsGrid}>
                        {tools.map((tool, index) => (
                            <Favorite
                                key={index}
                                icon={tool.icon}
                                name={tool.name}
                                description={tool.description}
                                rating={tool.rating}
                                category={tool.category}
                                accent={tool.accent}
                                removeButton
                                onRemove={() => handleRemove(index)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={style.emptyState}>
                        <p className={style.emptyIcon}>📭</p>
                        <p className={style.emptyText}>This shelf is empty.</p>
                        <p className={style.emptySub}>Add tools from your favorites to get started.</p>
                        <Link to="/Library" className={style.emptyBack}>Back to Library</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShelfItems
