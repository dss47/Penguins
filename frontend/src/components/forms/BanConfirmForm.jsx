import styles from "../../style/admin/adminUsers.module.css";

/**
 * BanConfirmForm — Confirmation de bannissement inline
 * Props:
 *   onConfirm()         — confirme le bannissement
 *   onCancel()          — annule
 *   userName: string    — nom affiché dans le message
 */
export default function BanConfirmForm({ onConfirm, onCancel, userName }) {
  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmText}>
        Confirmer le bannissement de{" "}
        <strong>{userName}</strong> ?
        <br />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          L'utilisateur ne pourra plus accéder à la plateforme.
        </span>
      </p>
      <div className={styles.confirmActions}>
        <button className={`${styles.btnConfirm} ${styles.btnYes}`} onClick={onConfirm}>
          Oui, bannir
        </button>
        <button className={`${styles.btnConfirm} ${styles.btnNo}`} onClick={onCancel}>
          Non, annuler
        </button>
      </div>
    </div>
  );
}