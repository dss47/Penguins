import './Pages.css'
import { useEffect } from 'react'

export default function Home(){
    useEffect(()=>{document.title = 'path IA — Home'}, [])
    return(
        <main className="page-container">
            <h1>Welcome to path IA</h1>
            <p className="lead">Find which AI fits you — quick, practical recommendations.</p>
            <p>Get started by visiting the <a href="/tools">Tools</a> page or learn more <a href="/about">About</a> path IA.</p>
        </main>
    )
}