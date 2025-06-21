'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaCalendarPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

export default function LeadDetailPage({ params }) {
  const router = useRouter();
  const id = params.id;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Step form state
  const [showStepForm, setShowStepForm] = useState(false);
  const [stepText, setStepText] = useState('');
  const [addingStep, setAddingStep] = useState(false);
  
  // Reminder form state
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderData, setReminderData] = useState({
    message: '',
    datetime: ''
  });
  const [addingReminder, setAddingReminder] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);
  
  const fetchLead = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/leads/${id}`);
      setLead(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching lead:', error);
      setError('Failed to load lead. Please try again.');
      toast.error('Failed to load lead');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('checkboxes.')) {
      const checkboxName = name.split('.')[1];
      setLead({
        ...lead,
        checkboxes: {
          ...lead.checkboxes,
          [checkboxName]: checked
        }
      });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLead({
        ...lead,
        [parent]: {
          ...lead[parent],
          [child]: value
        }
      });
    } else {
      setLead({
        ...lead,
        [name]: value
      });
    }
  };
  
  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setReminderData({
      ...reminderData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.patch(`/api/leads/${id}`, lead);
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddStep = async (e) => {
    e.preventDefault();
    
    if (!stepText.trim()) {
      toast.error('Step text is required');
      return;
    }
    
    setAddingStep(true);
    
    try {
      const response = await axios.post(`/api/leads/${id}/steps`, { text: stepText });
      
      // Update lead with new step
      setLead({
        ...lead,
        steps: [...lead.steps, response.data.data]
      });
      
      setStepText('');
      setShowStepForm(false);
      toast.success('Step added successfully');
    } catch (error) {
      console.error('Error adding step:', error);
      toast.error(error.response?.data?.message || 'Failed to add step');
    } finally {
      setAddingStep(false);
    }
  };
  
  const handleAddReminder = async (e) => {
    e.preventDefault();
    
    if (!reminderData.message.trim() || !reminderData.datetime) {
      toast.error('Reminder message and date/time are required');
      return;
    }
    
    setAddingReminder(true);
    
    try {
      await axios.post(`/api/leads/${id}/reminder`, reminderData);
      
      setReminderData({
        message: '',
        datetime: ''
      });
      setShowReminderForm(false);
      toast.success('Reminder created successfully');
      
      // Refresh lead data to get updated reminders
      fetchLead();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to create reminder');
    } finally {
      setAddingReminder(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LeadsNavbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#c60000]" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LeadsNavbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
            {error || 'Lead not found'}
            <button 
              onClick={fetchLead}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/leads/allleads')}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <FaArrowLeft className="text-gray-600" />
          </motion.button>
          
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {lead.projectTitle}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="clientName">
                        Client Name*
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        value={lead.clientName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={lead.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contactInfo.phone">
                        Phone
                      </label>
                      <input
                        id="contactInfo.phone"
                        name="contactInfo.phone"
                        type="text"
                        value={lead.contactInfo?.phone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contactInfo.instagram">
                        Instagram
                      </label>
                      <input
                        id="contactInfo.instagram"
                        name="contactInfo.instagram"
                        type="text"
                        value={lead.contactInfo?.instagram || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contactInfo.linkedin">
                        LinkedIn
                      </label>
                      <input
                        id="contactInfo.linkedin"
                        name="contactInfo.linkedin"
                        type="text"
                        value={lead.contactInfo?.linkedin || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectTitle">
                        Project Title*
                      </label>
                      <input
                        id="projectTitle"
                        name="projectTitle"
                        type="text"
                        value={lead.projectTitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectDetails">
                        Project Details
                      </label>
                      <textarea
                        id="projectDetails"
                        name="projectDetails"
                        value={lead.projectDetails || ''}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      ></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-gray-700 text-sm font-medium mb-3">Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="titleMeet"
                            name="checkboxes.titleMeet"
                            type="checkbox"
                            checked={lead.checkboxes?.titleMeet || false}
                            onChange={handleChange}
                            className="h-5 w-5 text-[#c60000] focus:ring-[#c60000] border-gray-300 rounded"
                          />
                          <label htmlFor="titleMeet" className="ml-2 text-gray-700">
                            Title Meet
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="firstCall"
                            name="checkboxes.firstCall"
                            type="checkbox"
                            checked={lead.checkboxes?.firstCall || false}
                            onChange={handleChange}
                            className="h-5 w-5 text-[#c60000] focus:ring-[#c60000] border-gray-300 rounded"
                          />
                          <label htmlFor="firstCall" className="ml-2 text-gray-700">
                            First Call
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="closed"
                            name="checkboxes.closed"
                            type="checkbox"
                            checked={lead.checkboxes?.closed || false}
                            onChange={handleChange}
                            className="h-5 w-5 text-[#c60000] focus:ring-[#c60000] border-gray-300 rounded"
                          />
                          <label htmlFor="closed" className="ml-2 text-gray-700">
                            Closed
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={saving}
                    className={`flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md 
                      ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'}
                      transition-colors duration-200`}
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
            
            {/* Steps Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Steps</h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowStepForm(!showStepForm)}
                  className="flex items-center px-3 py-1.5 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200 text-sm"
                >
                  <FaPlus className="mr-1" />
                  Add Step
                </motion.button>
              </div>
              
              <AnimatePresence>
                {showStepForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <form onSubmit={handleAddStep} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stepText">
                          Step Details
                        </label>
                        <textarea
                          id="stepText"
                          value={stepText}
                          onChange={(e) => setStepText(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                          placeholder="Describe the step..."
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowStepForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addingStep}
                          className={`flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md 
                            ${addingStep ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'}
                            transition-colors duration-200 text-sm`}
                        >
                          {addingStep ? (
                            <>
                              <FaSpinner className="animate-spin mr-1" />
                              Adding...
                            </>
                          ) : (
                            'Add Step'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {lead.steps && lead.steps.length > 0 ? (
                <div className="space-y-4">
                  {lead.steps.map((step, index) => (
                    <div
                      key={step._id || index}
                      className="bg-gray-50 p-4 rounded-md border-l-4 border-[#c60000]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Step {step.stepNumber}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{step.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No steps added yet.</p>
              )}
            </div>
          </div>
          
          {/* Reminders Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Reminders</h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowReminderForm(!showReminderForm)}
                  className="flex items-center px-3 py-1.5 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200 text-sm"
                >
                  <FaCalendarPlus className="mr-1" />
                  Add Reminder
                </motion.button>
              </div>
              
              <AnimatePresence>
                {showReminderForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <form onSubmit={handleAddReminder} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reminderMessage">
                          Reminder Message
                        </label>
                        <input
                          id="reminderMessage"
                          name="message"
                          type="text"
                          value={reminderData.message}
                          onChange={handleReminderChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                          placeholder="e.g., Follow up with client"
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reminderDatetime">
                          Date & Time
                        </label>
                        <input
                          id="reminderDatetime"
                          name="datetime"
                          type="datetime-local"
                          value={reminderData.datetime}
                          onChange={handleReminderChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowReminderForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addingReminder}
                          className={`flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md 
                            ${addingReminder ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'}
                            transition-colors duration-200 text-sm`}
                        >
                          {addingReminder ? (
                            <>
                              <FaSpinner className="animate-spin mr-1" />
                              Adding...
                            </>
                          ) : (
                            'Add Reminder'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {lead.reminders && lead.reminders.length > 0 ? (
                <div className="space-y-3">
                  {lead.reminders.map((reminder) => (
                    <div
                      key={reminder._id}
                      className="bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <p className="font-medium text-gray-800">{reminder.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reminder.datetime).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reminders set.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 