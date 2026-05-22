import './Pages.css'
import { useEffect } from 'react'

export default function LogIn(){
    useEffect(()=>{document.title = 'Log in • path IA'}, [])
    return(
        <main className="page-container">
            <h1>Log in</h1>
            <p>Placeholder login form — integrate auth as needed.</p>
        </main>
    )
}