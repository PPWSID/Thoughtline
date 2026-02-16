import { Article } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../service/apiservice';

const ArticleList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiService.getArticles();
        if (response.status === 200) {
          const result = response.data;
          // Map backend Article to frontend Article type if needed
          setArticles(result.data.map((item: any) => ({
            ...item,
            id: item._id, // MongoDB _id to id
            publishedAt: new Date(item.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: item.readTime || '5 นาที' // Handle missing readTime
          })));
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            สำรวจ <span className="text-gradient">ความคิดใหม่ๆ</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          >
            ศูนย์รวมบทความด้านเทคโนโลยี ดีไซน์ และนวัตกรรม ที่จะช่วยเติมเต็มจินตนาการของคุณ 
            อ่านง่าย สบายตา พร้อมเนื้อหาที่ทันสมัย
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <button 
              onClick={() => navigate('/create')}
              className="flex items-center space-x-2 bg-brand-light text-dark-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-aqua transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-light/20"
            >
              <Plus className="w-5 h-5" />
              <span>สร้างบทความใหม่</span>
            </button>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-light/20 border-t-brand-light rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                ยังไม่มีบทความในขณะนี้
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
