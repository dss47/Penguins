import { useState } from "react";
import styles from "../../style/admin/adminSuggestions.module.css";

/**
 * RejectForm — Formulaire de rejet d'une suggestion
 * Props:
 *   onConfirm(reason: string) — appelé avec le motif saisi
 *   onCancel()                — annule et ferme le formulaire
 */
export default function RejectForm({ onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) onConfirm(reason.trim());
  };

  return (
    <div className={styles.rejectForm}>
      <label className={styles.rejectLabel}>Motif du rejet</label>
      <textarea
        className={styles.rejectTextarea}
        placeholder="Expliquer pourquoi cette suggestion est rejetée..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
      />
      <div className={styles.rejectActions}>
        <button
          className={styles.btnConfirmReject}
          onClick={handleConfirm}
          disabled={!reason.trim()}
        >
          Confirmer le rejet
        </button>
        <button className={styles.btnCancelReject} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}