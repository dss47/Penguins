import style from "../../style/library/Favorites.module.css"
import Favorite from "./Favorite"

const Favorites = () => {
    const aiTools = [
        {
            icon: "🔊",
            name: "ElevenLabs",
            description: "Ultra-realistic AI voice synthesis and cloning — produce studio-quality voiceovers from text in seconds.",
            rating: 4.9,
            category: "Voice Cloning",
            accent: "violet"
        },
        {
            icon: "🎨",
            name: "Midjourney",
            description: "Industry-leading AI image generation with stunning artistic fidelity and stylistic range.",
            rating: 4.8,
            category: "Image Gen",
            accent: "rose"
        },
        {
            icon: "🎬",
            name: "Runway ML",
            description: "Next-generation AI video editing suite — remove backgrounds, generate clips, and apply cinematic effects.",
            rating: 4.7,
            category: "Video Editing",
            accent: "teal"
        },
        {
            icon: "🧠",
            name: "Perplexity AI",
            description: "AI-powered research assistant delivering cited, real-time answers across any subject with depth.",
            rating: 4.8,
            category: "Research",
            accent: "blue"
        },
        {
            icon: "✂️",
            name: "Descript",
            description: "Edit audio and video by editing the transcript — transcription, overdub, and screen recording in one.",
            rating: 4.6,
            category: "Podcasting",
            accent: "purple"
        },
        {
            icon: "🎵",
            name: "Suno AI",
            description: "Generate full songs with vocals and instruments from a simple text prompt. Music creation reimagined.",
            rating: 4.7,
            category: "Music Gen",
            accent: "green"
        }
    ];

    return (
        <div className={style.toolsGrid}>
            {aiTools.map((tool, index) => (
                <Favorite
                    key={index}
                    icon={tool.icon}
                    name={tool.name}
                    description={tool.description}
                    rating={tool.rating}
                    category={tool.category}
                    accent={tool.accent}
                />
            ))}
        </div>
    )
}
export default Favorites
