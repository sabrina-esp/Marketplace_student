'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon, QuestionMarkCircleIcon,
  ChevronRightIcon, MoonIcon, SunIcon, PaperAirplaneIcon, XMarkIcon
} from '@heroicons/react/24/outline';

export default function HelpPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  const handleEmailSupport = () => {
    setShowEmailForm(true);
  };

  const handlePhoneSupport = () => {
    window.location.href = 'tel:+21655448132';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/help/send-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: '✅ Message sent successfully! We\'ll respond soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setShowEmailForm(false);
          setNotification(null);
        }, 2000);
      } else {
        setNotification({ type: 'error', message: data.error || '❌ Failed to send message' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: '❌ Network error. Please try again.' });
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
          Help & Support
        </h1>

        {/* Support Options */}
        <div className="space-y-3">
          {/* Email Support */}
          <button
            onClick={handleEmailSupport}
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
                  <EnvelopeIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Support</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>karouielyess@gmail.com</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>

          {/* Phone Support */}
          <button
            onClick={handlePhoneSupport}
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
                  <PhoneIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Phone Support</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>+216 55 448 132</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>

          {/* Live Chat */}
          <button
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
                  <ChatBubbleLeftRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live Chat</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chat with our team</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>

          {/* FAQ */}
          <button
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
                  <QuestionMarkCircleIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FAQ</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Common questions answered</p>
                </div>
              </div>
              <ChevronRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
          </button>
        </div>

        {/* Email Support Form Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className={`max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-slideUp ${
              isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{
                      background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'
                    }}>
                      <EnvelopeIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Support
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowEmailForm(false);
                      setNotification(null);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Notification */}
                {notification && (
                  <div className={`p-4 rounded-xl border-2 ${
                    notification.type === 'success'
                      ? isDarkMode ? 'bg-green-900/20 border-green-500' : 'bg-green-100 border-green-400'
                      : isDarkMode ? 'bg-red-900/20 border-red-500' : 'bg-red-100 border-red-400'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      notification.type === 'success'
                        ? isDarkMode ? 'text-green-400' : 'text-green-700'
                        : isDarkMode ? 'text-red-400' : 'text-red-700'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                    color: 'white'
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  We typically respond within 24 hours
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
