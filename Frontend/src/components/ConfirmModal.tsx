import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

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

  const colors = {
    danger: 'text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/10',
    success: 'text-brand-aqua bg-brand-light/10 border-brand-light/20 shadow-brand-light/10',
    info: 'text-brand-light bg-brand-light/10 border-brand-light/20 shadow-brand-light/10'
  };

  const btnColors = {
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30',
    success: 'bg-brand-light text-dark-bg hover:bg-brand-aqua shadow-brand-light/30',
    info: 'bg-brand-light text-dark-bg hover:bg-brand-aqua shadow-brand-light/30'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-card rounded-[2rem] p-10 shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-light/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-light/5 blur-[80px] rounded-full" />

          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className={`p-5 rounded-2xl border mb-8 shadow-inner ${colors[type]} backdrop-blur-xl`}
            >
              {type === 'danger' ? (
                <AlertCircle className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              ) : (
                <CheckCircle2 className="w-10 h-10 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
              )}
            </motion.div>

            <h3 className="text-3xl font-bold mb-4">
              <span className={type === 'danger' ? 'text-white' : 'text-gradient'}>
                {title}
              </span>
            </h3>

            <p className="text-gray-400 mb-10 leading-relaxed text-lg px-2">
              {message}
            </p>

            <div className="flex w-full gap-4">
              <button
                onClick={onCancel}
                className="flex-[0.8] px-6 py-4 rounded-2xl bg-white/5 text-gray-300 font-bold border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-6 py-4 rounded-2xl font-black transform transition-all hover:scale-[1.02] active:scale-95 shadow-xl text-sm uppercase tracking-widest ${btnColors[type]}`}
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
