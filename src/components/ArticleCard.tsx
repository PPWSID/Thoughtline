import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/article/${article.id}`} className="block h-full">
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden h-full flex flex-col group-hover:border-brand-light/30 transition-colors shadow-xl">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-brand-light/90 text-dark-bg px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-light transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="mt-auto flex items-center text-brand-aqua font-semibold text-sm group-hover:translate-x-1 transition-transform">
              อ่านเพิ่มเติม <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
