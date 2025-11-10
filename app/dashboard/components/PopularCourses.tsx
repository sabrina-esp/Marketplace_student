'use client';

import React, { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PopularCourses = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const popularCourses = [
    { name: 'Mobile Dev', students: 2456, color: '#8b5cf6', icon: '📱', progress: 85 },
    { name: 'Data Science', students: 1890, color: '#3b82f6', icon: '📊', progress: 72 },
    { name: 'Cloud Computing', students: 1567, color: '#10b981', icon: '☁️', progress: 68 },
    { name: 'Web Dev', students: 3245, color: '#f59e0b', icon: '🌐', progress: 92 },
  ];

  const courseSalesData = [
    { month: 'Jan', 'Mobile Dev': 245, 'Data Science': 189, 'Cloud Computing': 156, 'Web Dev': 324 },
    { month: 'Feb', 'Mobile Dev': 268, 'Data Science': 203, 'Cloud Computing': 178, 'Web Dev': 356 },
    { month: 'Mar', 'Mobile Dev': 290, 'Data Science': 225, 'Cloud Computing': 195, 'Web Dev': 389 },
    { month: 'Apr', 'Mobile Dev': 312, 'Data Science': 248, 'Cloud Computing': 218, 'Web Dev': 421 },
    { month: 'May', 'Mobile Dev': 335, 'Data Science': 267, 'Cloud Computing': 235, 'Web Dev': 445 },
    { month: 'Jun', 'Mobile Dev': 358, 'Data Science': 289, 'Cloud Computing': 256, 'Web Dev': 478 },
    { month: 'Jul', 'Mobile Dev': 380, 'Data Science': 312, 'Cloud Computing': 278, 'Web Dev': 512 },
    { month: 'Aug', 'Mobile Dev': 402, 'Data Science': 335, 'Cloud Computing': 295, 'Web Dev': 545 },
  ];

  const formatTooltipValue = (value: number, name: string) => {
    return [`${value} étudiants`, name];
  };

  return (
    <div className="lg:col-span-2 relative bg-white rounded-3xl p-6 shadow-xl border border-purple-100 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 opacity-50"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Popular Courses
              </h2>
            </div>
            <p className="text-sm text-gray-600 font-medium ml-12">📊 Real-time sales performance</p>
          </div>
          <button className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={courseSalesData}>
              <defs>
                <linearGradient id="colorMobileDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDataScience" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCloudComputing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorWebDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" stroke="#d1d5db" fontSize={11} fontWeight={500} tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
              <YAxis stroke="#d1d5db" fontSize={11} fontWeight={500} tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
              <Tooltip formatter={formatTooltipValue} contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '12px 16px' }} labelStyle={{ fontWeight: '600', color: '#111827', marginBottom: '8px', fontSize: '13px' }} itemStyle={{ padding: '4px 0', fontWeight: '500', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Web Dev" stroke="#f59e0b" fillOpacity={1} fill="url(#colorWebDev)" strokeWidth={2.5} dot={{ fill: '#f59e0b', strokeWidth: 2, stroke: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="Mobile Dev" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMobileDev)" strokeWidth={2.5} dot={{ fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="Cloud Computing" stroke="#10b981" fillOpacity={1} fill="url(#colorCloudComputing)" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 2, stroke: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="Data Science" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDataScience)" strokeWidth={2.5} dot={{ fill: '#3b82f6', strokeWidth: 2, stroke: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {popularCourses.map((course, index) => (
            <div 
              key={index} 
              className="relative group/card cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover/card:opacity-100 rounded-2xl blur-xl transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${course.color}40, ${course.color}20)` }}
              ></div>
              
              <div className="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-opacity-50"
                style={{ borderColor: course.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover/card:scale-110 group-hover/card:rotate-6 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${course.color}20, ${course.color}10)` }}
                  >
                    {course.icon}
                  </div>
                  <div className="w-3 h-3 rounded-full animate-pulse shadow-lg" style={{ backgroundColor: course.color }}></div>
                </div>
                
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{course.name}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-gray-900">{course.students}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: course.color }}>+{course.progress}%</span>
                </div>
                
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${course.progress}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}dd)` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;