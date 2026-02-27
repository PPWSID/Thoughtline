import { Link } from 'react-router-dom';
import { Menu, BookOpen, Layers, ChevronDown, PenTool, X, LogIn, User, LogOut, Settings, Heart, ShieldIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { mockCategory } from '../data/mockCategory';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);


  const navLinks = isAuthenticated ? [
    { name: 'หน้าแรก', path: '/', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'รายการโปรด', path: '/favorites', icon: <Heart className="w-4 h-4" /> },
    { name: 'บทความของฉัน', path: '/my-articles', icon: <PenTool className="w-4 h-4" /> },
  ] : [
    { name: 'บทความ', path: '/', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className={styles.logo}>
              Thoughtline
            </Link>
          </div>

          {/* Desktop Links */}
          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={styles.navLink}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div 
              className={styles.dropdownWrapper}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={styles.dropdownButton}>
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
                    className={styles.dropdownMenu}
                  >
                    {mockCategory.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className={styles.dropdownItem}
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
                className={styles.dropdownWrapper}
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button className={styles.userButton}>
                  <div className={styles.userAvatar}>
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
                      className={`${styles.dropdownMenu} right-0`}
                      style={{ left: 'auto' }}
                    >
                      <Link
                        to="/profile"
                        className={styles.dropdownItem}
                      >
                        <Settings className="w-4 h-4" />
                        <span>โปรไฟล์</span>
                      </Link>

                      {isAuthenticated && user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className={`${styles.dropdownItem} text-cyan-500`}
                        >
                          <ShieldIcon  className="w-4 h-4" />
                          <span>ผู้ดูแลระบบ</span>
                        </Link>
                      )}
                     
                      <button
                        onClick={logout}
                        className={`${styles.dropdownItem} ${styles.mobileLogoutButton} w-full`}
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
                className={styles.loginButton}
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
              className={styles.mobileMenuButton}
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
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuContent}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={styles.mobileNavLink}
                >
                  <span className={styles.mobileNavLinkIcon}>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className={styles.mobileCategorySection}>
                <div className={styles.mobileCategoryHeader}>
                  <Layers className="w-3 h-3" />
                  <span>หมวดหมู่ทั้งหมด</span>
                </div>
                <div className={styles.mobileCategoryGrid}>
                  {mockCategory.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsOpen(false)}
                      className={styles.mobileCategoryItem}
                    >
                      {cat.icon}
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.mobileUserSection}>
                {isAuthenticated ? (
                  <>
                    <div className={styles.mobileUserInfo}>
                      <div className={styles.mobileUserAvatarBig}>
                        <User className="w-5 h-5 text-brand-light" />
                      </div>
                      <div className={styles.mobileUserDetails}>
                        <span className={styles.mobileUserName}>{user?.user_name}</span>
                        <span className={styles.mobileUserEmail}>{user?.email}</span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className={styles.mobileActionButton}
                    >
                      <Settings className="w-5 h-5" />
                      <span>จัดการโปรไฟล์</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className={`${styles.mobileActionButton} ${styles.mobileLogoutButton}`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={styles.mobileLoginAction}
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
