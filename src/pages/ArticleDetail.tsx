import { useParams, Link } from 'react-router-dom';
import { mockArticles } from '../data/mockArticles';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ArticleDetail = () => {
  const { id } = useParams();
  const article = mockArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl text-white">ไม่พบบทความที่คุณต้องการ</h1>
        <Link to="/" className="text-brand-light mt-4 inline-block hover:underline">
          กลับไปหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-brand-light transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            กลับไปที่หน้าบทความ
          </Link>
        </motion.div>

        <article>
          {/* Header */}
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 text-brand-aqua font-semibold uppercase tracking-widest text-sm mb-4">
                <span>{article.category}</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-400 border-y border-white/5 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-xs">
                    {article.author.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{article.author}</span>
                </div>
                
                <div className="flex items-center space-x-1.5 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishedAt}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>ใช้เวลาอ่าน {article.readTime}</span>
                </div>

                <button className="ml-auto text-gray-400 hover:text-brand-light">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </header>

          {/* Cover Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-white/5"
          >
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </motion.div>
        </article>

        {/* Categories / Tags */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <h4 className="text-white font-semibold mb-4">หมวดหมู่เพิ่มเติม</h4>
          <div className="flex gap-2">
            {['React', 'Web Design', 'Future'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-dark-card border border-dark-border rounded-full text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
