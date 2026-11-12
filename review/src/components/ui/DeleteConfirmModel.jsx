import React from "react";
import styles from "./DeleteConfirmModal.module.scss";

export default function DeleteConfirmModal({ open, text, onConfirm, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.headerBar} />
        <div className={styles.header}>
          <div>
            <h3>Confirm Delete</h3>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.header}>
          <p>{text}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            No
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
