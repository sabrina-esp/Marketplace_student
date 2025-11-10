'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BellIcon, EnvelopeIcon, GlobeAltIcon, ChevronRightIcon, MoonIcon, SunIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState('Français');
  const [loading, setLoading] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  // Push notification preferences
  const [pushPreferences, setPushPreferences] = useState({
    newCourses: true,
    promotions: true,
    messages: false,
    updates: true,
    reminders: true
  });

  // Email notification preferences  
  const [emailPreferences, setEmailPreferences] = useState({
    newsletter: false,
    courseUpdates: true,
    promotions: false,
    frequency: 'daily' // immediate, daily, weekly
  });

  const router = useRouter();

  const availableLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    loadSettings();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPushNotifications(data.settings?.pushNotifications ?? true);
          setEmailNotifications(data.settings?.emailNotifications ?? false);
          setLanguage(data.settings?.language ?? 'Français');
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePush = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    updateSetting('pushNotifications', newValue);
  };

  const handleToggleEmail = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    updateSetting('emailNotifications', newValue);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    await updateSetting('language', newLanguage);
    setShowLanguageDialog(false);
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
          Settings
        </h1>

        {/* Settings Options */}
        <div className="space-y-3">
          {/* Push Notifications */}
          <button
            onClick={() => setShowPushDialog(true)}
            className="w-full p-4 rounded-2xl transition-all duration-300 border-2 shadow-md cursor-pointer hover:scale-[1.02]"
            style={{
              background: isDarkMode 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(139, 92, 246, 0.15)',
              borderColor: isDarkMode 
                ? 'rgba(139, 92, 246, 0.4)' 
                : 'rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                }}>
                  <BellIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pushNotifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </button>

          {/* Email Notifications */}
          <button
            onClick={() => setShowEmailDialog(true)}
            className="w-full p-4 rounded-2xl transition-all duration-300 border-2 shadow-md cursor-pointer hover:scale-[1.02]"
            style={{
              background: isDarkMode 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(139, 92, 246, 0.15)',
              borderColor: isDarkMode 
                ? 'rgba(139, 92, 246, 0.4)' 
                : 'rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                }}>
                  <EnvelopeIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {emailNotifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </button>

          {/* Language */}
          <button
            onClick={() => setShowLanguageDialog(true)}
            className="w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'
                }}>
                  <GlobeAltIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language}</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>
        </div>

        {/* Language Selection Dialog */}
        {showLanguageDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className={`max-w-md w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-slideUp ${
              isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Select Language
                  </h3>
                  <button
                    onClick={() => setShowLanguageDialog(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Language Options */}
              <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.name)}
                    disabled={loading}
                    className={`w-full p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 flex items-center justify-between ${
                      language === lang.name
                        ? isDarkMode
                          ? 'bg-purple-600/20 border-purple-500'
                          : 'bg-purple-100 border-purple-400'
                        : isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.name && (
                      <CheckIcon className="w-6 h-6 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Push Notifications Dialog */}
        {showPushDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className={`max-w-md w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-slideUp ${
              isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Push Notifications
                  </h3>
                  <button
                    onClick={() => setShowPushDialog(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Push Notification Options */}
              <div className="p-6 space-y-3">
                {/* New Courses */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  pushPreferences.newCourses
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    New Courses
                  </span>
                  <input
                    type="checkbox"
                    checked={pushPreferences.newCourses}
                    onChange={(e) => setPushPreferences({...pushPreferences, newCourses: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Promotions */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  pushPreferences.promotions
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Promotions
                  </span>
                  <input
                    type="checkbox"
                    checked={pushPreferences.promotions}
                    onChange={(e) => setPushPreferences({...pushPreferences, promotions: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Messages */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  pushPreferences.messages
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Messages
                  </span>
                  <input
                    type="checkbox"
                    checked={pushPreferences.messages}
                    onChange={(e) => setPushPreferences({...pushPreferences, messages: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Updates */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  pushPreferences.updates
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Updates
                  </span>
                  <input
                    type="checkbox"
                    checked={pushPreferences.updates}
                    onChange={(e) => setPushPreferences({...pushPreferences, updates: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Reminders */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  pushPreferences.reminders
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Reminders
                  </span>
                  <input
                    type="checkbox"
                    checked={pushPreferences.reminders}
                    onChange={(e) => setPushPreferences({...pushPreferences, reminders: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Save Button */}
                <button
                  onClick={() => {
                    updateSetting('pushPreferences', pushPreferences);
                    const anyEnabled = Object.values(pushPreferences).some(v => v);
                    setPushNotifications(anyEnabled);
                    setShowPushDialog(false);
                  }}
                  disabled={loading}
                  className="w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                    color: 'white'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Notifications Dialog */}
        {showEmailDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className={`max-w-md w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-slideUp ${
              isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email Notifications
                  </h3>
                  <button
                    onClick={() => setShowEmailDialog(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Email Notification Options */}
              <div className="p-6 space-y-3">
                {/* Newsletter */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  emailPreferences.newsletter
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Newsletter
                  </span>
                  <input
                    type="checkbox"
                    checked={emailPreferences.newsletter}
                    onChange={(e) => setEmailPreferences({...emailPreferences, newsletter: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Course Updates */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  emailPreferences.courseUpdates
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Course Updates
                  </span>
                  <input
                    type="checkbox"
                    checked={emailPreferences.courseUpdates}
                    onChange={(e) => setEmailPreferences({...emailPreferences, courseUpdates: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Promotions */}
                <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  emailPreferences.promotions
                    ? isDarkMode ? 'bg-purple-600/20 border-purple-500' : 'bg-purple-100 border-purple-400'
                    : isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Promotions
                  </span>
                  <input
                    type="checkbox"
                    checked={emailPreferences.promotions}
                    onChange={(e) => setEmailPreferences({...emailPreferences, promotions: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Frequency Selector */}
                <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Email Frequency
                  </p>
                  <div className="space-y-2">
                    {['immediate', 'daily', 'weekly'].map((freq) => (
                      <label key={freq} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        emailPreferences.frequency === freq
                          ? isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'
                          : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={emailPreferences.frequency === freq}
                          onChange={(e) => setEmailPreferences({...emailPreferences, frequency: e.target.value as 'immediate' | 'daily' | 'weekly'})}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {freq}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => {
                    updateSetting('emailPreferences', emailPreferences);
                    const anyEnabled = emailPreferences.newsletter || emailPreferences.courseUpdates || emailPreferences.promotions;
                    setEmailNotifications(anyEnabled);
                    setShowEmailDialog(false);
                  }}
                  disabled={loading}
                  className="w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                    color: 'white'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
