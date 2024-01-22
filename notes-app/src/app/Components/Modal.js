
import React from 'react';
import styles from './modal.module.css';

const CustomModal = ({ isOpen, onRequestClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onRequestClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
        <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onRequestClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
