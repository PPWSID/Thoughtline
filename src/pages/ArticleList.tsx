import { mockArticles } from '../data/mockArticles';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';

const ArticleList = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
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
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            ศูนย์รวมบทความด้านเทคโนโลยี ดีไซน์ และนวัตกรรม ที่จะช่วยเติมเต็มจินตนาการของคุณ 
            อ่านง่าย สบายตา พร้อมเนื้อหาที่ทันสมัย
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
