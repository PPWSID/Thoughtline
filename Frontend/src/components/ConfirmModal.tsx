import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import styles from '../styles/ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'info';
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  type = 'info'
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const getIconContainerStyle = () => {
    switch (type) {
      case 'danger': return styles.dangerIconBox;
      case 'success': return styles.successIconBox;
      default: return styles.infoIconBox;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger': return styles.dangerButton;
      default: return styles.brandButton;
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className={styles.backdrop}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={styles.modal}
        >
          {/* Decorative Corner Glow */}
          <div className={styles.glowTop} />
          <div className={styles.glowBottom} />

          {/* Close Button */}
          <button
            onClick={onCancel}
            className={styles.closeButton}
          >
            <X className="w-4 h-4" />
          </button>

          <div className={styles.contentWrapper}>
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className={`${styles.iconBox} ${getIconContainerStyle()}`}
            >
              {type === 'danger' ? (
                <AlertCircle className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              ) : (
                <CheckCircle2 className="w-10 h-10 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
              )}
            </motion.div>

            <h3 className={styles.title}>
              <span className={type === 'danger' ? 'text-white' : 'text-gradient'}>
                {title}
              </span>
            </h3>

            <p className={styles.message}>
              {message}
            </p>

            <div className={styles.buttonGroup}>
              <button
                onClick={onCancel}
                className={styles.cancelButton}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`${styles.confirmButton} ${getConfirmButtonStyle()}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
