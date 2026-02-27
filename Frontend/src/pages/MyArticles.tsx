import { Article } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../service/articleservice';
import Pagination from '../components/Pagination';
import styles from '../styles/MyArticles.module.css';

const MyArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response: any = await apiService.getOwnArticle({ page: currentPage, limit });
        if (response.status === 200) {
          const result = response.data;
          setArticles(result.data.articles.map((item: any) => ({
            ...item,
            id: item._id,
            publishedAt: new Date(item.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: item.readTime || '5 นาที'
          })));
          setTotalPages(result.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.title}
          >
            บทความ <span className="text-gradient">ของฉัน</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            จัดการและแก้ไขบทความที่คุณเขียนขึ้นมาทั้งหมดได้ที่นี่
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.actionRow}
          >
            <button 
              onClick={() => navigate('/create')}
              className={styles.createButton}
            >
              <Plus className="w-5 h-5" />
              <span>สร้างบทความใหม่</span>
            </button>
            <Link 
              to="/"
              className={styles.allArticlesLink}
            >
              <BookOpen className="w-5 h-5" />
              <span>ดูบทความทั้งหมด</span>
            </Link>
          </motion.div>
        </header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <>
            <div className={styles.articleGrid}>
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.articleItem}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyText}>คุณยังไม่ได้สร้างบทความใดๆ</div>
                  <button 
                    onClick={() => navigate('/create')}
                    className={styles.createFirstButton}
                  >
                    เริ่มสร้างบทความแรกของคุณเลย!
                  </button>
                </div>
              )}
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
