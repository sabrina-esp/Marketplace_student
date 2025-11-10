'use client';

import React from 'react';
import { Award } from 'lucide-react';

interface ProfileReportProps {
  calendarData: {
    totalRevenue: number;
    totalStudents: number;
  };
}

const ProfileReport: React.FC<ProfileReportProps> = ({ calendarData }) => {
  return (
    <div 
      className="relative rounded-3xl p-6 shadow-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white'
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-12 h-12 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.4)'
              }}
            >
              <Award className="w-7 h-7" style={{ color: 'white' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black drop-shadow-md" style={{ color: 'white' }}>Profile Report</h2>
              <p className="text-sm font-semibold" style={{ color: 'white' }}>Your monthly achievement</p>
            </div>
          </div>
        </div>
        
        <div 
          className="backdrop-blur-md rounded-2xl p-6 mb-5 border-2 shadow-2xl"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          <div className="text-5xl font-black mb-2 drop-shadow-2xl" style={{ color: 'white' }}>
            ${calendarData.totalRevenue.toLocaleString()}
          </div>
          <div className="text-base font-bold" style={{ color: 'white' }}>💰 Total Earnings</div>
        </div>

        <div className="space-y-3 mb-6">
          <div 
            className="flex items-center justify-between p-4 backdrop-blur-sm rounded-xl border-2 shadow-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <span className="font-bold text-base" style={{ color: 'white' }}>👥 Active Students</span>
            <span className="font-black text-xl" style={{ color: 'white' }}>{calendarData.totalStudents.toLocaleString()}</span>
          </div>
          <div 
            className="flex items-center justify-between p-4 backdrop-blur-sm rounded-xl border-2 shadow-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <span className="font-bold text-base" style={{ color: 'white' }}>✅ Completion Rate</span>
            <span className="font-black text-xl" style={{ color: 'white' }}>92%</span>
          </div>
          <div 
            className="flex items-center justify-between p-4 backdrop-blur-sm rounded-xl border-2 shadow-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <span className="font-bold text-base" style={{ color: 'white' }}>⭐ Satisfaction</span>
            <span className="font-black text-xl" style={{ color: 'white' }}>4.8/5</span>
          </div>
        </div>

        <button 
          className="w-full px-6 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
          style={{
            backgroundColor: 'white',
            color: '#4338ca'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
        >
          📊 View Full Report
        </button>
      </div>
    </div>
  );
};

export default ProfileReport;