import { Link } from 'react-router-dom';
import { Menu, BookOpen, Layers, ChevronDown, Rocket, PenTool, Cpu, X, LogIn, User, LogOut, Settings, Boxes, Heart  } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const categories = [
    { name: 'Development', path: '/?category=Development', icon: <Rocket className="w-4 h-4" /> },
    { name: 'Design', path: '/?category=Design', icon: <PenTool className="w-4 h-4" /> },
    { name: 'Technology', path: '/?category=Technology', icon: <Cpu className="w-4 h-4" /> },
    { name: 'อื่นๆ', path: '/?category=others', icon: <Boxes className="w-4 h-4" /> },
  ];

  const navLinks = isAuthenticated ? [
    { name: 'หน้าแรก', path: '/', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'รายการโปรด', path: '/favorites', icon: <Heart className="w-4 h-4" /> },
    { name: 'บทความของฉัน', path: '/my-articles', icon: <PenTool className="w-4 h-4" /> },
  ] : [
    { name: 'บทความ', path: '/', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
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
            
            {/* User DropDown When Login */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 bg-brand-light/10 text-brand-light px-4 py-2 rounded-xl border border-brand-light/20 transition-all font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-brand-light/20 flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span>{user?.user_name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 w-48 py-2 mt-1 bg-dark-card border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-400 hover:text-brand-light hover:bg-white/5 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        <span>โปรไฟล์</span>
                      </Link>
                     
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-white/5 hover:bg-brand-light/10 text-gray-300 hover:text-brand-light px-4 py-2 rounded-xl transition-all font-medium text-sm border border-white/5 hover:border-brand-light/20"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
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

              <div className="pt-4 mt-2 border-t border-white/5">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-brand-light/5 border border-brand-light/10 mb-2">
                      <div className="w-10 h-10 rounded-full bg-brand-light/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-brand-light" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{user?.user_name}</span>
                        <span className="text-gray-500 text-xs">{user?.email}</span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-4 text-gray-300 hover:text-brand-light text-base border-b border-white/5"
                    >
                      <Settings className="w-5 h-5" />
                      <span>จัดการโปรไฟล์</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-4 text-red-400 hover:bg-red-500/5 text-base"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full bg-brand-light text-dark-bg py-4 rounded-2xl font-bold hover:bg-brand-aqua transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>เข้าสู่ระบบ</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
