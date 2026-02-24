import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import userservice from '../service/userservice';
import { useAuth } from '../AuthContext';

const Auth = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, default to home
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to:', from);
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
        // Login Logic
        const response: any = await userservice.login({
          user_name: formData.username,
          password: formData.password
        });
        
        if (response.status === 200) {
          login(response.data.data);
          setSuccess('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
          // The useEffect above will handle the navigation automatically once isAuthenticated is true
        }
      } else {
        // Register Logic
        if (formData.password != formData.confirmPassword) {
          throw new Error('รหัสผ่านไม่ตรงกัน');
        }

        // console.log(formData);
        console.log(formData.password);
        console.log(formData.confirmPassword);

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
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        {/* Decorative Background Elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-aqua/10 rounded-full blur-3xl" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'กรุณาเข้าสู่ระบบเพื่อใช้งาน Thoughtline' : 'ร่วมเป็นส่วนหนึ่งของสังคมแห่งการเรียนรู้'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-400 text-sm"
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
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center space-x-3 text-green-400 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">ชื่อที่แสดง</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                  <input 
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">ชื่อผู้ใช้ (Username)</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                  <input 
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="john_doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">อีเมล</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                    <input 
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">ชื่อผู้ใช้ (Username)</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                    <input 
                      type="text"
                      name="username"
                      required={!isLogin}
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="john_doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">รหัสผ่าน</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-light transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">ยืนยันรหัสผ่าน</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-light transition-colors" />
                <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 outline-none focus:border-brand-light/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-light transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-light text-dark-bg py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-aqua transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-light/20 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              <span>{loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี')}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? 'ยังไม่มีบัญชีใช่หรือไม่?' : 'มีบัญชีอยู่แล้วใช่หรือไม่?'}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="ml-2 text-brand-light font-bold hover:text-brand-aqua transition-colors"
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
