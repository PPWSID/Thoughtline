import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Save, Image as ImageIcon } from 'lucide-react';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    coverImage: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call an API here
    console.log('Article Created:', formData);
    alert('บันทึกบทความเรียบร้อยแล้ว (Demo)');
    navigate('/');
  };

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

        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            เขียน <span className="text-gradient">เรื่องราวใหม่</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            แชร์ความรู้ และประสบการณ์ของคุณให้กับผู้อ่านที่รอติดตาม
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">หัวข้อบทความ</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ใส่หัวข้อที่น่าดึงดูด..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-light outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">หมวดหมู่</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-light outline-none transition-all"
                  required
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Future">Future</option>
                  <option value="Inspiration">Inspiration</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">ภาพหน้าปก (URL)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                </div>
                <input 
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-11 pr-4 py-3 text-white focus:border-brand-light outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">เรื่องย่อ</label>
              <textarea 
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="สรุปเนื้อหาสั้นๆ ให้น่าสนใจ..."
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-light outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">เนื้อหาบทความ (รองรับ Markdown)</label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="พิมพ์เนื้อหาที่นี่..."
                rows={10}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-light outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 flex items-center justify-center space-x-2 bg-brand-light text-dark-bg px-6 py-4 rounded-xl font-bold hover:bg-brand-aqua transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-light/20"
              >
                <Send className="w-5 h-5" />
                <span>เผยแพร่บทความ</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center space-x-2 bg-dark-bg border border-dark-border text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                <Save className="w-5 h-5" />
                <span>บันทึกร่าง</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateArticle;
