'use client';

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarModalProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setCalendarData: (data: any) => void;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ 
  selectedDate, 
  setSelectedDate, 
  setCalendarData, 
  onClose 
}) => {
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    
    const day = date.getDate();
    const randomFactor = (day * 137) % 100;
    
    setCalendarData({
      totalStudents: Math.floor(8000 + (randomFactor * 30)),
      activeCourses: Math.floor(40 + (randomFactor / 10)),
      totalRevenue: Math.floor(80000 + (randomFactor * 500)),
      activeMentors: Math.floor(30 + (randomFactor / 20))
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-dash-fade-in">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 animate-dash-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sélectionner une date</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-purple-50 rounded-full transition"
            >
              <ChevronLeft className="w-5 h-5 text-purple-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-purple-50 rounded-full transition"
            >
              <ChevronRight className="w-5 h-5 text-purple-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays(selectedDate).map((dayObj, index) => {
              const isToday = dayObj.date.toDateString() === new Date().toDateString();
              const isSelected = dayObj.date.toDateString() === selectedDate.toDateString();
              
              return (
                <button
                  key={index}
                  onClick={() => dayObj.isCurrentMonth && selectDate(dayObj.date)}
                  disabled={!dayObj.isCurrentMonth}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition-all
                    ${dayObj.isCurrentMonth ? 'hover:bg-purple-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}
                    ${isSelected ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
                    ${isToday && !isSelected ? 'border-2 border-purple-600 text-purple-600' : ''}
                  `}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button 
            onClick={() => selectDate(new Date())}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;