import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import userservice from '../service/userservice';
import { useAuth } from '../AuthContext';
import styles from '../styles/Auth.module.css';

const Auth = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const response: any = await userservice.login({
          user_name: formData.username,
          password: formData.password
        });
        
        if (response.status === 200) {
          login(response.data.data);
          setSuccess('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('รหัสผ่านไม่ตรงกัน');
        }

        const response: any = await userservice.register({
          name: formData.name,
          user_name: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (response.status === 200) {
          setSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
          setIsLogin(true);
          setFormData({ ...formData, password: '', confirmPassword: '' });
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err?.error || err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authWrapper}>
        <div className={styles.blurLeft} />
        <div className={styles.blurRight} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.glassCard}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
            </h1>
            <p className={styles.subtitle}>
              {isLogin ? 'กรุณาเข้าสู่ระบบเพื่อใช้งาน Thoughtline' : 'ร่วมเป็นส่วนหนึ่งของสังคมแห่งการเรียนรู้'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.errorBox}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.successBox}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.field}>
                <label className={styles.label}>ชื่อที่แสดง</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} />
                  <input 
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={styles.input}
                  />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className={styles.field}>
                <label className={styles.label}>ชื่อผู้ใช้ (Username)</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} />
                  <input 
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="john_doe"
                    className={styles.input}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>อีเมล</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input 
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>ชื่อผู้ใช้ (Username)</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} />
                    <input 
                      type="text"
                      name="username"
                      required={!isLogin}
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="john_doe"
                      className={styles.input}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.field}>
              <label className={styles.label}>รหัสผ่าน</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`${styles.input} ${styles.inputWithEye}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className={styles.field}>
                <label className={styles.label}>ยืนยันรหัสผ่าน</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`${styles.input} ${styles.inputWithEye}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.eyeButton}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              <span>{loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี')}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {isLogin ? 'ยังไม่มีบัญชีใช่หรือไม่?' : 'มีบัญชีอยู่แล้วใช่หรือไม่?'}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className={styles.switchButton}
              >
                {isLogin ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบที่นี่'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
