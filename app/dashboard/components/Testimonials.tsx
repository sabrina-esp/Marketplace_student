'use client';

import React from 'react';
import { Star, Clock } from 'lucide-react';

const Testimonials = () => {
  const recentTestimonials = [
    { student: 'John Smith', course: 'Mobile Dev', rating: 5, comment: 'Excellent cours! J\'ai appris énormément.', date: '2 days ago' },
    { student: 'Lisa Anderson', course: 'Data Science', rating: 5, comment: 'Les mentors sont incroyables et très patients.', date: '3 days ago' },
    { student: 'Marc Dubois', course: 'Web Dev', rating: 4, comment: 'Très bon contenu, bien structuré.', date: '5 days ago' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Happy Students Says</h2>
        <button className="text-sm font-medium text-purple-600 hover:text-purple-700">View All</button>
      </div>
      
      <div className="space-y-4">
        {recentTestimonials.map((testimonial, index) => (
          <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.student}</h3>
                <p className="text-sm text-gray-500">{testimonial.course}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{testimonial.comment}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {testimonial.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;