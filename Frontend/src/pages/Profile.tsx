import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Award, Edit3, Save, LogOut, Key, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import userservice from '../service/userservice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response: any = await userservice.getProfile();
            if (response.status === 200) {
                const data = response.data.data;
                setProfileData(data);
                setFormData({
                    name: data.user.name || '',
                    bio: data.user.bio || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response: any = await userservice.updateProfile(formData);
            if (response.status === 200) {
                setMessage({ type: 'success', text: 'อัปเดตโปรไฟล์สำเร็จแล้ว' });
                setEditMode(false);
                // Update local auth context as well
                if (user) {
                    // Update local auth context as well
                    // Fetch profile data to ensure everything is in sync
                    fetchProfile();
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error?.error || 'เกิดข้อผิดพลาดในการอัปเดต' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-brand-light/20 border-t-brand-light rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* 1. ส่วนหัวโปรไฟล์ (User Identity) */}
                <section className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-light to-brand-aqua flex items-center justify-center shadow-lg shadow-brand-light/20">
                                <User className="w-10 h-10 text-dark-bg" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{profileData?.user.name}</h1>
                                <p className="text-brand-light font-medium tracking-wide">@{profileData?.user.user_name}</p>
                                <div className="flex items-center mt-2 space-x-3">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300 flex items-center">
                                        <Shield className="w-3 h-3 mr-1.5 text-brand-aqua" />
                                        {profileData?.user.role?.toUpperCase()}
                                    </span>
                                    <span className="px-3 py-1 bg-brand-light/10 border border-brand-light/20 rounded-full text-xs font-bold text-brand-light flex items-center">
                                        <Award className="w-3 h-3 mr-1.5" />
                                        LEVEL {profileData?.user.level || 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setEditMode(!editMode)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editMode ? 'ยกเลิกการแก้ไข' : 'แก้ไขโปรไฟล์'}
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ด้านซ้าย - ข้อมูลส่วนตัว และ Stats */}
                    <div className="md:col-span-2 space-y-8">
                        {/* 2. ส่วนข้อมูลส่วนตัว (Personal Information) */}
                        <section className="glass-card p-8 rounded-3xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <FileText className="w-5 h-5 mr-3 text-brand-light" />
                                ข้อมูลส่วนตัว
                            </h2>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 text-sm ${
                                    message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        <input 
                                            type="email" 
                                            disabled 
                                            value={profileData?.user.email}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-gray-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">ชื่อที่แสดง</label>
                                    <div className="relative group">
                                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${editMode ? 'text-gray-400 group-focus-within:text-brand-light' : 'text-gray-600'}`} />
                                        <input 
                                            type="text" 
                                            disabled={!editMode}
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="ชื่อของคุณ"
                                            className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all ${
                                                editMode ? 'border-brand-light/30 focus:border-brand-light focus:bg-white/10' : 'border-transparent text-gray-400'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">คำอธิบายตัวเอง (Bio)</label>
                                    <textarea 
                                        disabled={!editMode}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        placeholder="เขียนอะไรบางอย่างเกี่ยวกับตัวคุณ..."
                                        rows={4}
                                        className={`w-full bg-white/5 border rounded-2xl py-4 px-4 text-white outline-none transition-all resize-none ${
                                            editMode ? 'border-brand-light/30 focus:border-brand-light focus:bg-white/10' : 'border-transparent text-gray-400'
                                        }`}
                                    />
                                </div>

                                {editMode && (
                                    <button 
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-brand-light text-dark-bg py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-aqua transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-brand-light/20 disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                                    </button>
                                )}
                            </form>
                        </section>
                    </div>

                    {/* ด้านขวา - สถิติ และ Setting */}
                    <div className="space-y-8">
                        {/* 3. ส่วนการจัดการบทความ (Stats) */}
                        <section className="glass-card p-8 rounded-3xl border border-white/10">
                            <h2 className="text-lg font-bold text-white mb-6 italic">กิจกรรมของคุณ</h2>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 text-center">
                                <div className="text-4xl font-bold text-brand-light mb-2">{profileData?.articleCount || 0}</div>
                                <div className="text-gray-400 text-sm font-medium">บทความที่เขียนทั้งหมด</div>
                            </div>
                            <button 
                                onClick={() => navigate('/my-articles')}
                                className="w-full mt-4 text-brand-aqua text-sm font-bold hover:underline"
                            >
                                ดูบทความของฉันทั้งหมด
                            </button>
                        </section>

                        {/* 4. ส่วนการตั้งค่าและความปลอดภัย */}
                        <section className="glass-card p-8 rounded-3xl border border-white/10">
                            <h2 className="text-lg font-bold text-white mb-6 italic">ความปลอดภัย</h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                                    <div className="flex items-center text-gray-300">
                                        <Key className="w-4 h-4 mr-3 text-brand-light" />
                                        <span className="text-sm font-medium">เปลี่ยนรหัสผ่าน</span>
                                    </div>
                                    <Award className="w-4 h-4 text-gray-600 group-hover:text-brand-light transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-all text-red-400 group"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    <span className="text-sm font-bold">ออกจากระบบ</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
