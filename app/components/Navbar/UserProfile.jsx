'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        console.log('✅ User chargé dans UserProfile:', JSON.parse(userData));
      } catch (error) {
        console.error('❌ Erreur parsing user data:', error);
      }
    }

    // Écouter les changements de localStorage (quand l'utilisateur se connecte/déconnecte)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'event listener
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
    }
  };

  // Si pas d'utilisateur connecté, ne rien afficher
  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-purple">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple to-pink-600 flex items-center justify-center text-white font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* User Info - Caché sur mobile */}
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-gray-900">
              {user.name || 'User'}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[150px]">
              {user.email}
            </div>
          </div>

          {/* Chevron - Icône de dropdown */}
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      {/* Dropdown Menu avec animation */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          {/* Header avec gradient et avatar */}
          <div className="bg-gradient-to-r from-purple to-pink-600 px-6 py-5 text-white">
            <div className="flex justify-center mb-3">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-purple font-bold text-2xl shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{user.name || 'User'}</div>
              <div className="text-sm opacity-90 truncate">{user.email}</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Mon Profil */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => {
                    router.push('/profile');
                  }}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors`}
                >
                  <span className="mr-3 text-xl">👤</span>
                  <span className="font-medium">Mon Profil</span>
                </button>
              )}
            </Menu.Item>

            {/* Paramètres */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => router.push('/settings')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors`}
                >
                  <span className="mr-3 text-xl">⚙️</span>
                  <span className="font-medium">Paramètres</span>
                </button>
              )}
            </Menu.Item>

            {/* Mes Commandes */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => router.push('/orders')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors`}
                >
                  <span className="mr-3 text-xl">🛍️</span>
                  <span className="font-medium">Mes Commandes</span>
                </button>
              )}
            </Menu.Item>

            {/* Mes Cours */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={() => router.push('/my-courses')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors`}
                >
                  <span className="mr-3 text-xl">📚</span>
                  <span className="font-medium">Mes Cours</span>
                </button>
              )}
            </Menu.Item>

            {/* Divider */}
            <div className="my-2 h-px bg-gray-200" />

            {/* Déconnexion */}
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-red-50' : ''
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm text-red-600 transition-colors`}
                >
                  <span className="mr-3 text-xl">🚪</span>
                  <span className="font-medium">Déconnexion</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}