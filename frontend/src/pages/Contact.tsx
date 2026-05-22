import './Pages.css'
import { useEffect } from 'react'

export default function Contact(){
    useEffect(()=>{document.title = 'Contact • path IA'}, [])
    return(
        <main className="page-container">
            <h1>Contact</h1>
            <p>If you have questions or feedback, reach out at <a href="mailto:hello@pathia.example">hello@pathia.example</a>.</p>
        </main>
    )
}