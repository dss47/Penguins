import styles from "../../style/form/forms.module.css";
import { ArrowLeft, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

const PROFESSION_OPTIONS = [
	{ value: 1, label: "Développeur" },
	{ value: 2, label: "Designer" },
	{ value: 3, label: "Enseignant" },
	{ value: 4, label: "Étudiant" },
	{ value: 5, label: "Marketing" },
	{ value: 6, label: "Chef de projet" },
	{ value: 7, label: "Data Scientist" },
	{ value: 8, label: "Freelance" },
	{ value: 9, label: "Autre" },
];

export default function SignupForm({ onSwitch }) {
	const [isVisiblePass, setIsVisiblePass] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [selectedProfession, setSelectedProfession] = useState(null);
	const [isProfessionOpen, setIsProfessionOpen] = useState(false);
	const professionRef = useRef(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (professionRef.current && !professionRef.current.contains(event.target)) {
				setIsProfessionOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas !");
			return;
		}

		setLoading(true);
		try {
			await api.post("/auth/register", {
				firstName,
				lastName,
				email,
				password,
				profession_id: selectedProfession ? selectedProfession.value : null,
			});
			alert("Inscription réussie ! Connectez-vous.");
			onSwitch();
		} catch (err) {
			setError(err.message || "Erreur lors de l'inscription");
		} finally {
			setLoading(false);
		}
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
						<div className={styles.customDropdown} ref={professionRef}>
							<div
								className={styles.dropdownHeader}
								onClick={() => setIsProfessionOpen(!isProfessionOpen)}
							>
								<span>{selectedProfession ? selectedProfession.label : "Profession"}</span>
								<ChevronDown
									size={18}
									className={`${styles.chevron} ${isProfessionOpen ? styles.chevronOpen : ""}`}
								/>
							</div>
							{isProfessionOpen && (
								<div className={styles.dropdownMenu}>
									{PROFESSION_OPTIONS.map((p) => (
										<div
											key={p.value}
											className={`${styles.dropdownItem} ${selectedProfession?.value === p.value ? styles.dropdownItemActive : ""}`}
											onClick={() => {
												setSelectedProfession(p);
												setIsProfessionOpen(false);
											}}
										>
											{p.label}
										</div>
									))}
								</div>
							)}
						</div>
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

					{error && <p className={styles.error}>{error}</p>}

					<button type="submit" className={styles.submitBtn} disabled={loading}>
						{loading ? "Inscription..." : "S'inscrire"}
					</button>
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
