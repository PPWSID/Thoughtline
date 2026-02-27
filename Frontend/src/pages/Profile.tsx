import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Award, Edit3, Save, LogOut, Key, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import userservice from '../service/userservice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';

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
                if (user) {
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
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.stack}
            >
                {/* 1. ส่วนหัวโปรไฟล์ (User Identity) */}
                <section className={styles.profileHeader}>
                    <div className={styles.headerBlur}></div>
                    
                    <div className={styles.headerContent}>
                        <div className={styles.userInfo}>
                            <div className={styles.avatarBox}>
                                <User className="w-10 h-10 text-dark-bg" />
                            </div>
                            <div>
                                <h1 className={styles.userTitle}>{profileData?.user.name}</h1>
                                <p className={styles.userHandle}>@{profileData?.user.user_name}</p>
                                <div className={styles.badgeWrapper}>
                                    <span className={styles.roleBadge}>
                                        <Shield className="w-3 h-3 mr-1.5 text-brand-aqua" />
                                        {profileData?.user.role?.toUpperCase()}
                                    </span>
                                    <span className={styles.levelBadge}>
                                        <Award className="w-3 h-3 mr-1.5" />
                                        LEVEL {profileData?.user.level || 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setEditMode(!editMode)}
                            className={styles.editButton}
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editMode ? 'ยกเลิกการแก้ไข' : 'แก้ไขโปรไฟล์'}
                        </button>
                    </div>
                </section>

                <div className={styles.mainGrid}>
                    {/* ด้านซ้าย - ข้อมูลส่วนตัว และ Stats */}
                    <div className={styles.mainColumn}>
                        {/* 2. ส่วนข้อมูลส่วนตัว (Personal Information) */}
                        <section className={styles.cardSection}>
                            <h2 className={styles.sectionTitle}>
                                <FileText className="w-5 h-5 mr-3 text-brand-light" />
                                ข้อมูลส่วนตัว
                            </h2>

                            {message.text && (
                                <div className={`${styles.messageBox} ${
                                    message.type === 'success' ? styles.messageSuccess : styles.messageError
                                }`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className={styles.form}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>อีเมล (ไม่สามารถเปลี่ยนได้)</label>
                                    <div className={styles.inputWrapper}>
                                        <Mail className={styles.inputIcon} />
                                        <input 
                                            type="email" 
                                            disabled 
                                            value={profileData?.user.email}
                                            className={`${styles.inputBase} ${styles.inputDisabled}`}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputField}>
                                    <label className={styles.label}>ชื่อที่แสดง</label>
                                    <div className={styles.inputWrapperGroup}>
                                        <User className={`${styles.inputIcon} ${editMode ? styles.inputIconActive : styles.inputIconDisabled}`} />
                                        <input 
                                            type="text" 
                                            disabled={!editMode}
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="ชื่อของคุณ"
                                            className={`${styles.inputBase} ${
                                                editMode ? styles.inputEditable : styles.inputReadonly
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputField}>
                                    <label className={styles.label}>คำอธิบายตัวเอง (Bio)</label>
                                    <textarea 
                                        disabled={!editMode}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        placeholder="เขียนอะไรบางอย่างเกี่ยวกับตัวคุณ..."
                                        rows={4}
                                        className={`${styles.textarea} ${
                                            editMode ? styles.inputEditable : styles.inputReadonly
                                        }`}
                                    />
                                </div>

                                {editMode && (
                                    <button 
                                        type="submit"
                                        disabled={saving}
                                        className={styles.saveButton}
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                                    </button>
                                )}
                            </form>
                        </section>
                    </div>

                    {/* ด้านขวา - สถิติ และ Setting */}
                    <div className={styles.sideColumn}>
                        {/* 3. ส่วนการจัดการบทความ (Stats) */}
                        <section className={styles.cardSection}>
                            <h2 className={styles.sectionTitleItalic}>กิจกรรมของคุณ</h2>
                            <div className={styles.statsCard}>
                                <div className={styles.statsValue}>{profileData?.articleCount || 0}</div>
                                <div className={styles.statsLabel}>บทความที่เขียนทั้งหมด</div>
                            </div>
                            <button 
                                onClick={() => navigate('/my-articles')}
                                className={styles.linkButton}
                            >
                                ดูบทความของฉันทั้งหมด
                            </button>
                        </section>

                        {/* 4. ส่วนการตั้งค่าและความปลอดภัย */}
                        <section className={styles.cardSection}>
                            <h2 className={styles.sectionTitleItalic}>ความปลอดภัย</h2>
                            <div className={styles.settingsList}>
                                <button className={styles.settingsButton}>
                                    <div className={styles.settingsButtonLabel}>
                                        <Key className={styles.settingsButtonIcon} />
                                        <span className="text-sm font-medium">เปลี่ยนรหัสผ่าน</span>
                                    </div>
                                    <Award className="w-4 h-4 text-gray-600 group-hover:text-brand-light transition-colors" />
                                </button>
                                
                                <button 
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
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
