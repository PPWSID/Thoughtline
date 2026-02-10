import { Link } from 'react-router-dom';
import { Menu, BookOpen, Layers, ChevronDown, Rocket, PenTool, Cpu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { name: 'Development', path: '/categories/development', icon: <Rocket className="w-4 h-4" /> },
    { name: 'Design', path: '/categories/design', icon: <PenTool className="w-4 h-4" /> },
    { name: 'Technology', path: '/categories/technology', icon: <Cpu className="w-4 h-4" /> },
  ];

  const navLinks = [
    { name: 'บทความ', path: '/', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gradient">
              Thoughtline
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-brand-light transition-colors font-medium text-sm"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="flex items-center space-x-2 text-gray-300 hover:text-brand-light transition-colors font-medium text-sm py-4"
              >
                <Layers className="w-4 h-4" />
                <span>หมวดหมู่</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-48 py-2 bg-dark-card border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-brand-light hover:bg-white/5 transition-all"
                      >
                        <span className="text-brand-light opacity-70">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-brand-light p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-bg/95 border-t border-white/5 overflow-hidden backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-brand-light block py-4 text-base font-medium border-b border-white/5"
                >
                  <span className="bg-white/5 p-2 rounded-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
                  <Layers className="w-3 h-3" />
                  <span>หมวดหมู่ทั้งหมด</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:text-brand-light transition-all"
                    >
                      {cat.icon}
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
