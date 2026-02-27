import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Heart } from 'lucide-react';
import { Article } from '../types/article';
import { useAuth } from '../AuthContext';
import favoriteservice from '../service/favoriteservice';
import { useState, useEffect } from 'react';
import styles from '../styles/ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  initialIsFavorite?: boolean;
  onToggleFavorite?: (articleId: string, isFavorite: boolean) => void;
}

const ArticleCard = ({ article, initialIsFavorite = false, onToggleFavorite }: ArticleCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(article.isFavorite || initialIsFavorite);

  useEffect(() => {
    if (article.isFavorite !== undefined) {
      setIsFavorite(article.isFavorite);
    }
  }, [article.isFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;

    try {
      const response: any = await favoriteservice.toggleFavorite(article.id);
      if (response.status === 200) {
        const newStatus = response.data.data.action === 'added';
        setIsFavorite(newStatus);
        if (onToggleFavorite) {
          onToggleFavorite(article.id, newStatus);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.cardContainer}
      transition={{ duration: 0.3 }}
    >
      {isAuthenticated && (
        <button 
          onClick={handleFavorite}
          className={styles.favoriteButton}
        >
          <Heart className={`${styles.heartIcon} ${isFavorite ? styles.heartIconActive : ''}`} />
        </button>
      )}

      <Link to={`/article/${article.id}`} className="block h-full">
        <div className={styles.cardBox}>
          
          {/* Image Container */}
          <div className={styles.imageContainer}>
            <img
              src={article.coverImage}
              alt={article.title}
              className={styles.image}
            />
            <div className={styles.categoryBadge}>
              {article.category}
            </div>
          </div>

          {/* Content */}
          <div className={styles.contentWrapper}>
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </div>
              <div className={styles.metaItem}>
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <h3 className={styles.title}>
              {article.title}
            </h3>

            <p className={styles.excerpt}>
              {article.excerpt}
            </p>

            <div className={styles.readMore}>
              อ่านเพิ่มเติม <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>

    </motion.div>
  );
};

export default ArticleCard;
