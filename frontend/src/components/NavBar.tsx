import { Link } from 'react-router-dom'
import './NavBar.css'

export default function NavBar(){
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">path IA</Link>
        <div className="links">
          <Link to="/about">About</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="small">Log in</Link>
          <Link to="/signup" className="signup">Sign up</Link>
        </div>
      </div>
    </nav>
  )
}
