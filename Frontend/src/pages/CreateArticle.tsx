import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Send, Image as ImageIcon, 
  Type, Code, Trash2, GripVertical, 
  Heading as HeadingIcon, Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import apiService from '../service/apiservice';

interface Block {
  id: string;
  type: 'text' | 'image' | 'code' | 'heading';
  content: string;
  metadata?: {
    language?: string;
    caption?: string;
    level?: number;
  };
}

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excerpt, setExcerpt] = useState('');

  const addBlock = (type: Block['type'], index?: number) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substring(7),
      type,
      content: '',
      metadata: type === 'code' ? { language: 'javascript' } : type === 'heading' ? { level: 2 } : {}
    };

    if (typeof index === 'number') {
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const updateBlock = (id: string, content: string, metadata?: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content, metadata: { ...b.metadata, ...metadata } } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('กรุณาใส่ชื่อบทความ');

    setIsSubmitting(true);
    const finalContent = blocks.map(b => {
      if (b.type === 'heading') return `${'#'.repeat(b.metadata?.level || 2)} ${b.content}`;
      if (b.type === 'image') return `![${b.metadata?.caption || ''}](${b.content})`;
      if (b.type === 'code') return `\n\`\`\`${b.metadata?.language || ''}\n${b.content}\n\`\`\`\n`;
      return b.content;
    }).join('\n\n');

    const body = {
      title,
      category,
      coverImage,
      excerpt: excerpt || finalContent.substring(0, 150) + '...',
      content: finalContent
    };

    console.log('Sending Article Body:', body);

    try {
      const response = await apiService.createArticle(body);

      if (response.status === 200 || response.status === 201) {
        alert('เผยแพร่บทความเรียบร้อยแล้ว!');
        navigate('/');
      } else {
        alert(`เกิดข้อผิดพลาด: ไม่สามารถเผยแพร่บทความได้`);
      }
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(`เกิดข้อผิดพลาด: ${error?.error || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-brand-light transition-colors group">
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              กลับไปที่หน้าบทความ
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isPreview ? 'bg-brand-light text-dark-bg' : 'bg-dark-card border border-dark-border text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? 'กลับไปแก้ไข' : 'ดูตัวอย่าง'}</span>
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center space-x-2 bg-brand-light text-dark-bg px-6 py-2.5 rounded-xl font-bold hover:bg-brand-aqua transition-all transform hover:scale-[1.05] active:scale-[0.95] shadow-lg shadow-brand-light/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? 'กำลังเผยแพร่...' : 'เผยแพร่'}</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="max-w-4xl mx-auto">
          {/* Header Editor */}
          {!isPreview ? (
            <motion.header className="mb-12 space-y-6">
              <div className="flex flex-col space-y-4">
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ใส่ชื่อบทความที่นี่..."
                  className="text-4xl md:text-6xl font-bold bg-transparent border-none text-white placeholder:text-white/20 outline-none w-full"
                />
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-brand-light/10 text-brand-light border border-brand-light/20 rounded-full px-4 py-1 font-semibold outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Future">Future</option>
                  </select>
                  <div className="flex items-center space-x-2 bg-dark-card border border-dark-border rounded-full px-4 py-1 text-gray-400 focus-within:border-brand-light/50 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <input 
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="ใส่ URL รูปภาพหน้าปก..."
                      className="bg-transparent border-none outline-none w-64 text-xs"
                    />
                  </div>
                </div>
                
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="เขียนสรุปสั้นๆ (Excerpt) เพื่อดึงดูดผู้อ่าน..."
                  className="w-full bg-transparent border-none text-gray-400 placeholder:text-gray-400/30 outline-none resize-none text-sm italic"
                  rows={2}
                />
              </div>
              
              {coverImage && (
                <div className="rounded-3xl overflow-hidden aspect-[21/9] border border-white/5">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </motion.header>
          ) : (
            /* Preview Header - Matches Article Detail */
            <header className="mb-12">
              <div className="text-brand-aqua font-semibold uppercase tracking-widest text-sm mb-4">{category}</div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">{title || 'ชื่อบทความ'}</h1>
              {coverImage && (
                <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                  <img src={coverImage} alt={title} className="w-full h-[400px] object-cover" />
                </div>
              )}
            </header>
          )}

          {/* Dynamic Blocks */}
          <div className="space-y-4 relative">
            <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-6">
              <AnimatePresence initial={false}>
                {blocks.map((block, index) => (
                  <Reorder.Item 
                    key={block.id} 
                    value={block}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative"
                  >
                    {!isPreview ? (
                      <div className="flex gap-4">
                        {/* Drag Handle */}
                        <div className="flex flex-col items-center pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-5 h-5 text-gray-600 cursor-grab active:cursor-grabbing" />
                        </div>

                        {/* Block Editor UI */}
                        <div className="flex-grow bg-dark-card/50 border border-dark-border rounded-2xl p-6 hover:border-brand-light/30 transition-all focus-within:border-brand-light/50 focus-within:bg-dark-card">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                              {block.type === 'text' && <Type className="w-3 h-3" />}
                              {block.type === 'heading' && <HeadingIcon className="w-3 h-3" />}
                              {block.type === 'image' && <ImageIcon className="w-3 h-3" />}
                              {block.type === 'code' && <Code className="w-3 h-3" />}
                              <span>{block.type}</span>
                            </div>
                            <button 
                              onClick={() => removeBlock(block.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {block.type === 'text' && (
                            <textarea 
                              placeholder="เริ่มพิมพ์เนื้อหา..."
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, e.target.value)}
                              autoFocus
                              rows={1}
                              style={{ height: 'auto', minHeight: '100px' }}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                              }}
                              className="w-full bg-transparent border-none text-gray-300 resize-none outline-none leading-relaxed text-lg"
                            />
                          )}

                          {block.type === 'heading' && (
                            <div className="flex items-center gap-4">
                              <select 
                                value={block.metadata?.level}
                                onChange={(e) => updateBlock(block.id, block.content, { level: parseInt(e.target.value) })}
                                className="bg-dark-bg border border-dark-border rounded-lg px-2 py-1 text-xs text-gray-400 outline-none"
                              >
                                <option value={2}>H2</option>
                                <option value={3}>H3</option>
                                <option value={4}>H4</option>
                              </select>
                              <input 
                                type="text"
                                placeholder="ใส่หัวข้อรอง..."
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                className="flex-grow bg-transparent border-none text-2xl font-bold text-white outline-none"
                              />
                            </div>
                          )}

                          {block.type === 'image' && (
                            <div className="space-y-4">
                              <input 
                                type="text"
                                placeholder="ใส่ URL รูปภาพ..."
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-light/50"
                              />
                              <input 
                                type="text"
                                placeholder="คำบรรยายรูปภาพ (Caption)..."
                                value={block.metadata?.caption || ''}
                                onChange={(e) => updateBlock(block.id, block.content, { caption: e.target.value })}
                                className="w-full bg-transparent border-none text-xs text-gray-500 outline-none italic"
                              />
                              {block.content && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-white/5">
                                  <img src={block.content} alt="Block Preview" className="w-full max-h-[300px] object-cover" />
                                </div>
                              )}
                            </div>
                          )}

                          {block.type === 'code' && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">ภาษา:</span>
                                <input 
                                  type="text"
                                  placeholder="เช่น typescript, python..."
                                  value={block.metadata?.language || ''}
                                  onChange={(e) => updateBlock(block.id, block.content, { language: e.target.value })}
                                  className="bg-dark-bg border border-dark-border rounded-lg px-3 py-1 text-xs text-brand-aqua outline-none"
                                />
                              </div>
                              <textarea 
                                placeholder="วางโค้ดที่นี่..."
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-sm font-mono text-brand-aqua outline-none min-h-[150px]"
                              />
                            </div>
                          )}
                        </div>

                        {/* Add block button between */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center space-x-1 bg-dark-card border border-brand-light/20 rounded-full p-1 shadow-xl">
                            <BlockActionBtn icon={<Type />} onClick={() => addBlock('text', index)} tooltip="ข้อความ" />
                            <BlockActionBtn icon={<HeadingIcon />} onClick={() => addBlock('heading', index)} tooltip="หัวข้อ" />
                            <BlockActionBtn icon={<ImageIcon />} onClick={() => addBlock('image', index)} tooltip="รูปภาพ" />
                            <BlockActionBtn icon={<Code />} onClick={() => addBlock('code', index)} tooltip="โค้ด" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Preview Mode Rendering - Matches Article Detail Prose */
                      <div className="prose prose-invert max-w-none">
                        {block.type === 'text' && <ReactMarkdown>{block.content}</ReactMarkdown>}
                        {block.type === 'heading' && React.createElement(`h${block.metadata?.level || 2}`, {}, block.content)}
                        {block.type === 'image' && block.content && (
                          <figure className="my-8">
                            <img src={block.content} alt={block.metadata?.caption} className="rounded-2xl w-full" />
                            {block.metadata?.caption && (
                              <figcaption className="text-center text-gray-500 text-sm mt-3">{block.metadata.caption}</figcaption>
                            )}
                          </figure>
                        )}
                        {block.type === 'code' && block.content && (
                          <div className="my-8">
                            <div className="flex items-center justify-between bg-dark-card border-x border-t border-dark-border rounded-t-xl px-4 py-2">
                              <span className="text-xs text-gray-500 font-mono italic">{block.metadata?.language}</span>
                            </div>
                            <pre className="!mt-0 !rounded-t-none">
                              <code>{block.content}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Bottom Add Block Control */}
            {!isPreview && blocks.length > 0 && (
              <div className="flex justify-center pt-8">
                <div className="flex items-center space-x-3 bg-dark-card border border-dark-border rounded-2xl px-6 py-4 shadow-2xl">
                   <BlockActionBtnLarge icon={<Type />} label="ข้อความ" onClick={() => addBlock('text')} />
                   <BlockActionBtnLarge icon={<HeadingIcon />} label="หัวข้อ" onClick={() => addBlock('heading')} />
                   <BlockActionBtnLarge icon={<ImageIcon />} label="รูปภาพ" onClick={() => addBlock('image')} />
                   <BlockActionBtnLarge icon={<Code />} label="โค้ด" onClick={() => addBlock('code')} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const BlockActionBtn = ({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-light hover:bg-brand-light/10 transition-all"
  >
    {React.cloneElement(icon as React.ReactElement, { size: 16 })}
  </button>
);

const BlockActionBtnLarge = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-brand-light hover:bg-brand-light/5 transition-all text-sm font-medium"
  >
    {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    <span>{label}</span>
  </button>
);

export default CreateArticle;
