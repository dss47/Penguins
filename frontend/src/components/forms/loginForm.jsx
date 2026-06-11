import styles from "../../style/form/forms.module.css";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitch }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isVisiblePass, setIsVisiblePass] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await api.post("/auth/login", { email, password });
			login(res.data);
			const redirect = searchParams.get("redirect");
			navigate(redirect || "/HomeSearch", { replace: true });
		} catch (err) {
			setError(err.message || "Identifiants incorrects");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={`${styles.formContainer} ${styles.signIn}`}>
				<h2>Connexion</h2>
				<p>Connectez-vous et découvrez nos nouveautés</p>
				<form onSubmit={handleSubmit} className={styles.actualForm}>
					<div className={styles.inputGroup}>
						<input
							type="email"
							value={email}
							placeholder="Adresse Email"
							className={styles.input}
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className={styles.inputGroup}>
						<input
							type={isVisiblePass ? "text" : "password"}
							value={password}
							placeholder="Mot de passe"
							className={`${styles.input} ${styles.passwordInput}`}
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="button"
							className={styles.passwordToggle}
							onClick={() => setIsVisiblePass(!isVisiblePass)}
							aria-label={isVisiblePass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
						>
							{isVisiblePass ? <Eye size={20} /> : <EyeOff size={20} />}
						</button>
					</div>

					{error && <p className={styles.error}>{error}</p>}

					<button type="submit" className={styles.submitBtn} disabled={loading}>
						{loading ? "Connexion..." : "Se Connecter"}
					</button>
					<div className={styles.switchContainer}>
						<p>Vous n'avez pas un compte ?</p>
						<button type="button" onClick={onSwitch} className={`${styles.inlineSwitchBtn} ${styles.btnToSignup}`}
						>
							Créez-en un
							<ArrowRight size={22} />
						</button>
					</div>
				</form>
			</div>
	);
}
