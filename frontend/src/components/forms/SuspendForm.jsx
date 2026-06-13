import { useState } from "react";
import styles from "../../style/admin/adminUsers.module.css";

const DURATIONS = [
  { value: "24h", label: "24 heures" },
  { value: "7d",  label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "1y",  label: "1 an" },
  { value: "forever", label: "Définitivement" },
];

export default function SuspendForm({ onConfirm, onCancel, userName }) {
  const [duration, setDuration] = useState("forever");

  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmText}>
        Suspendre <strong>{userName}</strong> ?
      </p>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>
          Durée de la suspension
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            width: "100%", padding: "8px 10px", background: "var(--bg-card)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", outline: "none",
          }}
        >
          {DURATIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.confirmActions}>
        <button className={`${styles.btnConfirm} ${styles.btnYes}`} onClick={() => onConfirm(duration)}>
          Oui, suspendre
        </button>
        <button className={`${styles.btnConfirm} ${styles.btnNo}`} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}
