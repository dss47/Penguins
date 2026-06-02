import styles from "../../style/form/forms.module.css";
import { ArrowLeft, Eye, EyeOff, Calendar } from "lucide-react";
import { useState } from "react";

export default function SignupForm({ onSwitch }) {
	const [isVisiblePass, setIsVisiblePass] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [dob, setDob] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [dateInputType, setDateInputType] = useState("text");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Les mots de passe ne correspondent pas !");
			return;
		}

		console.log("Inscription soumise :", { firstName, lastName, email, dob, password });
	};

	return (
		<div className={`${styles.formContainer} ${styles.signUp}`}>
				<h2>Inscription</h2>
				<p>Créer Votre Compte Gratuitement!</p>
				<form onSubmit={handleSubmit} className={styles.actualForm}>

					<div className={styles.rowGroup}>
						<div className={styles.inputGroup}>
							<input
								type="text"
								value={firstName}
								className={styles.input}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="Prénom"
								required
							/>
						</div>
						<div className={styles.inputGroup}>
							<input
								type="text"
								value={lastName}
								className={styles.input}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Nom"
								required
							/>
						</div>
					</div>


					<div className={styles.inputGroup}>
						<input
							type={dateInputType}
							value={dob}
							className={`${styles.input} ${styles.dateInput}`}
							onFocus={() => setDateInputType("date")}
							onBlur={() => !dob && setDateInputType("text")}
							onChange={(e) => setDob(e.target.value)}
							placeholder="Date de Naissance"
							required
						/>
						<Calendar size={20} className={styles.dateIcon} />
					</div>
					<div className={styles.inputGroup}>
						<input type="email" value={email} className={styles.input} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse E-mail" required />
					</div>


					<div className={styles.rowGroup}>
						<div className={styles.inputGroup}>
							<input
								type={isVisiblePass ? "text" : "password"}
								value={password}
								className={`${styles.input} ${styles.passwordInput}`}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Mot de Passe"
								required
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
						<div className={styles.inputGroup}>
							<input
								type={isVisiblePass ? "text" : "password"}
								value={confirmPassword}
								className={styles.input}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirmer Mot de Passe"
								required
							/>
						</div>
					</div>

					<button type="submit" className={styles.submitBtn}>S'inscrire</button>
					<div className={styles.switchContainer}>
						<p>Vous avez déjà un compte ?</p>
						<button type="button" onClick={onSwitch} className={`${styles.inlineSwitchBtn} ${styles.btnToLogin}`}>
							<ArrowLeft size={18} />
							Connectez-vous
						</button>
					</div>
				</form>
			</div>
	);
}