'use client';

import React from 'react';
import { Star } from 'lucide-react';

const TopMentors = () => {
  const topMentors = [
    { name: 'Sarah Johnson', specialty: 'Mobile Dev', rating: 4.9, students: 234, avatar: '👩‍💻', color: 'bg-purple-100' },
    { name: 'Michael Chen', specialty: 'Data Science', rating: 4.8, students: 198, avatar: '👨‍💼', color: 'bg-blue-100' },
    { name: 'Emma Davis', specialty: 'Cloud Computing', rating: 4.9, students: 187, avatar: '👩‍🔬', color: 'bg-green-100' },
    { name: 'David Wilson', specialty: 'Web Dev', rating: 4.7, students: 256, avatar: '👨‍💻', color: 'bg-orange-100' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Meet Our Top Mentors</h2>
        <button className="text-sm font-medium text-purple-600 hover:text-purple-700">View All</button>
      </div>
      
      <div className="space-y-4">
        {topMentors.map((mentor, index) => (
          <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
            <div className={`w-12 h-12 ${mentor.color} rounded-full flex items-center justify-center text-2xl`}>
              {mentor.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
              <p className="text-sm text-gray-500">{mentor.specialty}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {mentor.rating}
              </div>
              <p className="text-xs text-gray-500">{mentor.students} students</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMentors;