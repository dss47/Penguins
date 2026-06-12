import styles from "../../style/admin/adminUsers.module.css";

/**
 * UnbanConfirmForm — Confirmation de débannissement inline
 * Props:
 *   onConfirm()         — confirme le débannissement
 *   onCancel()          — annule
 *   userName: string    — nom affiché dans le message
 */
export default function UnbanConfirmForm({ onConfirm, onCancel, userName }) {
  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmText}>
        Débannir <strong>{userName}</strong> ?
        <br />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          L'utilisateur retrouvera l'accès à son compte.
        </span>
      </p>
      <div className={styles.confirmActions}>
        <button className={`${styles.btnConfirm} ${styles.btnYesPromote}`} style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }} onClick={onConfirm}>
          Oui, débannir
        </button>
        <button className={`${styles.btnConfirm} ${styles.btnNo}`} onClick={onCancel}>
          Non, annuler
        </button>
      </div>
    </div>
  );
}
