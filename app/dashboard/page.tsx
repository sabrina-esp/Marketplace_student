'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CalendarModal from './components/CalendarModal';
import RevenueChart from './components/RevenueChart';
import GrowthChart from './components/GrowthChart';
import PopularCourses from './components/PopularCourses';
import ProfileReport from './components/ProfileReport';
import TopMentors from './components/TopMentors';
import Testimonials from './components/Testimonials';
import MatchCard from './components/MatchCard';

const DashboardPage = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({
    totalStudents: 8258,
    activeCourses: 47,
    totalRevenue: 84686,
    activeMentors: 34
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Header 
        onCalendarClick={() => setShowCalendar(true)} 
      />
      
      <StatsCards calendarData={calendarData} />
      
      {/* Match Card - Featured Section */}
      <div className="mb-6">
        <MatchCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart />
        <GrowthChart calendarData={calendarData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PopularCourses />
        <ProfileReport calendarData={calendarData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMentors />
        <Testimonials />
      </div>

      {showCalendar && (
        <CalendarModal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setCalendarData={setCalendarData}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;