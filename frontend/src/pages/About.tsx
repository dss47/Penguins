import { useEffect } from "react";
import "./About.css";

export default function About(){
    useEffect(()=>{window.document.title = 'About • path IA'},[])

    return(
        <main className="about-page">
            <header className="about-hero">
                <div className="about-hero-inner">
                    <h1 className="project-name">path IA</h1>
                    <p className="tagline">A website to find which AI fits you</p>
                    <p className="hero-cta">Answer a few questions and we'll match you with the right AI tools and assistants.</p>
                    <a className="cta-button" href="/">Start the quiz</a>
                </div>
            </header>

            <section className="about-section">
                <h2>What is path IA?</h2>
                <p>path IA helps you discover the best AI systems and workflows for your goals — whether you're automating tasks, building an app, creating content, or learning a new skill. We guide you through a short assessment and explain the ideal AI types for your needs.</p>
            </section>

            <section className="about-section two-column">
                <div>
                    <h3>How it works</h3>
                    <ol>
                        <li>Tell us about your goals and experience.</li>
                        <li>Answer a short set of preference and workflow questions.</li>
                        <li>Get a tailored recommendation and next steps.</li>
                    </ol>
                </div>
                <div>
                    <h3>Who it's for</h3>
                    <ul>
                        <li>Creators looking for content tools</li>
                        <li>Teams automating processes</li>
                        <li>Students and researchers exploring AI</li>
                        <li>Developers prototyping AI-powered apps</li>
                    </ul>
                </div>
            </section>

            <section className="about-section">
                <h3>Our mission</h3>
                <p>We make AI approachable and practical. Instead of overwhelming you with options, path IA narrows the field and gives actionable guidance so you can try the right tools fast.</p>
            </section>

            <section className="about-section small-cta">
                <h3>Ready to find your AI match?</h3>
                <a className="cta-button" href="/">Take the assessment</a>
            </section>

            <footer className="about-footer">
                <p>Made with care — path IA</p>
            </footer>
        </main>
    )
}