import { Link, useLocation } from "react-router-dom";
import styles from "../style/LoginPrompt.module.css";

export default function LoginPrompt() {
    const location = useLocation();
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2>Connectez-vous</h2>
                <p>Vous devez être connecté pour accéder à cette page.</p>
                <Link to={`/Auth?redirect=${encodeURIComponent(location.pathname)}`} className={styles.loginBtn}>
                    Se connecter
                </Link>
            </div>
        </div>
    );
}
