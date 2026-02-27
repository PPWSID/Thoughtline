import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  ChevronLeft, Send, Image as ImageIcon, 
  Type, Code, Trash2, GripVertical, 
  Heading as HeadingIcon, Eye, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import apiService from '../service/articleservice';
import { mockCategory } from '../data/mockCategory';
import styles from '../styles/CreateArticle.module.css';
// import { textarea } from 'framer-motion/client';

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

const parseMarkdownToBlocks = (markdown: string): Block[] => {
  if (!markdown) return [{ id: Math.random().toString(36).substring(7), type: 'text', content: '' }];
  
  const blocks: Block[] = [];
  const lines = markdown.split('\n');
  let currentText = '';

  const flushText = () => {
    if (currentText.trim()) {
      blocks.push({
        id: Math.random().toString(36).substring(7),
        type: 'text',
        content: currentText.trim()
      });
      currentText = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.match(/^#+\s/)) {
      flushText();
      const level = (line.match(/^#+/)?.[0].length || 2);
      blocks.push({
        id: Math.random().toString(36).substring(7),
        type: 'heading',
        content: line.replace(/^#+\s/, ''),
        metadata: { level }
      });
    } 
    else if (line.match(/^!\[.*\]\(.*\)/)) {
      flushText();
      const match = line.match(/^!\[(.*)\]\((.*)\)/);
      blocks.push({
        id: Math.random().toString(36).substring(7),
        type: 'image',
        content: match?.[2] || '',
        metadata: { caption: match?.[1] || '' }
      });
    }
    else if (line.startsWith('```')) {
      flushText();
      const lang = line.slice(3).trim();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      blocks.push({
        id: Math.random().toString(36).substring(7),
        type: 'code',
        content: code.trim(),
        metadata: { language: lang || 'javascript' }
      });
    }
    else {
      if (line.trim() || currentText) {
        currentText += line + '\n';
      }
    }
  }
  flushText();

  return blocks.length > 0 ? blocks : [{ id: Math.random().toString(36).substring(7), type: 'text', content: '' }];
};

const BlockItem = ({ 
  block, 
  index, 
  isPreview, 
  updateBlock, 
  removeBlock, 
  addBlock 
}: { 
  block: Block, 
  index: number, 
  isPreview: boolean, 
  updateBlock: (id: string, content: string, metadata?: any) => void,
  removeBlock: (id: string) => void,
  addBlock: (type: Block['type'], index?: number) => void
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={block}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={styles.blockItem}
    >
      {!isPreview ? (
        <div className={styles.blockWrapper}>
          <div 
            onPointerDown={(e) => dragControls.start(e)}
            className={styles.dragHandle}
          >
            <GripVertical className="w-5 h-5 text-gray-600" />
          </div>

          <div className={styles.blockEditor}>
            <div className={styles.blockMetaRow}>
              <div className={styles.blockTypeInfo}>
                {block.type === 'text' && <Type className="w-3 h-3" />}
                {block.type === 'heading' && <HeadingIcon className="w-3 h-3" />}
                {block.type === 'image' && <ImageIcon className="w-3 h-3" />}
                {block.type === 'code' && <Code className="w-3 h-3" />}
                <span>{block.type}</span>
              </div>
              <button 
                onClick={() => removeBlock(block.id)}
                className={styles.removeBlockBtn}
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
                className={styles.textEditor}
              />
            )}

            {block.type === 'heading' && (
              <div className={styles.headingRow}>
                <select 
                  value={block.metadata?.level}
                  onChange={(e) => updateBlock(block.id, block.content, { level: parseInt(e.target.value) })}
                  className={styles.levelSelect}
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
                  className={styles.headingInput}
                />
              </div>
            )}

            {block.type === 'image' && (
              <div className={styles.imageEditor}>
                <input 
                  type="text"
                  placeholder="ใส่ URL รูปภาพ..."
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className={styles.imageUrlInput}
                />
                <input 
                  type="text"
                  placeholder="คำบรรยายรูปภาพ (Caption)..."
                  value={block.metadata?.caption || ''}
                  onChange={(e) => updateBlock(block.id, block.content, { caption: e.target.value })}
                  className={styles.imageCaptionInput}
                />
                {block.content && (
                  <div className={styles.articleImagePreview}>
                    <img src={block.content} alt="Block Preview" className="w-full max-h-[300px] object-cover" />
                  </div>
                )}
              </div>
            )}

            {block.type === 'code' && (
              <div className={styles.codeEditor}>
                <div className="flex items-center gap-2">
                  <span className={styles.langInputLabel}>ภาษา:</span>
                  <input 
                    type="text" 
                    placeholder="เช่น typescript, python..."
                    value={block.metadata?.language || ''}
                    onChange={(e) => updateBlock(block.id, block.content, { language: e.target.value })}
                    className={styles.langInput}
                  />
                </div>
                <textarea 
                  placeholder="วางโค้ดที่นี่..."
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className={styles.codeTextarea}
                />
              </div>
            )}
          </div>

          <div className={styles.inlineAddBlock}>
            <div className={styles.inlineAddBox}>
              <BlockActionBtn icon={<Type />} onClick={() => addBlock('text', index)} tooltip="ข้อความ" />
              <BlockActionBtn icon={<HeadingIcon />} onClick={() => addBlock('heading', index)} tooltip="หัวข้อ" />
              <BlockActionBtn icon={<ImageIcon />} onClick={() => addBlock('image', index)} tooltip="รูปภาพ" />
              <BlockActionBtn icon={<Code />} onClick={() => addBlock('code', index)} tooltip="โค้ด" />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.previewProse}>
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
            <div className={styles.codePreviewWrapper}>
              <div className={styles.codePreviewHeader}>
                <span className={styles.codeLangBadge}>{block.metadata?.language}</span>
              </div>
              <pre className={styles.codePre}>
                <code>{block.content}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </Reorder.Item>
  );
};

const CreateArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('Default');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const response = await apiService.getArticleById(id as string);
          if (response.status === 200) {
            const article = response.data.data;
            setTitle(article.title);
            setCategory(article.category);
            setCoverImage(article.coverImage);
            setExcerpt(article.excerpt);
            setBlocks(parseMarkdownToBlocks(article.content));
          }
        } catch (error) {
          console.error('Fetch Error:', error);
        }
      };
      fetchArticle();
    } else {
      setTitle('');
      setCategory('Default');
      setCoverImage('');
      setExcerpt('');
      setBlocks([{ id: Math.random().toString(36).substring(7), type: 'text', content: '' }]);
    }
  }, [id, isEdit]);

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
    if (!title) return setNotification({ show: true, message: 'กรุณาใส่ชื่อบทความ', type: 'error' });

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

    try {
      let response;
      if (isEdit) {
        response = await apiService.updateArticle(id as string, body);
      } else {
        response = await apiService.createArticle(body);
      }

      if (response.status === 200 || response.status === 201) {
        setNotification({
          show: true,
          message: isEdit ? 'อัปเดตบทความเรียบร้อยแล้ว!' : 'เผยแพร่บทความของคุณเรียบร้อยแล้ว!',
          type: 'success'
        });
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
          navigate(isEdit ? `/article/${id}` : '/');
        }, 2000);
      } else {
        setNotification({
          show: true,
          message: isEdit ? 'ไม่สามารถอัปเดตบทความได้' : 'ไม่สามารถเผยแพร่บทความได้',
          type: 'error'
        });
      }
    } catch (error: any) {
      console.error('Submit Error:', error);
      setNotification({
        show: true,
        message: error?.error || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.navRow}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" className={styles.backLink}>
              <ChevronLeft className={styles.backIcon} />
              กลับไปที่หน้าบทความ
            </Link>
          </motion.div>

          <div className={styles.actionRow}>
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className={`${styles.previewButton} ${isPreview ? styles.previewButtonActive : styles.previewButtonInactive}`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? 'กลับไปแก้ไข' : 'ดูตัวอย่าง'}</span>
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? (isEdit ? 'กำลังบันทึก...' : 'กำลังเผยแพร่...') : (isEdit ? 'บันทึกการแก้ไข' : 'เผยแพร่')}</span>
            </button>
          </div>
        </div>

        <div className={styles.editorArea}>
          {!isPreview ? (
            <motion.header className={styles.headerEditor}>
              <div className="flex flex-col space-y-4">
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ใส่ชื่อบทความที่นี่..."
                  className={styles.titleInput}
                />
                <div className={styles.metaRow}>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.categorySelect}
                  >
                    <option value="Default">Default</option>
                    {mockCategory.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className={styles.coverInputWrapper}>
                    <ImageIcon className="w-4 h-4" />
                    <input 
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="ใส่ URL รูปภาพหน้าปก..."
                      className={styles.coverInput}
                    />
                  </div>
                </div>
                
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="เขียนสรุปสั้นๆ (Excerpt) เพื่อดึงดูดผู้อ่าน..."
                  className={styles.excerptTextarea}
                  rows={2}
                />
              </div>
              
              {coverImage && (
                <div className={styles.coverPreview}>
                  <img src={coverImage} alt="Cover Preview" className={styles.coverImage} />
                </div>
              )}
            </motion.header>
          ) : (
            <header className={styles.previewHeader}>
              <div className={styles.previewCategory}>{category}</div>
              <h1 className={styles.previewTitle}>{title || 'ชื่อบทความ'}</h1>
              {coverImage && (
                <div className={styles.previewCover}>
                  <img src={coverImage} alt={title} className={styles.previewCoverImage} />
                </div>
              )}
            </header>
          )}

          <div className={styles.blockContainer}>
            <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className={styles.blockGroup}>
              <AnimatePresence initial={false}>
                {blocks.map((block, index) => (
                  <BlockItem 
                    key={block.id}
                    block={block}
                    index={index}
                    isPreview={isPreview}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                    addBlock={addBlock}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {!isPreview && blocks.length > 0 && (
              <div className={styles.bottomAddBlock}>
                <div className={styles.largeActionBox}>
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

      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
            className={styles.toastContainer}
          >
            <div className={`
              ${styles.toast}
              ${notification.type === 'success' ? styles.toastSuccess : styles.toastError}
            `}>
              <div className={`
                ${styles.toastGlow} 
                ${notification.type === 'success' ? styles.glowSuccess : styles.glowError}
              `} />
              
              <div className={`
                ${styles.toastIconWrapper}
                ${notification.type === 'success' ? styles.iconSuccess : styles.iconError}
              `}>
                {notification.type === 'success' ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>

              <div className={styles.toastContent}>
                <span className={styles.toastTitle}>
                  {notification.type === 'success' ? 'สำเร็จ!' : 'ขออภัย'}
                </span>
                <span className={styles.toastMsg}>
                  {notification.message}
                </span>
              </div>

              <button 
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className={styles.toastClose}
              >
                <X className="w-4 h-4" />
              </button>

              {notification.type === 'success' && (
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                  className={styles.progressBar}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const BlockActionBtn = ({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) => (
  <button 
    onClick={onClick}
    title={tooltip}
    className={styles.actionBtn}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 16 })}
  </button>
);

const BlockActionBtnLarge = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={styles.actionBtnLarge}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    <span>{label}</span>
  </button>
);

export default CreateArticle;
