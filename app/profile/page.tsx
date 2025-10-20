'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaHistory, FaQuestionCircle, FaCog, FaUserPlus, FaSignOutAlt, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      // Rediriger vers login si pas connecté
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setLoading(false);
    } catch (error) {
      console.error('Erreur parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          fontSize: '24px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const bgColor = darkMode ? '#1a202c' : '#f7fafc';
  const cardBg = darkMode ? '#2d3748' : '#ffffff';
  const textColor = darkMode ? '#ffffff' : '#1a202c';
  const subTextColor = darkMode ? '#a0aec0' : '#718096';

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header avec boutons */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '15px',
            background: cardBg,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaArrowLeft size={20} color={textColor} />
        </button>

        <button
          onClick={toggleDarkMode}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '15px',
            background: '#ffa500',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,165,0,0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {darkMode ? <FaSun size={24} color="#fff" /> : <FaMoon size={24} color="#fff" />}
        </button>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Profile Header Card */}
        <div style={{
          background: cardBg,
          borderRadius: '25px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '20px',
          position: 'relative'
        }}>
          {/* Avatar avec badge étoile */}
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffa500 0%, #ff6b6b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              border: '5px solid ' + cardBg,
              boxShadow: '0 8px 20px rgba(255,165,0,0.3)'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            {/* Badge étoile */}
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffa500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid ' + cardBg,
              boxShadow: '0 4px 12px rgba(255,165,0,0.4)'
            }}>
              ⭐
            </div>
          </div>

          {/* Nom */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: textColor,
            marginBottom: '10px',
            marginTop: '10px'
          }}>
            {user.name}
          </h1>

          {/* Email avec icône */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: subTextColor,
            fontSize: '16px',
            marginBottom: '30px'
          }}>
            <FaEnvelope />
            <span>{user.email}</span>
          </div>

          {/* Bouton Upgrade to PRO */}
          <button style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255,165,0,0.4)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,165,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,165,0,0.4)';
          }}
          >
            Upgrade to PRO
          </button>
        </div>

        {/* Menu Items */}
        <div style={{
          background: cardBg,
          borderRadius: '25px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}>
          <MenuItem
            icon={<FaShieldAlt size={24} />}
            label="Privacy"
            onClick={() => router.push('/privacy')}
            textColor={textColor}
            darkMode={darkMode}
          />
          
          <MenuItem
            icon={<FaHistory size={24} />}
            label="Purchase History"
            onClick={() => router.push('/orders')}
            textColor={textColor}
            darkMode={darkMode}
          />
          
          <MenuItem
            icon={<FaQuestionCircle size={24} />}
            label="Help & Support"
            onClick={() => router.push('/support')}
            textColor={textColor}
            darkMode={darkMode}
          />
          
          <MenuItem
            icon={<FaCog size={24} />}
            label="Settings"
            onClick={() => router.push('/settings')}
            textColor={textColor}
            darkMode={darkMode}
          />
          
          <MenuItem
            icon={<FaUserPlus size={24} />}
            label="Invite a Friend"
            onClick={() => alert('Fonctionnalité à venir !')}
            textColor={textColor}
            darkMode={darkMode}
            showBorder={false}
          />
        </div>

        {/* Logout Button */}
        <div style={{
          background: cardBg,
          borderRadius: '25px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '18px',
              background: 'transparent',
              border: '2px solid #ef4444',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: '600'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaSignOutAlt size={20} />
            </div>
            <span style={{ flex: 1, textAlign: 'left' }}>Logout</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant MenuItem réutilisable
function MenuItem({ icon, label, onClick, textColor, darkMode, showBorder = true }: any) {
  return (
    <>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '18px',
          background: 'transparent',
          border: 'none',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: textColor,
          fontSize: '16px',
          fontWeight: '500'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{
          width: '45px',
          height: '45px',
          borderRadius: '12px',
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667eea'
        }}>
          {icon}
        </div>
        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        <span style={{ fontSize: '20px', color: '#a0aec0' }}>→</span>
      </button>
      {showBorder && (
        <div style={{
          height: '1px',
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          margin: '0 15px'
        }} />
      )}
    </>
  );
}