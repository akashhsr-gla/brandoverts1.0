'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner, FaCalendarAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateReminders, setDateReminders] = useState([]);
  
  const router = useRouter();
  
  useEffect(() => {
    fetchReminders();
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      fetchDateReminders(selectedDate);
    }
  }, [selectedDate]);
  
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reminders');
      setReminders(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to load reminders. Please try again.');
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDateReminders = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`/api/reminders?date=${formattedDate}`);
      setDateReminders(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching date reminders:', error);
      setError('Failed to load reminders for this date. Please try again.');
      toast.error('Failed to load reminders for this date');
    } finally {
      setLoading(false);
    }
  };
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-gray-100"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if there are reminders for this date
      const hasReminders = reminders.some(reminder => {
        const reminderDate = new Date(reminder.datetime).toISOString().split('T')[0];
        return reminderDate === dateString;
      });
      
      // Check if this is the selected date
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      
      // Check if this is today
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(date)}
          className={`h-12 flex flex-col items-center justify-center border cursor-pointer transition-colors duration-200
            ${isSelected ? 'bg-[#c60000] text-white border-[#c60000]' : 
              isToday ? 'bg-gray-100 border-gray-300' : 'border-gray-100 hover:bg-gray-50'}`}
        >
          <span className={`text-sm ${hasReminders && !isSelected ? 'font-bold text-[#c60000]' : ''}`}>
            {day}
          </span>
          {hasReminders && (
            <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-[#c60000]'}`}></div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reminder Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  &lt;
                </button>
                
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  &gt;
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </div>
          
          {/* Reminders for Selected Date */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {selectedDate ? (
                <>
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-[#c60000] mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <FaSpinner className="animate-spin text-3xl text-[#c60000]" />
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
                      {error}
                    </div>
                  ) : dateReminders.length === 0 ? (
                    <p className="text-gray-500 italic">No reminders for this date.</p>
                  ) : (
                    <div className="space-y-3">
                      {dateReminders.map((reminder) => (
                        <motion.div
                          key={reminder._id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-50 p-3 rounded-md border border-gray-200 cursor-pointer"
                          onClick={() => router.push(`/leads/${reminder.leadId._id}`)}
                        >
                          <div className="flex items-center mb-1">
                            <FaClock className="text-[#c60000] mr-2 text-sm" />
                            <span className="text-sm text-gray-600">
                              {formatTime(reminder.datetime)}
                            </span>
                          </div>
                          <p className="font-medium text-gray-800 mb-1">{reminder.message}</p>
                          <p className="text-sm text-gray-600">
                            Lead: {reminder.leadId?.projectTitle || 'Unknown'}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">Select a date to view reminders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 