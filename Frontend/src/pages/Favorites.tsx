import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import favoriteservice from '../service/favoriteservice';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types/article';
import styles from '../styles/Favorites.module.css';

const Favorites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response: any = await favoriteservice.getFavorites();
      if (response.status === 200) {
        const result = response.data.data;
        setArticles(result.map((item: any) => ({
          ...item,
          id: item._id,
          publishedAt: new Date(item.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: item.readTime || '5 นาที'
        })));
      }
    } catch (error) {
      console.error('Fetch Favorites Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (articleId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.iconWrapper}
          >
            <Heart className={styles.heartIcon} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.title}
          >
            รายการ <span className="text-red-500">โปรด</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            บทความที่คุณชื่นชอบและเก็บไว้ศึกษาต่อ รวบรวมไว้ที่นี่เพื่อการเข้าถึงที่รวดเร็ว
          </motion.p>
        </header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.articleGrid}>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.articleItem}
                >
                  <ArticleCard 
                    article={article} 
                    initialIsFavorite={true} 
                    onToggleFavorite={handleRemoveFavorite}
                  />
                </motion.div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                    <Heart className={styles.emptyIcon} />
                </div>
                <div className={styles.emptyText}>คุณยังไม่มีบทความที่ถูกใจในขณะนี้</div>
                <Link 
                  to="/"
                  className={styles.exploreLink}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  ไปสำรวจบทความใหม่ๆ กันเลย
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
