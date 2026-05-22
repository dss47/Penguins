import './Pages.css'
import { useEffect } from 'react'

export default function Tools(){
    useEffect(()=>{document.title = 'Tools • path IA'}, [])
    return(
        <main className="page-container">
            <h1>AI Tools & Matches</h1>
            <p className="lead">Browse categories and find the AI types that suit your goals.</p>
            <section>
                <h3>Categories</h3>
                <ul>
                    <li>Content & Creativity</li>
                    <li>Automation & Agents</li>
                    <li>Research & Data</li>
                    <li>Developer Tools & APIs</li>
                </ul>
            </section>
        </main>
    )
}
