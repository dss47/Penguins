import style from "../../style/library/Shelves.module.css"
import Shelf from "./Shelf"

const Shelves = () => {
    const toolStacks = [
        {
            icon: "🎙️",
            title: "Podcast Stack",
            description: "All tools I use for recording, editing, and distributing my weekly podcast.",
            toolCount: "8 tools",
            lastUpdated: "Updated 2 days ago",
            tools: [
                { icon: "🔊", name: "ElevenLabs", description: "Ultra-realistic AI voice synthesis and cloning — produce studio-quality voiceovers from text in seconds.", rating: 4.9, category: "Voice Cloning", accent: "violet" },
                { icon: "✂️", name: "Descript", description: "Edit audio and video by editing the transcript — transcription, overdub, and screen recording in one.", rating: 4.6, category: "Podcasting", accent: "purple" },
                { icon: "🎵", name: "Suno AI", description: "Generate full songs with vocals and instruments from a simple text prompt. Music creation reimagined.", rating: 4.7, category: "Music Gen", accent: "green" }
            ]
        },
        {
            icon: "🎬",
            title: "Video Editing",
            description: "My go-to video production toolkit — from raw footage to final export-ready content.",
            toolCount: "5 tools",
            lastUpdated: "Updated 1 week ago",
            tools: [
                { icon: "🎬", name: "Runway ML", description: "Next-generation AI video editing suite — remove backgrounds, generate clips, and apply cinematic effects.", rating: 4.7, category: "Video Editing", accent: "teal" }
            ]
        },
        {
            icon: "✍️",
            title: "Content Writing",
            description: "AI writing, grammar, SEO, and research tools for crafting high-performing content.",
            toolCount: "11 tools",
            lastUpdated: "Updated 3 days ago",
            tools: [
                { icon: "🧠", name: "Perplexity AI", description: "AI-powered research assistant delivering cited, real-time answers across any subject with depth.", rating: 4.8, category: "Research", accent: "blue" }
            ]
        },
        {
            icon: "💻",
            title: "Web Development",
            description: "Frontend and backend frameworks, IDEs, and deployment services for building web apps.",
            toolCount: "14 tools",
            lastUpdated: "Updated 4 days ago",
            tools: [
                { icon: "🎨", name: "Midjourney", description: "Industry-leading AI image generation with stunning artistic fidelity and stylistic range.", rating: 4.8, category: "Image Gen", accent: "rose" }
            ]
        },
        {
            icon: "🎨",
            title: "Graphic Design",
            description: "Vector illustration, photo editing, and UI/UX design software for creative projects.",
            toolCount: "6 tools",
            lastUpdated: "Updated just now",
            tools: []
        }
    ];

    return (
        <div className={style.shelvesGrid}>
            <div className={`${style.newShelfCard} ${style.cardEnter}`}>
                <div className={style.newShelfIcon}>
                    <svg className={style.plusSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </div>
                <div>
                    <p className={style.newShelfLabel}>Create New Shelf</p>
                    <p className={style.newShelfSub}>Organize tools into a workspace</p>
                </div>
            </div>
            {toolStacks.map((stack, index) => (
                <Shelf
                    key={index}
                    icon={stack.icon}
                    title={stack.title}
                    description={stack.description}
                    toolCount={stack.toolCount}
                    lastUpdated={stack.lastUpdated}
                    shelfIndex={index + 1}
                    shelfData={stack}
                />
            ))}
        </div>
    )
}
export default Shelves
