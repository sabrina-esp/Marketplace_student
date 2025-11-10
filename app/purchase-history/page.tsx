'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClockIcon, ShoppingCartIcon, CheckCircleIcon, 
  AcademicCapIcon, CalendarIcon, CurrencyDollarIcon,
  MoonIcon, SunIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Purchase {
  id: string;
  courseName: string;
  instructor: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending';
}

export default function PurchaseHistoryPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    
    // Load purchase history (simulated - in production, fetch from API)
    const loadPurchases = () => {
      // Simulate API call
      setTimeout(() => {
        const mockPurchases: Purchase[] = [
          {
            id: '1',
            courseName: 'Advanced Web Development',
            instructor: 'John Doe',
            date: '2024-11-01',
            amount: 99.99,
            status: 'completed'
          },
          {
            id: '2',
            courseName: 'React & Next.js Masterclass',
            instructor: 'Jane Smith',
            date: '2024-10-15',
            amount: 149.99,
            status: 'completed'
          },
          {
            id: '3',
            courseName: 'UI/UX Design Fundamentals',
            instructor: 'Mike Johnson',
            date: '2024-09-20',
            amount: 79.99,
            status: 'completed'
          }
        ];
        setPurchases(mockPurchases);
        setLoading(false);
      }, 500);
    };
    
    loadPurchases();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: isDarkMode ? '#0f1419' : 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #831843 100%)'
    }}>
      {/* Animated Background Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none perspective-1000">
        <div className="absolute top-20 left-10 animate-float opacity-30" style={{ animationDelay: '0s' }}>
          <ShoppingCartIcon className="w-24 h-24 text-purple-400" />
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-30" style={{ animationDelay: '1s' }}>
          <AcademicCapIcon className="w-32 h-32 text-indigo-400" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float opacity-30" style={{ animationDelay: '2s' }}>
          <CurrencyDollarIcon className="w-20 h-20 text-purple-500" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
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
              <ClockIcon className="w-16 h-16 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-extrabold text-white mb-2">Purchase History</h1>
              <p className="text-purple-100">Track all your course purchases</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8" style={{ background: isDarkMode ? '#1a1a2e' : 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'
                }}
              >
                <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Total Courses</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{purchases.length}</p>
              </div>

              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'
                }}
              >
                <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Total Spent</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>${totalSpent.toFixed(2)}</p>
              </div>

              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'
                }}
              >
                <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Completed</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {purchases.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>

            {/* Purchase List */}
            <div className="space-y-4">
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Recent Purchases
              </h2>

              {purchases.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border-2 ${
                  isDarkMode ? 'bg-[#16213e] border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <ShoppingCartIcon className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No purchases yet
                  </p>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Start learning by purchasing your first course!
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
                    style={{
                      background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                      borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{
                              background: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)'
                            }}
                          >
                            <AcademicCapIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {purchase.courseName}
                            </h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              by {purchase.instructor}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(purchase.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              ${purchase.amount.toFixed(2)}
                            </span>
                          </div>

                          {purchase.status === 'completed' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-500">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => router.push('/dashboard')}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm hover:scale-105"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
