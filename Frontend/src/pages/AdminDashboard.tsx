import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, Trash2, Eye, CheckCircle, Search, Filter, ChevronDown, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../service/articleservice';
import ConfirmModal from '../components/ConfirmModal';
import styles from '../styles/AdminDashboard.module.css';

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.titleArea}
            >
              <div className={styles.adminBadge}>
                <TriangleAlert className="w-8 h-8" />
                <span className={styles.adminBadgeText}>Admin Control Panel</span>
              </div>
              <h1 className={styles.title}>
                การจัดการ <span className="text-gradient">รายงาน</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.filterRow}
            >
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="ค้นหารายงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterWrapper}>
                <Filter className={styles.filterIcon} />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">ทุกประเภท</option>
                  {Object.entries(reasonTypeLabels).map(([val, label]: any) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <ChevronDown className={styles.chevronDown} />
              </div>
            </motion.div>
          </div>
        </header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>กำลังโหลดข้อมูลรายงาน...</p>
          </div>
        ) : (
          <div className={styles.reportGrid}>
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
                    className={styles.reportCard}
                  >
                    <div className={styles.reportContentRow}>
                      <div className={styles.thumbnailWrapper}>
                        {report.articleImage ? (
                          <img src={report.articleImage} alt="" className={styles.thumbnail} />
                        ) : (
                          <div className={styles.thumbnailPlaceholder}>
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className={styles.reportInfo}>
                        <div>
                          <div className={styles.metaRow}>
                            <span className={`${styles.reasonBadge} ${
                              report.reason_type === 'other' ? styles.reasonOther : styles.reasonWarning
                            }`}>
                              {reasonTypeLabels[report.reason_type] || report.reason_type}
                            </span>
                            <span className={styles.dateText}>
                              {new Date(report.createdAt).toLocaleString('th-TH')}
                            </span>
                          </div>
                          <h3 className={styles.articleTitle}>
                            {report.articleTitle}
                          </h3>
                          <p className={styles.reasonText}>
                            " {report.reason} "
                          </p>
                        </div>
                      </div>

                      <div className={styles.actionArea}>
                        <Link 
                          to={`/article/${report.articleId}`}
                          className={styles.viewBtn}
                        >
                          <Eye className="w-4 h-4" />
                          <span>ดูต้นฉบับ</span>
                        </Link>
                        
                        <button 
                          onClick={() => handleDismissReport(report)}
                          className={styles.dismissBtn}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>ยกเลิกรายงาน</span>
                        </button>

                        <button 
                          onClick={() => handleDeleteArticle(report)}
                          className={styles.deleteBtn}
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
                  className={styles.emptyState}
                >
                  <div className={styles.emptyIconWrapper}>
                    <CheckCircle className={styles.emptyIcon} />
                  </div>
                  <h3 className={styles.emptyTitle}>ไม่มีรายงานที่ต้องจัดการ</h3>
                  <p className={styles.emptyDesc}>บทความทั้งหมดในระบบตอนนี้ดูปกติดี!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteArticleConfirm}
        title="ลบบทความที่ถูกรายงาน?"
        message={`คุณต้องการลบบทความ "${selectedReport?.articleTitle}" ใช่หรือไม่? เมื่อลบแล้วบทความจะหายไปจากระบบทันที`}
        type="danger"
        confirmText="ยืนยันการลบถาวร"
        onConfirm={onConfirmDeleteArticle}
        onCancel={() => setShowDeleteArticleConfirm(false)}
      />

      <ConfirmModal
        isOpen={showDismissReportConfirm}
        title="ยกเลิกการรายงาน?"
        message={`คุณพิจารณาแล้วว่าบทความนี้ปกติ และต้องการลบรายงานทิ้งใช่หรือไม่?`}
        type="info"
        confirmText="ยืนยันการยกเลิก"
        onConfirm={onConfirmDismissReport}
        onCancel={() => setShowDismissReportConfirm(false)}
      />

      <ConfirmModal
        isOpen={showSuccessModal}
        title="ดำเนินการสำเร็จ"
        message={successMessage}
        type="success"
        confirmText="ปิด"
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;
