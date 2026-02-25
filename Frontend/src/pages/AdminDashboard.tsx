import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, Trash2, Eye, CheckCircle, Search, Filter, ChevronDown, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../service/articleservice';
import ConfirmModal from '../components/ConfirmModal';

interface ReportedArticle {
  id: string;
  articleId: string;
  articleTitle: string;
  articleImage: string;
  reason_type: string;
  reason: string;
  createdAt: string;
  reported_by: string;
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<ReportedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Modal states
  const [showDeleteArticleConfirm, setShowDeleteArticleConfirm] = useState(false);
  const [showDismissReportConfirm, setShowDismissReportConfirm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedArticle | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response: any = await apiService.getReportedArticles();
      if (response.status === 200) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteArticle = (report: ReportedArticle) => {
    setSelectedReport(report);
    setShowDeleteArticleConfirm(true);
  };

  const handleDismissReport = (report: ReportedArticle) => {
    setSelectedReport(report);
    setShowDismissReportConfirm(true);
  };

  const onConfirmDeleteArticle = async () => {
    if (!selectedReport) return;
    setShowDeleteArticleConfirm(false);
    try {
      const response: any = await apiService.deleteArticle(selectedReport.articleId);
      if (response.status === 200) {
        setSuccessMessage('ลบบทความเรียบร้อยแล้ว');
        setShowSuccessModal(true);
        fetchReports(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    }
  };

  const onConfirmDismissReport = async () => {
    if (!selectedReport) return;
    setShowDismissReportConfirm(false);
    try {
      const response: any = await apiService.deleteReport(selectedReport.id);
      if (response.status === 200) {
        setSuccessMessage('ยกเลิกการรายงานเรียบร้อยแล้ว');
        setShowSuccessModal(true);
        fetchReports(); // Refresh the list
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('เกิดข้อผิดพลาดในการยกเลิกรายงาน');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.reason_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const reasonTypeLabels: any = {
    'inappropriate': 'ไม่เหมาะสม',
    'fake_news': 'ข่าวปลอม',
    'copyright': 'ลิขสิทธิ์',
    'spam': 'สแปม',
    'harassment': 'คุกคาม',
    'other': 'อื่นๆ'
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 text-red-500 mb-4">
                <TriangleAlert className="w-8 h-8" />
                <span className="text-sm font-bold uppercase tracking-widest">Admin Control Panel</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                การจัดการ <span className="text-gradient">รายงาน</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
            >
              <div className="relative group flex-grow md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                <input 
                  type="text" 
                  placeholder="ค้นหารายงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-card/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-light/30 focus:bg-dark-card transition-all"
                />
              </div>

              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none w-full bg-dark-card/50 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-brand-light/30 transition-all cursor-pointer"
                >
                  <option value="all">ทุกประเภท</option>
                  {Object.entries(reasonTypeLabels).map(([val, label]: any) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-brand-light/10 border-t-brand-light rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลรายงาน...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-3xl p-6 border border-white/5 group hover:border-white/10 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Thumbnail */}
                      <div className="w-full lg:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-dark-bg">
                        {report.articleImage ? (
                          <img src={report.articleImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                              report.reason_type === 'other' ? 'text-gray-400 border-white/10 bg-white/5' : 'text-red-400 border-red-500/20 bg-red-500/10'
                            }`}>
                              {reasonTypeLabels[report.reason_type] || report.reason_type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(report.createdAt).toLocaleString('th-TH')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-light transition-colors">
                            {report.articleTitle}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 italic">
                            " {report.reason} "
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col items-center justify-end gap-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                        <Link 
                          to={`/article/${report.articleId}`}
                          className="flex items-center space-x-2 bg-white/5 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
                        >
                          <Eye className="w-4 h-4" />
                          <span>ดูต้นฉบับ</span>
                        </Link>
                        
                        <button 
                          onClick={() => handleDismissReport(report)}
                          className="flex items-center space-x-2 bg-brand-light/5 text-brand-light border border-brand-light/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-light hover:text-dark-bg transition-all active:scale-95 shadow-lg shadow-brand-light/0 hover:shadow-brand-light/20"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>ยกเลิกรายงาน</span>
                        </button>

                        <button 
                          onClick={() => handleDeleteArticle(report)}
                          className="flex items-center space-x-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>ลบบทความ</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-40 bg-dark-card/20 rounded-[3rem] border border-white/5 border-dashed"
                >
                  <div className="p-6 rounded-full bg-white/5 mb-6">
                    <CheckCircle className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">ไม่มีรายงานที่ต้องจัดการ</h3>
                  <p className="text-gray-500">บทความทั้งหมดในระบบตอนนี้ดูปกติดี!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Article Modal */}
      <ConfirmModal
        isOpen={showDeleteArticleConfirm}
        title="ลบบทความที่ถูกรายงาน?"
        message={`คุณต้องการลบบทความ "${selectedReport?.articleTitle}" ใช่หรือไม่? เมื่อลบแล้วบทความจะหายไปจากระบบทันที`}
        type="danger"
        confirmText="ยืนยันการลบถาวร"
        onConfirm={onConfirmDeleteArticle}
        onCancel={() => setShowDeleteArticleConfirm(false)}
      />

      {/* Dismiss Report Modal */}
      <ConfirmModal
        isOpen={showDismissReportConfirm}
        title="ยกเลิกการรายงาน?"
        message={`คุณพิจารณาแล้วว่าบทความนี้ปกติ และต้องการลบรายงานทิ้งใช่หรือไม่?`}
        type="info"
        confirmText="ยืนยันการยกเลิก"
        onConfirm={onConfirmDismissReport}
        onCancel={() => setShowDismissReportConfirm(false)}
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        title="ดำเนินการสำเร็จ"
        message={successMessage}
        type="success"
        confirmText="ปิด"
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
      />
      
      {/* Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
