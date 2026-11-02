'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon, LockClosedIcon, EyeIcon, BellIcon, TrashIcon,
  ChevronRightIcon, MoonIcon, SunIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [privacyNotifications, setPrivacyNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  // Password change email
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    loadPrivacySettings();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const loadPrivacySettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/privacy/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfileVisibility(data.settings?.profileVisibility ?? true);
          setPrivacyNotifications(data.settings?.privacyNotifications ?? false);
        }
      }

      // Load user email
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success) {
          setUserEmail(userData.user.email);
        }
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const handleToggleVisibility = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/privacy/update-visibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileVisibility: !profileVisibility })
      });

      if (response.ok) {
        setProfileVisibility(!profileVisibility);
        setMessage({ type: 'success', text: '✅ Profile visibility updated!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      setMessage({ type: 'error', text: '❌ Failed to update visibility' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `📧 Password reset link sent to ${userEmail}. Please check your email.` 
        });
        setShowPasswordDialog(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: data.message || '❌ Failed to send reset email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error sending reset email' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/privacy/update-notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ privacyNotifications: !privacyNotifications })
      });

      if (response.ok) {
        setPrivacyNotifications(!privacyNotifications);
        setMessage({ type: 'success', text: '✅ Notification settings updated!' });
        setShowNotificationsDialog(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      setMessage({ type: 'error', text: '❌ Failed to update notifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage({ type: 'success', text: '👋 Account deleted successfully' });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || '❌ Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error deleting account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: isDarkMode ? '#0f1419' : 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)'
    }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
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

        {/* Title */}
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Privacy Settings
        </h1>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? isDarkMode ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-50 text-green-800 border border-green-200'
              : isDarkMode ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Privacy Options */}
        <div className="space-y-3">
          {/* Change Password */}
          <button
            onClick={() => setShowPasswordDialog(true)}
            className="w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
            style={{
              background: isDarkMode 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(139, 92, 246, 0.04)',
              borderColor: isDarkMode 
                ? 'rgba(139, 92, 246, 0.25)' 
                : 'rgba(139, 92, 246, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(139, 92, 246, 0.15)' 
                : 'rgba(139, 92, 246, 0.08)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? 'rgba(139, 92, 246, 0.4)' 
                : 'rgba(139, 92, 246, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(139, 92, 246, 0.04)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? 'rgba(139, 92, 246, 0.25)' 
                : 'rgba(139, 92, 246, 0.15)';
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                }}>
                  <LockClosedIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your password</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>

          {/* Profile Visibility */}
          <div
            className="w-full p-4 rounded-2xl transition-all duration-300 border-2 shadow-md"
            style={{
              background: isDarkMode 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(139, 92, 246, 0.04)',
              borderColor: isDarkMode 
                ? 'rgba(139, 92, 246, 0.25)' 
                : 'rgba(139, 92, 246, 0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                }}>
                  <EyeIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Visibility</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Control who can see your profile</p>
                </div>
              </div>
              <button
                onClick={handleToggleVisibility}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileVisibility ? 'bg-orange-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileVisibility ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy Notifications */}
          <button
            onClick={() => setShowNotificationsDialog(true)}
            className="w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
            style={{
              background: isDarkMode 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(139, 92, 246, 0.04)',
              borderColor: isDarkMode 
                ? 'rgba(139, 92, 246, 0.25)' 
                : 'rgba(139, 92, 246, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(139, 92, 246, 0.15)' 
                : 'rgba(139, 92, 246, 0.08)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? 'rgba(139, 92, 246, 0.4)' 
                : 'rgba(139, 92, 246, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(139, 92, 246, 0.04)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? 'rgba(139, 92, 246, 0.25)' 
                : 'rgba(139, 92, 246, 0.15)';
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                }}>
                  <BellIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Notifications</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get alerts about privacy changes</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>

          {/* Delete Account */}
          <div className="mt-8">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)'
                  }}>
                    <TrashIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-600">Delete Account</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permanently delete your account</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-red-500" />
              </div>
            </button>
          </div>
        </div>

        {/* Change Password Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className={`max-w-md w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-slideUp ${
              isDarkMode ? 'bg-gradient-to-br from-[#1a1f3a] via-[#16213e] to-[#0f1624]' : 'bg-gradient-to-br from-white via-purple-50 to-indigo-50'
            }`} style={{
              boxShadow: isDarkMode 
                ? '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 80px rgba(124, 58, 237, 0.3)' 
                : '0 20px 60px rgba(124, 58, 237, 0.4), 0 0 100px rgba(99, 102, 241, 0.2)'
            }}>
              {/* Header with gradient */}
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <LockClosedIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Change Password</h3>
                    </div>
                    <p className="text-purple-100 text-sm">
                      We&apos;ll send you a secure reset link via email
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordDialog(false)} 
                    className="p-2 rounded-full hover:bg-white/20 transition-all"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      📧 Your Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all ${
                          isDarkMode 
                            ? 'bg-[#0f1624] border-purple-900/50 text-white shadow-inner' 
                            : 'bg-white border-purple-200 text-gray-700 shadow-md'
                        }`}
                        style={{
                          boxShadow: isDarkMode 
                            ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' 
                            : 'inset 0 2px 4px rgba(124, 58, 237, 0.1)'
                        }}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                          <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs mt-2 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ✉️ A password reset link will be sent to this email address
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 text-white rounded-2xl font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.9) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(124, 58, 237, 0.8) 100%)',
                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35), 0 4px 12px rgba(124, 58, 237, 0.25)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 1) 0%, rgba(139, 92, 246, 0.95) 50%, rgba(124, 58, 237, 0.9) 100%)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.45), 0 6px 16px rgba(124, 58, 237, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.9) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(124, 58, 237, 0.8) 100%)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.35), 0 4px 12px rgba(124, 58, 237, 0.25)';
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Send Reset Link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordDialog(false)}
                      className={`px-6 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className={`mt-6 p-5 rounded-2xl border-2 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/50' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                }`}>
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-800/30' : 'bg-blue-200'}`}>
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        💡 How it works
                      </p>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        You&apos;ll receive an email with a secure link to reset your password. The link will expire in 1 hour for security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notifications Dialog */}
        {showNotificationsDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-2xl p-6 ${
              isDarkMode ? 'bg-[#16213e]' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Notifications</h3>
                <button onClick={() => setShowNotificationsDialog(false)} className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get notified when there are important changes to your privacy settings or when someone tries to access your account.
              </p>
              
              <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#0f1624]' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Alerts</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {privacyNotifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacyNotifications ? 'bg-orange-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacyNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowNotificationsDialog(false)}
                className={`w-full py-3 rounded-xl font-semibold ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Account Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-2xl p-6 ${
              isDarkMode ? 'bg-[#16213e]' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Account</h3>
                </div>
                <button onClick={() => setShowDeleteDialog(false)} className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-red-900/20 border border-red-900/50' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>⚠️ Warning: This action cannot be undone!</p>
                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  Deleting your account will permanently remove:
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  <li>• All your personal information</li>
                  <li>• Your profile and settings</li>
                  <li>• All your data and activity</li>
                  <li>• Access to your courses and purchases</li>
                </ul>
              </div>
              
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you absolutely sure you want to delete your account?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
