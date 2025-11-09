'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  UserCircleIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon,
  CameraIcon, PencilIcon, CheckCircleIcon, ArrowRightOnRectangleIcon,
  SparklesIcon, AcademicCapIcon, BookOpenIcon, UserIcon,
  ShieldCheckIcon, ClockIcon, QuestionMarkCircleIcon, Cog6ToothIcon,
  UserPlusIcon, ChevronRightIcon, MoonIcon, SunIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [focusedField, setFocusedField] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: '', phone: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);



  // Fonction utilitaire pour charger les données utilisateur
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); router.push('/'); return; }
      const response = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setFormData({ name: data.user.name || '', phone: data.user.phone || '', bio: data.user.bio || '' });
        setAvatarPreview(data.user.avatar || null);
      } else { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/'); }
    } catch (error) { console.error('Error:', error); router.push('/'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUserData(); }, []);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };



  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '🎉 Profile updated successfully!' });
        setUser(data.user);
        setIsEditing(false);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data.user }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '🎉 Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Password change failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 1MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile/upload-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: base64 }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage({ type: 'success', text: '🎉 Avatar updated!' });
          setUser(prev => prev ? { ...prev, avatar: base64 } : null);
        } else {
          setMessage({ type: 'error', text: 'Failed to upload avatar' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Error uploading avatar' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: isDarkMode ? '#0f1419' : 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #831843 100%)'
      }}>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: isDarkMode ? '#0f1419' : 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #831843 100%)'
    }}>
      {/* Animated 3D Icons in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none perspective-1000">
        <div className="absolute top-20 left-10 animate-float opacity-30" style={{ animationDelay: '0s' }}>
          <BookOpenIcon className="w-24 h-24 text-purple-400" style={{ transform: 'rotateY(20deg) rotateX(10deg)' }} />
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
          <AcademicCapIcon className="w-32 h-32 text-indigo-400" style={{ transform: 'rotateY(-20deg) rotateX(-10deg)' }} />
        </div>
        <div className="absolute bottom-32 left-32 animate-float opacity-30" style={{ animationDelay: '2s' }}>
          <SparklesIcon className="w-20 h-20 text-purple-500" style={{ transform: 'rotateY(15deg)' }} />
        </div>
        <div className="absolute bottom-20 right-40 animate-float opacity-30" style={{ animationDelay: '0.5s' }}>
          <BookOpenIcon className="w-28 h-28 text-blue-400" style={{ transform: 'rotateY(-25deg) rotateX(15deg)' }} />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float opacity-20" style={{ animationDelay: '1.5s' }}>
          <SparklesIcon className="w-16 h-16 text-purple-300" style={{ transform: 'rotateY(-10deg)' }} />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Dark Mode Toggle - Top Right */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-[#16213e] hover:bg-[#1e2d4f] text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-800 shadow-md'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-300" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        <div 
          className={`transform overflow-hidden rounded-3xl shadow-2xl transition-all relative ${
            isDarkMode ? 'bg-[#0f1624]' : 'bg-white'
          }`}
          style={{
            boxShadow: isDarkMode 
              ? '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(59, 130, 246, 0.3)' 
              : '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(124, 58, 237, 0.5)',
            transformStyle: 'preserve-3d',
            transform: 'perspective(1000px)'
          }}
        >
          {/* Animated Border Lines */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1 animate-border-horizontal">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 animate-border-horizontal-reverse">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full animate-border-vertical">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
            </div>
            <div className="absolute top-0 right-0 w-1 h-full animate-border-vertical-reverse">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
            </div>
          </div>
          
          {/* Header with gradient */}
          <div className="relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            {/* Animated rotating semicircles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -left-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate-reverse" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-4 border-white/30 rounded-full animate-rotate-slow" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full animate-particle-1"></div>
              <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-particle-2"></div>
              <div className="absolute bottom-6 left-16 w-2.5 h-2.5 bg-white/30 rounded-full animate-particle-3"></div>
              <div className="absolute bottom-10 right-8 w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-4"></div>
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/35 rounded-full animate-particle-5"></div>
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/45 rounded-full animate-particle-6"></div>
            </div>
            
            <div className="relative z-10">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white shadow-2xl overflow-hidden" style={{
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    animation: 'pulseGlow 2s ease-in-out infinite'
                  }}>
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" width={128} height={128} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 text-white text-5xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <CameraIcon className="w-5 h-5 text-purple-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                {user.name}
              </h2>
              <p className="text-purple-100 text-base mb-3">
                {user.email}
              </p>
              {user.isEmailVerified && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                  <CheckCircleIcon className="w-5 h-5" />
                  Verified Account
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8" style={{ background: isDarkMode ? '#1a1a2e' : 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
            {message.text && (
              <div className={`mb-6 p-5 rounded-2xl transform transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-lg' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 shadow-lg'
              }`} style={{
                animation: 'fadeInUp 0.5s ease-out'
              }}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' && <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />}
                  <p className="text-sm font-semibold">{message.text}</p>
                </div>
              </div>
            )}

            {/* Menu Options */}
            <div className="space-y-3 mb-8">
              {/* Privacy */}
              <button
                onClick={() => router.push('/privacy')}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'rgba(139, 92, 246, 0.25)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                  }}>
                    <ShieldCheckIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Privacy</span>
                </div>
                <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              {/* Purchase History */}
              <button
                onClick={() => router.push('/purchase-history')}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'rgba(139, 92, 246, 0.25)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                  }}>
                    <ClockIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Purchase History</span>
                </div>
                <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              {/* Help & Support */}
              <button
                onClick={() => router.push('/help')}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'rgba(139, 92, 246, 0.25)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                  }}>
                    <QuestionMarkCircleIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Help & Support</span>
                </div>
                <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              {/* Settings with Dark Mode Toggle */}
              <button
                onClick={() => router.push('/settings')}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'rgba(139, 92, 246, 0.25)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                  }}>
                    <Cog6ToothIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Settings</span>
                </div>
                <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              {/* Invite a Friend */}
              <button
                onClick={() => router.push('/invite')}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.3)' 
                    : 'rgba(139, 92, 246, 0.25)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'rgba(139, 92, 246, 0.15)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(139, 92, 246, 0.3)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                  }}>
                    <UserPlusIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Invite a Friend</span>
                </div>
                <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
                style={{
                  background: isDarkMode 
                    ? 'rgba(220, 38, 38, 0.1)' 
                    : 'rgba(220, 38, 38, 0.05)',
                  borderColor: isDarkMode 
                    ? 'rgba(220, 38, 38, 0.3)' 
                    : 'rgba(220, 38, 38, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(220, 38, 38, 0.2)' 
                    : 'rgba(220, 38, 38, 0.1)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(220, 38, 38, 0.5)' 
                    : 'rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(220, 38, 38, 0.1)' 
                    : 'rgba(220, 38, 38, 0.05)';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(220, 38, 38, 0.3)' 
                    : 'rgba(220, 38, 38, 0.2)';
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)'
                  }}>
                    <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-lg font-semibold text-red-600">Logout</span>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-red-500" />
              </button>
            </div>

            {/* Profile Information Section - Collapsed by default */}
            {(isEditing || isChangingPassword) && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <UserCircleIcon className="w-6 h-6 text-purple-600" />
                      Profile Information
                    </h3>
                    {!isEditing && !isChangingPassword && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="group">
                        <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                        <div className="relative">
                          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'name' ? 'scale-110' : ''}`}>
                            <UserIcon className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-purple-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          </div>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md ${
                              isDarkMode 
                                ? 'bg-[#16213e] border-gray-700 text-white' 
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                            placeholder="Your name"
                            required
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                        <div className="relative">
                          <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'phone' ? 'scale-110' : ''}`}>
                            <PhoneIcon className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md ${
                              isDarkMode 
                                ? 'bg-[#16213e] border-gray-700 text-white' 
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                            placeholder="+216 XX XXX XXX"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          onFocus={() => setFocusedField('bio')}
                          onBlur={() => setFocusedField('')}
                          rows={4}
                          maxLength={500}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md resize-none ${
                            isDarkMode 
                              ? 'bg-[#16213e] border-gray-700 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formData.bio.length}/500 characters</p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-5 h-5" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name,
                              phone: user.phone || '',
                              bio: user.bio || '',
                            });
                          }}
                          className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border-2 ${
                        isDarkMode 
                          ? 'bg-[#16213e] border-purple-900/50' 
                          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100'
                      }`}>
                        <p className="text-sm font-medium text-purple-600">Full Name</p>
                        <p className={`text-lg mt-1 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                      </div>

                      <div className={`p-4 rounded-2xl border-2 ${
                        isDarkMode 
                          ? 'bg-[#16213e] border-blue-900/50' 
                          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100'
                      }`}>
                        <p className="text-sm font-medium text-blue-600">Phone Number</p>
                        <p className={`text-lg mt-1 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.phone || 'Not provided'}</p>
                      </div>

                      <div className={`p-4 rounded-2xl border-2 ${
                        isDarkMode 
                          ? 'bg-[#16213e] border-indigo-900/50' 
                          : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100'
                      }`}>
                        <p className="text-sm font-medium text-indigo-600">Bio</p>
                        <p className={`text-lg mt-1 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.bio || 'No bio yet'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Section */}
                {!isEditing && (
                  <div className="mb-8 pt-8 border-t-2" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        <LockClosedIcon className="w-6 h-6 text-indigo-600" />
                        Security
                      </h3>
                      {!isChangingPassword && (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                        >
                          Change Password
                        </button>
                      )}
                    </div>

                    {isChangingPassword ? (
                      <form onSubmit={handleChangePassword} className="space-y-5">
                        <div className="group">
                          <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                          <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'currentPassword' ? 'scale-110' : ''}`}>
                              <LockClosedIcon className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'currentPassword' ? 'text-indigo-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              onFocus={() => setFocusedField('currentPassword')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md ${
                                isDarkMode 
                                  ? 'bg-[#16213e] border-gray-700 text-white' 
                                  : 'bg-white border-gray-200 text-gray-900'
                              }`}
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                          <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'newPassword' ? 'scale-110' : ''}`}>
                              <LockClosedIcon className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'newPassword' ? 'text-purple-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              onFocus={() => setFocusedField('newPassword')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md ${
                                isDarkMode 
                                  ? 'bg-[#16213e] border-gray-700 text-white' 
                                  : 'bg-white border-gray-200 text-gray-900'
                              }`}
                              placeholder="••••••••"
                              required
                              minLength={6}
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                          <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-110' : ''}`}>
                              <LockClosedIcon className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-600' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              onFocus={() => setFocusedField('confirmPassword')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none font-medium shadow-sm hover:shadow-md ${
                                isDarkMode 
                                  ? 'bg-[#16213e] border-gray-700 text-white' 
                                  : 'bg-white border-gray-200 text-gray-900'
                              }`}
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                          >
                            {saving ? 'Changing...' : 'Update Password'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                              isDarkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className={`p-4 rounded-2xl border-2 ${
                        isDarkMode 
                          ? 'bg-[#16213e] border-gray-700' 
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100'
                      }`}>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Password is encrypted and secure</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 10px 60px rgba(124, 58, 237, 0.6);
          }
        }

        @keyframes border-horizontal {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes border-horizontal-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes border-vertical {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes border-vertical-reverse {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        @keyframes particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          50% {
            transform: translate(10px, -10px);
            opacity: 1;
          }
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-border-horizontal {
          animation: border-horizontal 3s linear infinite;
        }

        .animate-border-horizontal-reverse {
          animation: border-horizontal-reverse 3s linear infinite;
        }

        .animate-border-vertical {
          animation: border-vertical 3s linear infinite;
        }

        .animate-border-vertical-reverse {
          animation: border-vertical-reverse 3s linear infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }

        .animate-rotate-reverse {
          animation: rotate-reverse 20s linear infinite;
        }

        .animate-particle-1 {
          animation: particle 4s ease-in-out infinite;
        }

        .animate-particle-2 {
          animation: particle 5s ease-in-out infinite;
        }

        .animate-particle-3 {
          animation: particle 6s ease-in-out infinite;
        }

        .animate-particle-4 {
          animation: particle 4.5s ease-in-out infinite;
        }

        .animate-particle-5 {
          animation: particle 5.5s ease-in-out infinite;
        }

        .animate-particle-6 {
          animation: particle 3.5s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
