import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import styles from '../styles/ReportModal.module.css';

interface ReportModalProps {
  isOpen: boolean;
  onConfirm: (data: { reason_type: string; reason: string }) => void;
  onCancel: () => void;
}

const reasons = [
  { label: 'เนื้อหาไม่เหมาะสม / ลามกอนาจาร', value: 'inappropriate' },
  { label: 'ข้อมูลเท็จ / ให้ข้อมูลที่ผิด', value: 'fake_news' },
  { label: 'การละเมิดลิขสิทธิ์', value: 'copyright' },
  { label: 'สแปม หรือ เนื้อหาโฆษณา', value: 'spam' },
  { label: 'แสดงความเกลียดชัง / คุกคาม', value: 'harassment' },
  { label: 'อื่นๆ', value: 'other' }
];

const ReportModal = ({ isOpen, onConfirm, onCancel }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState(reasons[0].value);
  const [otherReason, setOtherReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const reasonObj = reasons.find(r => r.value === selectedReason);
    const finalReason = selectedReason === 'other' ? otherReason : reasonObj?.label || '';
    
    if (selectedReason === 'other' && !otherReason.trim()) {
      alert('โปรดระบุเหตุผลเพิ่มเติม');
      return;
    }
    
    onConfirm({
      reason_type: selectedReason,
      reason: finalReason
    });
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
          <div className={styles.glowTopRed} />

          {/* Close Button */}
          <button
            onClick={onCancel}
            className={styles.closeButton}
          >
            <X className="w-4 h-4" />
          </button>

          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <div className={styles.iconBoxRed}>
                <TriangleAlert className="w-6 h-6" />
              </div>
              <h3 className={styles.title}>รายงานบทความ</h3>
            </div>

            <p className={styles.description}>
              โปรดเลือกเหตุผลที่คุณต้องการรายงานบทความนี้ เพื่อให้เราดำเนินการตรวจสอบต่อไป
            </p>

            {/* Reasons List */}
            <div className={styles.reasonsList}>
              {reasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`${styles.reasonItem} ${
                    selectedReason === reason.value ? styles.reasonActive : styles.reasonInactive
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="hidden"
                  />
                  <div className={`${styles.radioCircle} ${
                    selectedReason === reason.value ? styles.radioCircleActive : ''
                  }`}>
                    {selectedReason === reason.value && (
                      <div className={styles.radioInner} />
                    )}
                  </div>
                  <span className="font-medium">{reason.label}</span>
                </label>
              ))}
            </div>

            {/* Other Reason Input */}
            {selectedReason === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="โปรดระบุรายละเอียดเพิ่มเติม..."
                  className={styles.textarea}
                />
              </motion.div>
            )}

            <div className={styles.footer}>
              <button
                onClick={onCancel}
                className={styles.cancelButton}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className={styles.submitButton}
              >
                ส่งรายงาน
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;
