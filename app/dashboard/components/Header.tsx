'use client';

import React from 'react';
import { Search, Bell, Calendar, Download } from 'lucide-react';

interface HeaderProps {
  onCalendarClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCalendarClick }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 bg-white"
            />
          </div>
          <button className="p-2.5 hover:bg-white rounded-lg transition border border-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={onCalendarClick}
            className="p-2.5 hover:bg-white rounded-lg transition border border-gray-200 relative group"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse"></span>
          </button>
          <button className="px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;