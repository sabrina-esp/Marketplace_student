'use client';

import Link from 'next/link';
import { HeartIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/solid';

export default function MatchCard() {
  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Découvrir des Profils</h3>
              <p className="text-pink-100 text-sm">Trouve ton match parfait</p>
            </div>
          </div>
          <SparklesIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <UserGroupIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Profils actifs</span>
            </div>
            <p className="text-3xl font-bold">150+</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Tes matchs</span>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-white text-opacity-90 mb-6">
          Swipe à droite ❤️ pour liker, à gauche ❌ pour passer. 
          Trouve des personnes qui partagent tes passions et objectifs !
        </p>

        {/* CTA Button */}
        <Link href="/match">
          <button className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group">
            <HeartIcon className="w-5 h-5 group-hover:animate-bounce" />
            Commencer à Swiper
            <SparklesIcon className="w-5 h-5 group-hover:animate-spin" />
          </button>
        </Link>

        {/* Badge */}
        <div className="mt-4 flex justify-center">
          <div className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
            ✨ NOUVEAU ✨
          </div>
        </div>
      </div>
    </div>
  );
}
