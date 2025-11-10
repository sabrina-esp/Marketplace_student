'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlusIcon, ShareIcon, ClipboardDocumentIcon, CheckCircleIcon,
  EnvelopeIcon, ChatBubbleLeftRightIcon, GiftIcon,
  MoonIcon, SunIcon, ArrowLeftIcon, SparklesIcon
} from '@heroicons/react/24/outline';

export default function InviteFriendPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Generate referral code based on user data
  const referralCode = user ? `${user.name.toUpperCase().replace(/\s+/g, '')}${user.id?.slice(-4) || '2024'}` : 'MARKETPLACE2024';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3011'}/register?ref=${referralCode}`;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }

    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Please login to send invitations' });
        return;
      }

      const response = await fetch('/api/invite/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '🎉 Invitation sent successfully!' });
        setEmail('');
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send invitation' });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setMessage({ type: 'error', text: 'Failed to send invitation. Please try again.' });
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Join me on this amazing learning platform! Use my referral link: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join me on Marketplace!');
    const body = encodeURIComponent(`Hey! I've been using this amazing learning platform and thought you might be interested.\n\nUse my referral link to get started: ${referralLink}\n\nHappy learning!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: isDarkMode ? '#0f1419' : 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #831843 100%)'
    }}>
      {/* Animated Background Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none perspective-1000">
        <div className="absolute top-20 left-10 animate-float opacity-30" style={{ animationDelay: '0s' }}>
          <UserPlusIcon className="w-24 h-24 text-purple-400" />
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
          <GiftIcon className="w-32 h-32 text-indigo-400" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float opacity-30" style={{ animationDelay: '2s' }}>
          <SparklesIcon className="w-20 h-20 text-purple-500" />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
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
            <ArrowLeftIcon className="w-6 h-6" />
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

        {/* Main Card */}
        <div 
          className={`transform overflow-hidden rounded-3xl shadow-2xl transition-all ${
            isDarkMode ? 'bg-[#0f1624]' : 'bg-white'
          }`}
          style={{
            boxShadow: isDarkMode 
              ? '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(59, 130, 246, 0.3)' 
              : '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(124, 58, 237, 0.5)'
          }}
        >
          {/* Header */}
          <div className="relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <div className="relative z-10">
              <UserPlusIcon className="w-16 h-16 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-extrabold text-white mb-2">Invite a Friend</h1>
              <p className="text-purple-100">Share the love of learning and earn rewards!</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8" style={{ background: isDarkMode ? '#1a1a2e' : 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
            {message.text && (
              <div className={`mb-6 p-5 rounded-2xl transform transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-lg' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 shadow-lg'
              }`}>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-semibold">{message.text}</p>
                </div>
              </div>
            )}

            {/* Rewards Info */}
            <div 
              className="p-6 rounded-2xl border-2 mb-8"
              style={{
                background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                  }}
                >
                  <GiftIcon className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Earn Rewards
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    When your friend signs up using your referral link, you both get 20% off your next course purchase!
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="mb-8">
              <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Your Referral Link
              </label>
              <div 
                className="p-4 rounded-2xl border-2 transition-all duration-300"
                style={{
                  background: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.08)' 
                    : 'rgba(139, 92, 246, 0.04)',
                  borderColor: isDarkMode 
                    ? 'rgba(139, 92, 246, 0.25)' 
                    : 'rgba(139, 92, 246, 0.15)'
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className={`flex-1 px-0 py-0 bg-transparent border-0 font-mono text-sm outline-none ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group ${
                      copied
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                        : 'text-white'
                    }`}
                    style={!copied ? {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
                    } : undefined}
                  >
                    {!copied && (
                      <>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                        <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                        }}></span>
                      </>
                    )}
                    {copied ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="relative w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Email Invite */}
            <div className="mb-8">
              <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Invite via Email
              </label>
              <form onSubmit={handleEmailInvite}>
                <div 
                  className="p-4 rounded-2xl border-2 transition-all duration-300"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(139, 92, 246, 0.08)' 
                      : 'rgba(139, 92, 246, 0.04)',
                    borderColor: isDarkMode 
                      ? 'rgba(139, 92, 246, 0.25)' 
                      : 'rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className={`w-5 h-5 flex-shrink-0 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className={`flex-1 px-0 py-0 bg-transparent border-0 outline-none placeholder:${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    />
                    <button
                      type="submit"
                      className="relative px-6 py-3 text-white rounded-xl font-bold transition-all duration-300 overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
                        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
                      }}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                      <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                      }}></span>
                      <span className="relative">Send Invite</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Share via Social Media
              </label>

              <button
                onClick={shareViaWhatsApp}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
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
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                  }}>
                    <ChatBubbleLeftRightIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Share via WhatsApp</span>
                </div>
                <ShareIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>

              <button
                onClick={shareViaEmail}
                className="w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] border-2 shadow-md hover:shadow-lg"
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
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                  }}>
                    <EnvelopeIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Share via Email</span>
                </div>
                <ShareIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </button>
            </div>
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

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
