import styles from "../../style/admin/adminUsers.module.css";

/**
 * DemoteConfirmForm — Confirmation de rétrogradation en Utilisateur inline
 * Props:
 *   onConfirm()         — confirme la rétrogradation
 *   onCancel()          — annule
 *   userName: string    — nom affiché dans le message
 */
export default function DemoteConfirmForm({ onConfirm, onCancel, userName }) {
  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmText}>
        Rétrograder <strong>{userName}</strong> au rôle d'Utilisateur ?
        <br />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Il perdra ses droits de modération.
        </span>
      </p>
      <div className={styles.confirmActions}>
        <button className={`${styles.btnConfirm} ${styles.btnYesPromote}`} style={{ backgroundColor: "var(--warning)", borderColor: "var(--warning)" }} onClick={onConfirm}>
          Oui, rétrograder
        </button>
        <button className={`${styles.btnConfirm} ${styles.btnNo}`} onClick={onCancel}>
          Non, annuler
        </button>
      </div>
    </div>
  );
}
