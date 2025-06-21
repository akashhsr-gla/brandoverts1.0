'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

// Helper functions for date manipulation
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

// Generate time slots for 24 hours
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    slots.push(`${hour}:00`);
  }
  return slots;
};

export default function ReminderCalendarPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calendar state
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [dailyReminders, setDailyReminders] = useState({});
  const [timeSlots] = useState(generateTimeSlots());
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  
  const router = useRouter();
  
  useEffect(() => {
    fetchReminders();
  }, []);
  
  useEffect(() => {
    fetchDailyReminders();
  }, [selectedDate]);
  
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reminders');
      setReminders(response.data.data);
      
      // Get upcoming reminders (next 7 days)
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      const upcoming = response.data.data.filter(reminder => {
        const reminderDate = new Date(reminder.datetime);
        return reminderDate >= now && reminderDate <= nextWeek;
      });
      
      // Sort by date
      upcoming.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      
      // Limit to 5
      setUpcomingReminders(upcoming.slice(0, 5));
      
      setError(null);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to load reminders. Please try again.');
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDailyReminders = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`/api/reminders?date=${dateString}`);
      
      // Group reminders by hour
      const remindersByHour = {};
      response.data.data.forEach(reminder => {
        const date = new Date(reminder.datetime);
        const hour = date.getHours().toString().padStart(2, '0');
        
        if (!remindersByHour[hour]) {
          remindersByHour[hour] = [];
        }
        
        remindersByHour[hour].push(reminder);
      });
      
      setDailyReminders(remindersByHour);
    } catch (error) {
      console.error('Error fetching daily reminders:', error);
      toast.error('Failed to load daily reminders');
    }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };
  
  const selectDate = (date) => {
    setSelectedDate(date);
  };
  
  const renderMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Generate days array with empty slots for proper alignment
    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Check if a day has reminders
    const dayHasReminder = (day) => {
      if (!day) return false;
      
      return reminders.some(reminder => {
        const reminderDate = new Date(reminder.datetime);
        return (
          reminderDate.getFullYear() === day.getFullYear() &&
          reminderDate.getMonth() === day.getMonth() &&
          reminderDate.getDate() === day.getDate()
        );
      });
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDate(new Date());
              }}
              className="px-3 py-1 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              Today
            </button>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 bg-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`min-h-[80px] bg-white ${!day ? 'opacity-50' : ''}`}
            >
              {day && (
                <motion.div
                  whileHover={{ scale: 0.98 }}
                  onClick={() => selectDate(day)}
                  className={`h-full p-2 cursor-pointer hover:bg-gray-50 ${
                    day.toDateString() === selectedDate.toDateString() ? 'bg-red-50' : 
                    day.toDateString() === today.toDateString() ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      day.toDateString() === today.toDateString() ? 'text-[#c60000]' : 
                      day.toDateString() === selectedDate.toDateString() ? 'text-[#c60000]' : 'text-gray-700'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayHasReminder(day) && (
                      <div className="w-2 h-2 rounded-full bg-[#c60000]"></div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderUpcomingReminders = () => {
    if (upcomingReminders.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaBell className="text-[#c60000] mr-2" />
          Upcoming Reminders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {upcomingReminders.map(reminder => (
            <motion.div
              key={reminder._id}
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
              onClick={() => router.push(`/leads/${reminder.leadId._id}`)}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#c60000] cursor-pointer"
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#c60000] mr-3">
                  <FaBell />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {formatDate(new Date(reminder.datetime))}
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(reminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <p className="font-medium text-gray-800 mb-2 line-clamp-2">{reminder.message}</p>
              {reminder.leadId && (
                <p className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-block">
                  {reminder.leadId.projectTitle || reminder.leadId.clientName || 'Unknown Lead'}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderDayView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaCalendarAlt className="text-[#c60000] mr-2" />
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              Today
            </button>
            <button 
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                setSelectedDate(nextDay);
              }}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        {/* Summary of reminders for the day */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">
              {Object.values(dailyReminders).flat().length} Reminders Today
            </h3>
            <div className="flex space-x-2">
              {Object.keys(dailyReminders).length > 0 && (
                <div className="flex space-x-1">
                  {Object.keys(dailyReminders).slice(0, 3).map(hour => (
                    <div 
                      key={hour} 
                      className="px-2 py-1 bg-red-100 text-[#c60000] rounded text-xs font-medium"
                    >
                      {hour}:00
                    </div>
                  ))}
                  {Object.keys(dailyReminders).length > 3 && (
                    <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      +{Object.keys(dailyReminders).length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[600px]">
          {timeSlots.map((timeSlot, index) => {
            const hour = timeSlot.split(':')[0];
            const remindersForHour = dailyReminders[hour] || [];
            
            return (
              <div 
                key={timeSlot} 
                className={`flex border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="w-20 p-3 border-r bg-gray-100 flex items-start justify-center">
                  <div className="flex items-center">
                    <FaClock className="text-gray-500 mr-1 text-xs" />
                    <span className="text-sm font-medium text-gray-700">{timeSlot}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-h-[100px] p-2">
                  {remindersForHour.length > 0 ? (
                    <div className="space-y-2">
                      {remindersForHour.map(reminder => (
                        <motion.div
                          key={reminder._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => router.push(`/leads/${reminder.leadId._id}`)}
                          className="p-3 bg-red-50 border-l-4 border-[#c60000] rounded-r-md cursor-pointer"
                        >
                          <p className="font-medium text-gray-800">{reminder.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600">
                              {new Date(reminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {reminder.leadId && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                {reminder.leadId.projectTitle || reminder.leadId.clientName || 'Unknown Lead'}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaCalendarAlt className="text-[#c60000] mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Reminder Calendar</h1>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#c60000]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
            {error}
            <button 
              onClick={fetchReminders}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming reminders section */}
            {renderUpcomingReminders()}
            
            {/* Month calendar */}
            {renderMonthCalendar()}
            
            {/* Day view with time slots */}
            {renderDayView()}
          </>
        )}
      </main>
    </div>
  );
} 