import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, Calendar, Clock, Share2, Edit, Heart, Trash , TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import apiService from '../service/articleservice';
import favoriteservice from '../service/favoriteservice';
import ConfirmModal from '../components/ConfirmModal';
import ReportModal from '../components/ReportModal';
import { useState, useEffect } from 'react';
import { Article } from '../types/article';
import styles from '../styles/ArticleDetail.module.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiService.getArticleById(id as string);
        if (response.status === 200) {
          const result = response.data;
          const item = result.data;
          setArticle({
            ...item,
            id: item._id,
            publishedAt: new Date(item.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'long', day: 'numeric'
            }),
            readTime: item.readTime || '5 นาที'
          });
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !id) return;
    try {
      const response: any = await favoriteservice.toggleFavorite(id);
      if (response.status === 200) {
        setIsFavorite(response.data.data.action === 'added');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleReport = () => {
    setShowReportConfirm(true);
  };

  const onConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const response: any = await apiService.deleteArticle(id as string);
      if (response.status === 200) {
        setSuccessMessage('ลบบทความของคุณเรียบร้อยแล้ว ระบบกำลังพากลับหน้าแรก...');
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    }
  };

  const onConfirmReport = async (data: { reason_type: string; reason: string }) => {
    setShowReportConfirm(false);
    try {
      const response: any = await apiService.reportArticle(id as string, data);
      if (response.status === 200) {
        setSuccessMessage('ส่งรายงานของคุณเรียบร้อยแล้ว ขอบคุณที่ช่วยตรวจสอบความเรียบร้อย');
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Report Error:', error);
      alert('เกิดข้อผิดพลาดในการส่งรายงาน');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>ไม่พบบทความที่คุณต้องการ</h1>
        <Link to="/" className={styles.backLink}>
          กลับไปหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.backButtonWrapper}
        >
          <Link 
            to="/" 
            className={styles.backButton}
          >
            <ChevronLeft className={styles.backIcon} />
            กลับไปที่หน้าบทความ
          </Link>
        </motion.div>

        <article>
          {/* Header */}
          <header className={styles.header}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.categoryBadge}>
                <span>{article.category}</span>
              </div>
              
              <h1 className={styles.title}>
                {article.title}
              </h1>

              <div className={styles.metaRow}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorAvatar}>
                    {article.author.charAt(0)}
                  </div>
                  <span className={styles.authorName}>{article.author}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishedAt}</span>
                </div>

                <div className={styles.metaItem}>
                  <Clock className="w-4 h-4" />
                  <span>ใช้เวลาอ่าน {article.readTime}</span>
                </div>

                <div className={styles.actionButtons}>
                  {isAuthenticated && user?.id === article.created_by && (
                    <Link 
                      to={`/edit/${article.id}`}
                      className={styles.editLink}
                    >
                      <Edit className="w-5 h-5" />
                      <span className="text-sm font-medium hidden sm:inline">แก้ไขบทความ</span>
                    </Link>
                  )}
                  <button className={styles.shareLink}>
                    <Share2 className="w-5 h-5" />
                  </button>
                  {isAuthenticated && (
                    <button 
                      onClick={handleToggleFavorite}
                      className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : styles.favoriteInactive}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </button>
                  )}
                  {isAuthenticated && ( user?.id === article.created_by || user?.role === 'admin') && (
                    <button 
                      onClick={handleDelete}
                      className={styles.deleteButton}
                      title="ลบบทความ"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  )}
                  {isAuthenticated && user?.id !== article.created_by && (
                    <button 
                      onClick={handleReport}
                      className={styles.reportButton}
                      title="รายงานบทความ"
                    >
                      <TriangleAlert className="w-5 h-5" />
                      <span className="text-sm font-medium hidden sm:inline">รายงานบทความ</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.coverImageWrapper}
            >
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className={styles.coverImage}
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={styles.content}
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </motion.div>
        </article>

        {/* Categories / Tags */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>หมวดหมู่เพิ่มเติม</h4>
          <div className={styles.tagList}>
            {['React', 'Web Design', 'Future'].map(tag => (
              <span key={tag} className={styles.tagBadge}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="ลบบทความ?"
        message="คุณแน่ใจหรือไม่ที่จะลบบทความนี้? เมื่อลบแล้วจะไม่สามารถย้อนคืนได้"
        type="danger"
        confirmText="ยืนยันการลบ"
        onConfirm={onConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportConfirm}
        onConfirm={onConfirmReport}
        onCancel={() => setShowReportConfirm(false)}
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={showSuccessAlert}
        title="สำเร็จ!"
        message={successMessage}
        type="success"
        confirmText="ตกลง"
        onConfirm={() => navigate('/')}
        onCancel={() => navigate('/')}
      />
    </div>
  );
};

export default ArticleDetail;
