import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import favoriteservice from '../service/favoriteservice';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types/article';

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
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-6"
          >
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            รายการ <span className="text-red-500">โปรด</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          >
            บทความที่คุณชื่นชอบและเก็บไว้ศึกษาต่อ รวบรวมไว้ที่นี่เพื่อการเข้าถึงที่รวดเร็ว
          </motion.p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  layout // เพิ่ม layout เพื่อให้เคลื่อนที่สวยงามเวลาหายไป
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }} // เมื่อหายไป
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <ArticleCard 
                    article={article} 
                    initialIsFavorite={true} 
                    onToggleFavorite={handleRemoveFavorite}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-gray-600" />
                </div>
                <div className="text-gray-500 mb-4 text-lg">คุณยังไม่มีบทความที่ถูกใจในขณะนี้</div>
                <Link 
                  to="/"
                  className="text-brand-light hover:underline font-medium flex items-center"
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
