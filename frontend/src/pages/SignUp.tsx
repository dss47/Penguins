import './Pages.css'
import { useEffect } from 'react'

export default function SignUp(){
    useEffect(()=>{document.title = 'Sign up • path IA'}, [])
    return(
        <main className="page-container">
            <h1>Sign up</h1>
            <p>Create an account to save your matches and preferences.</p>
        </main>
    )
}