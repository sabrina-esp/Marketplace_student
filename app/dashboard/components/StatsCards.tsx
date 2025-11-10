'use client';

import React from 'react';
import { Users, BookOpen, TrendingUp, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsCardsProps {
  calendarData: {
    totalStudents: number;
    activeCourses: number;
    totalRevenue: number;
    activeMentors: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ calendarData }) => {
  const mainStats = [
    { 
      title: 'Total Students', 
      value: calendarData.totalStudents.toLocaleString(), 
      change: '+12.5%', 
      trend: 'up',
      icon: <Users className="w-6 h-6" />, 
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Active learners',
      chart: [45, 52, 48, 65, 58, 70, 68, 75],
      chartColor: '#8b5cf6'
    },
    { 
      title: 'Active Courses', 
      value: calendarData.activeCourses.toString(), 
      change: '+8.2%', 
      trend: 'up',
      icon: <BookOpen className="w-6 h-6" />, 
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Live programs',
      chart: [35, 42, 38, 45, 48, 52, 50, 55],
      chartColor: '#3b82f6'
    },
    { 
      title: 'Total Revenue', 
      value: `$${calendarData.totalRevenue.toLocaleString()}`, 
      change: '+23.1%', 
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />, 
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: 'This month',
      chart: [40, 45, 50, 60, 65, 75, 80, 85],
      chartColor: '#10b981'
    },
    { 
      title: 'Active Mentors', 
      value: calendarData.activeMentors.toString(), 
      change: '+5.4%', 
      trend: 'up',
      icon: <Award className="w-6 h-6" />, 
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: 'Average score',
      chart: [30, 35, 32, 38, 40, 42, 41, 45],
      chartColor: '#f59e0b'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {mainStats.map((stat, index) => (
        <div 
          key={index} 
          className="relative bg-white rounded-3xl p-6 shadow-sm card-hover overflow-hidden group animate-fade-in-up"
          style={{animationDelay: `${index * 0.1}s`}}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${stat.lightBg} ${stat.textColor} text-sm font-bold`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
            </div>
            
            <div className="h-16 min-h-[64px]">
              <ResponsiveContainer width="100%" height={64}>
                <AreaChart data={stat.chart.map((val) => ({ value: val }))}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stat.chartColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={stat.chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={stat.chartColor} 
                    strokeWidth={2} 
                    fill={`url(#gradient-${index})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;