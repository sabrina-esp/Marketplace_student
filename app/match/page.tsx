'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon as HeartIconSolid, 
  XMarkIcon,
  SparklesIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';

interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string | null;
  createdAt: string;
  compatibilityScore?: number;
  matchReason?: string;
  subjects?: string[];
  interests?: string[];
  level?: string;
}

interface Match {
  matchId: string;
  matchedAt: string;
  user: Profile;
}

interface SwipeState {
  swiping: boolean;
  direction: 'left' | 'right' | null;
  offset: number;
}

export default function MatchPage() {
  const router = useRouter();
  const [potentials, setPotentials] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatch, setLastMatch] = useState<Profile | null>(null);
  const [view, setView] = useState<'swipe' | 'matches'>('swipe');
  
  // Swipe animation state
  const [swipeState, setSwipeState] = useState<SwipeState>({
    swiping: false,
    direction: null,
    offset: 0
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  useEffect(() => {
    loadPotentials();
    loadMatches();
  }, []);

  const loadPotentials = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('/api/match/potentials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPotentials(data.potentials);
      }
    } catch (error) {
      console.error('Error loading potentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/match/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  // Touch/Mouse handlers for swipe gesture
  const handleStart = (clientX: number) => {
    startXRef.current = clientX;
    setSwipeState({ swiping: true, direction: null, offset: 0 });
  };

  const handleMove = (clientX: number) => {
    if (!swipeState.swiping) return;
    
    const diff = clientX - startXRef.current;
    const direction = diff > 0 ? 'right' : 'left';
    
    setSwipeState({
      swiping: true,
      direction,
      offset: diff
    });
  };

  const handleEnd = () => {
    const threshold = 100; // pixels to trigger swipe
    
    if (Math.abs(swipeState.offset) > threshold) {
      // Trigger swipe action
      const action = swipeState.direction === 'right' ? 'like' : 'dislike';
      animateSwipeOut(swipeState.direction!, action);
    } else {
      // Reset card position
      setSwipeState({ swiping: false, direction: null, offset: 0 });
    }
  };

  const animateSwipeOut = async (direction: 'left' | 'right', action: 'like' | 'dislike') => {
    // Animate card flying off screen
    setSwipeState({
      swiping: true,
      direction,
      offset: direction === 'right' ? 1000 : -1000
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Process the swipe
    await handleSwipe(action);

    // Reset for next card
    setSwipeState({ swiping: false, direction: null, offset: 0 });
  };

  const handleSwipe = async (action: 'like' | 'dislike') => {
    if (swiping || currentIndex >= potentials.length) return;

    setSwiping(true);
    const currentProfile = potentials[currentIndex];

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/match/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId: currentProfile.id,
          action: action
        })
      });

      const data = await response.json();
      
      if (data.success && data.isMatch) {
        setLastMatch(currentProfile);
        setShowMatchModal(true);
        loadMatches(); // Reload matches list
        setTimeout(() => setShowMatchModal(false), 3000);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    } finally {
      setSwiping(false);
    }
  };

  const handleButtonSwipe = (action: 'like' | 'dislike') => {
    const direction = action === 'like' ? 'right' : 'left';
    animateSwipeOut(direction, action);
  };

  const currentProfile = potentials[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            💖 Match
          </h1>
          <button
            onClick={() => setView(view === 'swipe' ? 'matches' : 'swipe')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
          >
            {view === 'swipe' ? `Matchs (${matches.length})` : 'Découvrir'}
          </button>
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && lastMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center animate-scaleIn">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-purple-600 mb-2">
              Cest un Match !
            </h2>
            <p className="text-gray-600 mb-4">
              Vous et <strong>{lastMatch.name}</strong> vous êtes likés mutuellement
            </p>
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mb-4">
              {lastMatch.avatar ? (
                <img src={lastMatch.avatar} alt={lastMatch.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-full h-full text-white" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-md mx-auto pb-32">
        {view === 'swipe' ? (
          <>
            {/* Swipe View */}
            {currentIndex < potentials.length ? (
              <div className="relative mb-8">
                {/* Stack of cards (show next 2 cards behind) */}
                <div className="relative">
                  {/* Background cards for depth effect */}
                  {potentials.slice(currentIndex + 1, currentIndex + 3).map((profile, index) => (
                    <div
                      key={profile.id}
                      className="absolute top-0 left-0 right-0 bg-white rounded-3xl shadow-xl"
                      style={{
                        transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * -10}px)`,
                        zIndex: -index - 1,
                        opacity: 1 - (index + 1) * 0.3
                      }}
                    >
                      <div className="h-80" />
                      <div className="h-28" />
                    </div>
                  ))}

                  {/* Main Card with swipe gestures */}
                  <div
                    ref={cardRef}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing relative"
                    style={{
                      transform: `translateX(${swipeState.offset}px) rotate(${swipeState.offset * 0.03}deg)`,
                      transition: swipeState.swiping && swipeState.offset === 0 ? 'none' : 'transform 0.3s ease-out',
                      zIndex: 10
                    }}
                    onMouseDown={(e) => handleStart(e.clientX)}
                    onMouseMove={(e) => swipeState.swiping && handleMove(e.clientX)}
                    onMouseUp={handleEnd}
                    onMouseLeave={() => swipeState.swiping && handleEnd()}
                    onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                    onTouchMove={(e) => swipeState.swiping && handleMove(e.touches[0].clientX)}
                    onTouchEnd={handleEnd}
                  >
                    {/* Like/Nope Overlay */}
                    {swipeState.offset !== 0 && (
                      <>
                        {swipeState.direction === 'right' && (
                          <div 
                            className="absolute top-12 left-12 z-20 transform rotate-[-20deg]"
                            style={{ opacity: Math.min(Math.abs(swipeState.offset) / 100, 1) }}
                          >
                            <div className="border-4 border-green-500 text-green-500 text-5xl font-bold px-6 py-3 rounded-xl">
                              LIKE
                            </div>
                          </div>
                        )}
                        {swipeState.direction === 'left' && (
                          <div 
                            className="absolute top-12 right-12 z-20 transform rotate-[20deg]"
                            style={{ opacity: Math.min(Math.abs(swipeState.offset) / 100, 1) }}
                          >
                            <div className="border-4 border-red-500 text-red-500 text-5xl font-bold px-6 py-3 rounded-xl">
                              NOPE
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Profile Image */}
                    <div className="relative h-80 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
                      {currentProfile.avatar ? (
                        <img 
                          src={currentProfile.avatar} 
                          alt={currentProfile.name}
                          className="w-full h-full object-cover"
                          draggable="false"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${currentProfile.avatar ? 'hidden' : ''}`}>
                        <UserCircleIcon className="w-48 h-48 text-white opacity-50" />
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      {/* Profile Info on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-3xl font-bold">
                            {currentProfile.name}
                          </h2>
                          {currentProfile.compatibilityScore !== undefined && (
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-4 py-2 flex items-center gap-1.5 shadow-lg border-2 border-white/30">
                              <SparklesIcon className="w-5 h-5 text-white" />
                              <span className="text-white font-black text-lg">
                                {currentProfile.compatibilityScore}%
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm opacity-90">
                          {currentProfile.email}
                        </p>
                        {currentProfile.level && (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                            {currentProfile.level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Match Reason */}
                    {currentProfile.matchReason && (
                      <div className="px-6 pt-4 pb-2">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border-2 border-purple-200">
                          <p className="text-sm text-purple-900 font-bold flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-600" />
                            🤖 {currentProfile.matchReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bio Section */}
                    <div className="px-6 pb-2 pt-2">
                      <div className="flex items-start gap-2">
                        <SparklesIcon className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">Bio</h3>
                          <p className="text-gray-600 text-sm">
                            {currentProfile.bio}
                          </p>
                          
                          {/* Subjects */}
                          {currentProfile.subjects && currentProfile.subjects.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Sujets:</p>
                              <div className="flex flex-wrap gap-1">
                                {currentProfile.subjects.slice(0, 5).map((subject, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interests */}
                          {currentProfile.interests && currentProfile.interests.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Intérêts:</p>
                              <div className="flex flex-wrap gap-1">
                                {currentProfile.interests.slice(0, 5).map((interest, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Inside card at bottom */}
                    <div className="px-6 pb-6 pt-4">
                      <div className="flex justify-center gap-8">
                        {/* Dislike Button */}
                        <button
                          onClick={() => handleButtonSwipe('dislike')}
                          disabled={swiping}
                          className="w-20 h-20 rounded-full bg-white shadow-2xl border-[3px] border-red-400 flex items-center justify-center hover:scale-110 hover:border-red-500 hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50 group"
                        >
                          <XMarkIcon className="w-11 h-11 text-red-500 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Like Button */}
                        <button
                          onClick={() => handleButtonSwipe('like')}
                          disabled={swiping}
                          className="w-20 h-20 rounded-full bg-white shadow-2xl border-[3px] border-pink-400 flex items-center justify-center hover:scale-110 hover:border-pink-500 hover:bg-pink-50 active:scale-95 transition-all disabled:opacity-50 group"
                        >
                          <HeartIconSolid className="w-11 h-11 text-pink-500 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <div className="text-center mt-6">
                  <p className="text-gray-600 font-semibold">
                    {currentIndex + 1} / {potentials.length}
                  </p>
                </div>
              </div>
            ) : (
              /* No More Profiles */
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Plus de profils disponibles
                </h2>
                <p className="text-gray-600 mb-6">
                  Revenez plus tard pour découvrir de nouveaux profils !
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Retour au Dashboard
                </button>
              </div>
            )}
          </>
        ) : (
          /* Matches View */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Vos Matchs ({matches.length})
            </h2>
            
            {matches.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun match pour le moment
                </h3>
                <p className="text-gray-600">
                  Commencez à liker des profils pour trouver vos matchs !
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <div 
                  key={match.matchId}
                  className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-all cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                    {match.user.avatar ? (
                      <img 
                        src={match.user.avatar} 
                        alt={match.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-full h-full text-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">
                      {match.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {match.user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Match le {new Date(match.matchedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      💖 Match
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            transform: scale(0.8);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        /* Disable text selection during drag */
        .cursor-grabbing * {
          user-select: none;
          -webkit-user-select: none;
        }

        /* Smooth card transitions */
        .card-transition {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
