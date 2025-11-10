'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 4200, students: 120 },
    { month: 'Feb', revenue: 3800, students: 110 },
    { month: 'Mar', revenue: 5100, students: 145 },
    { month: 'Apr', revenue: 4600, students: 130 },
    { month: 'May', revenue: 6200, students: 175 },
    { month: 'Jun', revenue: 5800, students: 165 },
    { month: 'Jul', revenue: 7100, students: 200 },
    { month: 'Aug', revenue: 6800, students: 190 },
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Total Revenue</h2>
          <p className="text-sm text-gray-500 mt-1">Monthly revenue overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
            2024
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
            2023
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, '']}
          />
          <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;