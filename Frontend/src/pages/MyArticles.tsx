import { Article } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../service/articleservice';
import Pagination from '../components/Pagination';

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
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            บทความ <span className="text-gradient">ของฉัน</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          >
            จัดการและแก้ไขบทความที่คุณเขียนขึ้นมาทั้งหมดได้ที่นี่
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center space-x-4"
          >
            <button 
              onClick={() => navigate('/create')}
              className="flex items-center space-x-2 bg-brand-light text-dark-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-aqua transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-light/20"
            >
              <Plus className="w-5 h-5" />
              <span>สร้างบทความใหม่</span>
            </button>
            <Link 
              to="/"
              className="flex items-center space-x-2 bg-white/5 text-gray-300 border border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              <span>ดูบทความทั้งหมด</span>
            </Link>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-light/20 border-t-brand-light rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
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
                <div className="col-span-full text-center py-20 flex flex-col items-center">
                  <div className="text-gray-500 mb-4 text-lg text-center">คุณยังไม่ได้สร้างบทความใดๆ</div>
                  <button 
                    onClick={() => navigate('/create')}
                    className="text-brand-light hover:underline font-medium"
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
