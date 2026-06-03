import styles from "../../style/admin/adminUsers.module.css";

/**
 * PromoteConfirmForm — Confirmation de promotion en Manager inline
 * Props:
 *   onConfirm()         — confirme la promotion
 *   onCancel()          — annule
 *   userName: string    — nom affiché dans le message
 */
export default function PromoteConfirmForm({ onConfirm, onCancel, userName }) {
  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmText}>
        Promouvoir <strong>{userName}</strong> au rôle de Manager ?
        <br />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Il pourra gérer les suggestions et modérer le contenu.
        </span>
      </p>
      <div className={styles.confirmActions}>
        <button className={`${styles.btnConfirm} ${styles.btnYesPromote}`} onClick={onConfirm}>
          Oui, promouvoir
        </button>
        <button className={`${styles.btnConfirm} ${styles.btnNo}`} onClick={onCancel}>
          Non, annuler
        </button>
      </div>
    </div>
  );
}