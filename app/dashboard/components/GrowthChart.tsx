'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  calendarData: {
    totalStudents: number;
    activeCourses: number;
  };
}

const GrowthChart: React.FC<GrowthChartProps> = ({ calendarData }) => {
  const growthData = [{ name: 'Growth', value: 78, fill: '#8b5cf6' }];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Platform Growth</h2>
        <p className="text-sm text-gray-500 mt-1">Overall progress</p>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="100%" 
              data={growthData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-gray-900">78%</span>
            <span className="text-sm text-gray-500">Growth</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">Students</span>
          <span className="text-sm font-bold text-purple-600">{(calendarData.totalStudents / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">Courses</span>
          <span className="text-sm font-bold text-blue-600">{calendarData.activeCourses}</span>
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;