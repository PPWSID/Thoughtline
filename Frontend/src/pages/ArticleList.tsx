import { Article } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../service/articleservice';
import Pagination from '../components/Pagination';
import { useAuth } from '../AuthContext';
import styles from '../styles/ArticleList.module.css';

const ArticleList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const fetchParams = { category, page: currentPage, limit };
        let response: any;

        if (isAuthenticated) {
          response = await apiService.getArticlesWithLogin(fetchParams);
        } else {
          response = category 
            ? await apiService.getArticlesByFilter(fetchParams)
            : await apiService.getArticles({ page: currentPage, limit });
        }
          
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
  }, [category, currentPage, isAuthenticated]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      navigate(`/?${params.toString()}`);
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
            {category ? (
              <>หมวดหมู่ <span className="text-gradient">{category}</span></>
            ) : (
              <>สำรวจ <span className="text-gradient">ความคิดใหม่ๆ</span></>
            )}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            ศูนย์รวมบทความด้านเทคโนโลยี ดีไซน์ และนวัตกรรม ที่จะช่วยเติมเต็มจินตนาการของคุณ 
            อ่านง่าย สบายตา พร้อมเนื้อหาที่ทันสมัย
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.actionWrapper}
          >
            <button 
              onClick={() => navigate('/create')}
              className={styles.createButton}
            >
              <Plus className="w-5 h-5" />
              <span>สร้างบทความใหม่</span>
            </button>
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
                  ยังไม่มีบทความในขณะนี้
                </div>
              )}
            </div>

            {/* Pagination UI */}
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

export default ArticleList;
