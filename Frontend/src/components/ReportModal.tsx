import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';

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
          className="relative w-full max-w-lg glass-card rounded-[2rem] p-8 shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full" />

          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <TriangleAlert className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">รายงานบทความ</h3>
            </div>

            <p className="text-gray-400 mb-6 px-1">
              โปรดเลือกเหตุผลที่คุณต้องการรายงานบทความนี้ เพื่อให้เราดำเนินการตรวจสอบต่อไป
            </p>

            {/* Reasons List */}
            <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {reasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedReason === reason.value
                      ? 'bg-red-500/10 border-red-500/40 text-white'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
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
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                    selectedReason === reason.value ? 'border-red-500' : 'border-gray-600'
                  }`}>
                    {selectedReason === reason.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all min-h-[100px]"
                />
              </motion.div>
            )}

            <div className="flex w-full gap-4 pt-4 border-t border-white/5">
              <button
                onClick={onCancel}
                className="flex-[0.8] px-6 py-4 rounded-2xl bg-white/5 text-gray-300 font-bold border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-black transform transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-500/30 text-sm uppercase tracking-widest"
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
