'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaCalendarPlus, FaUser, FaComment, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

// Project status options
const PROJECT_STATUS_OPTIONS = [
  'First call',
  'Follow-up call',
  'Meet',
  'MoU sent',
  'MoU signed',
  'Development Phase 1',
  'Development Phase 2',
  'Development Phase 3',
  'Development Phase 4',
  'Deployment',
  'Management',
  'Termination'
];

function LeadDetailContent({ id }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Step form state
  const [showStepForm, setShowStepForm] = useState(false);
  const [stepText, setStepText] = useState('');
  const [stepAssignedTo, setStepAssignedTo] = useState('');
  const [addingStep, setAddingStep] = useState(false);
  
  // Reminder form state
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderData, setReminderData] = useState({
    message: '',
    datetime: ''
  });
  const [addingReminder, setAddingReminder] = useState(false);
  
  // Project status comment state
  const [showComment, setShowComment] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  const router = useRouter();
  
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
      const response = await axios.post(`/api/leads/${id}/steps`, { 
        text: stepText,
        assignedTo: stepAssignedTo 
      });
      
      // Update lead with new step
      setLead({
        ...lead,
        steps: [...lead.steps, response.data.data]
      });
      
      setStepText('');
      setStepAssignedTo('');
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

  // Render project status roadmap
  const renderRoadmap = () => {
    if (!lead || !lead.projectStatus) return null;
    
    const currentStatusIndex = PROJECT_STATUS_OPTIONS.indexOf(lead.projectStatus);
    if (currentStatusIndex === -1) return null;
    
    return (
      <div className="mb-8 overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Journey</h2>
        
        {/* Mobile view - horizontal scrollable like desktop */}
        <div className="md:hidden overflow-x-auto">
          <div className="min-w-[900px] relative">
            {/* Background line */}
            <div className="absolute h-2 top-[40px] left-0 right-0 bg-gray-200 rounded-full"></div>
            
            <div className="flex items-center">
              {PROJECT_STATUS_OPTIONS.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = status === lead.projectStatus;
                
                return (
                  <div key={status} className="flex-1 relative flex flex-col items-center">
                    {/* Active line */}
                    {index < currentStatusIndex && (
                      <div 
                        className="absolute h-2 top-[40px] left-0 right-0 z-[1] bg-gradient-to-r from-[#ff8a80] to-[#c60000]"
                      ></div>
                    )}
                    
                    {/* Status node */}
                    <div 
                      className={`z-10 w-10 h-10 mt-[36px] mb-[36px] rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-[#c60000] text-white ring-4 ring-red-100 scale-110 cursor-pointer' 
                          : isActive 
                            ? 'bg-[#c60000] text-white cursor-pointer' 
                            : 'bg-white text-gray-500 border border-gray-300 cursor-pointer'
                      }`}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowComment(!showComment || selectedStatus !== status);
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    <div className="text-center absolute top-[90px]">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-[#c60000]' : 'text-gray-600'}`}>
                        {status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Desktop view with straight line */}
        <div className="hidden md:block ">
          <div className="min-w-[900px] relative">
            {/* Background line */}
            <div className="absolute h-2 top-[40px] left-0 right-0 bg-gray-200 rounded-full"></div>
            
            <div className="flex items-center">
              {PROJECT_STATUS_OPTIONS.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = status === lead.projectStatus;
                
                return (
                  <div key={status} className="flex-1 relative flex flex-col items-center">
                    {/* Active line */}
                    {index < currentStatusIndex && (
                      <div 
                        className="absolute h-2 top-[40px] left-0 right-0 z-[1] bg-gradient-to-r from-[#ff8a80] to-[#c60000]"
                      ></div>
                    )}
                    
                    {/* Status node */}
                    <div 
                      className={`z-10 w-12 h-12 mt-[34px] mb-[34px] rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-[#c60000] text-white ring-4 ring-red-100 scale-110 cursor-pointer' 
                          : isActive 
                            ? 'bg-[#c60000] text-white cursor-pointer' 
                            : 'bg-white text-gray-500 border border-gray-300 cursor-pointer'
                      }`}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowComment(!showComment || selectedStatus !== status);
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    <div className="text-center absolute top-[90px]">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-[#c60000]' : 'text-gray-600'}`}>
                        {status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Comment Overlay - for both mobile and desktop */}
        <AnimatePresence>
          {showComment && selectedStatus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 "
                onClick={() => setShowComment(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white p-5 rounded-lg shadow-xl max-w-md w-full z-10"
              >
                <button 
                  onClick={() => setShowComment(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  <FaTimes size={18} />
                </button>
                
                <div className="flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      selectedStatus === lead.projectStatus
                        ? 'bg-[#c60000] text-white'
                        : currentStatusIndex >= PROJECT_STATUS_OPTIONS.indexOf(selectedStatus)
                          ? 'bg-[#c60000] text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {PROJECT_STATUS_OPTIONS.indexOf(selectedStatus) + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedStatus}</h3>
                  </div>
                  
                  <div className="mt-2">
                    {selectedStatus === lead.projectStatus && lead.statusComment ? (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Current Status Comment:</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">{lead.statusComment}</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Status Information:</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                          {selectedStatus === lead.projectStatus 
                            ? "No comment has been added for the current status." 
                            : selectedStatus === PROJECT_STATUS_OPTIONS[currentStatusIndex + 1]
                              ? "This is the next step in your project workflow."
                              : currentStatusIndex >= PROJECT_STATUS_OPTIONS.indexOf(selectedStatus)
                                ? "This step has been completed."
                                : "This is a future step in your project workflow."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#c60000]" />
      </div>
    );
  }
  
  if (error || !lead) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
        {error || 'Lead not found'}
        <button 
          onClick={fetchLead}
          className="ml-2 underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div>
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

      {/* Project Status Roadmap */}
      {renderRoadmap()}
      
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
                      value={lead.clientName || ''}
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
                      Phone*
                    </label>
                    <input
                      id="contactInfo.phone"
                      name="contactInfo.phone"
                      type="text"
                      value={lead.contactInfo?.phone || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="assignedTo">
                      Assigned To
                    </label>
                    <input
                      id="assignedTo"
                      name="assignedTo"
                      type="text"
                      value={lead.assignedTo || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      placeholder="Enter name of person assigned"
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
                      value={lead.projectTitle || ''}
                      onChange={handleChange}
                      required
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
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectDetails">
                  Project Details
                </label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  value={lead.projectDetails || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                ></textarea>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectStatus">
                    Project Status
                  </label>
                  <select
                    id="projectStatus"
                    name="projectStatus"
                    value={lead.projectStatus || 'First call'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                  >
                    {PROJECT_STATUS_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="statusComment">
                    Status Comment (max 20 words)
                  </label>
                  <input
                    id="statusComment"
                    name="statusComment"
                    type="text"
                    value={lead.statusComment || ''}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                    placeholder="Brief comment about current status"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={saving}
                  className={`flex items-center px-6 py-2 bg-[#c60000] text-white rounded-md ${
                    saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'
                  } transition-colors duration-200`}
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
          
          {/* Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Steps</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStepForm(!showStepForm)}
                className="flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                Add Step
              </motion.button>
            </div>
            
            <AnimatePresence>
              {showStepForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <form onSubmit={handleAddStep} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stepText">
                        Step Text*
                      </label>
                      <textarea
                        id="stepText"
                        value={stepText}
                        onChange={(e) => setStepText(e.target.value)}
                        rows={2}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                        placeholder="Describe the step..."
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stepAssignedTo">
                        Assigned To
                      </label>
                      <input
                        id="stepAssignedTo"
                        type="text"
                        value={stepAssignedTo}
                        onChange={(e) => setStepAssignedTo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                        placeholder="Enter name of person assigned to this step"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowStepForm(false)}
                        className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingStep}
                        className={`flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md ${
                          addingStep ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'
                        } transition-colors duration-200`}
                      >
                        {addingStep ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
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
                    key={index}
                    className="p-4 bg-gray-50 rounded-md border-l-4 border-[#c60000]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{step.text}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span className="mr-3">
                            Step {step.stepNumber} • {new Date(step.timestamp).toLocaleDateString()}
                          </span>
                          {step.assignedTo && (
                            <span className="flex items-center">
                              <FaUser className="mr-1 text-xs" />
                              {step.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No steps added yet.</p>
            )}
          </div>
        </div>
        
        {/* Reminders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reminders</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReminderForm(!showReminderForm)}
                className="flex items-center px-3 py-1 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
              >
                <FaCalendarPlus className="mr-1" />
                Add
              </motion.button>
            </div>
            
            <AnimatePresence>
              {showReminderForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <form onSubmit={handleAddReminder} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reminderMessage">
                        Message*
                      </label>
                      <textarea
                        id="reminderMessage"
                        name="message"
                        value={reminderData.message}
                        onChange={handleReminderChange}
                        rows={2}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                        placeholder="Reminder message..."
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reminderDatetime">
                        Date & Time*
                      </label>
                      <input
                        id="reminderDatetime"
                        name="datetime"
                        type="datetime-local"
                        value={reminderData.datetime}
                        onChange={handleReminderChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowReminderForm(false)}
                        className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingReminder}
                        className={`flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md ${
                          addingReminder ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'
                        } transition-colors duration-200`}
                      >
                        {addingReminder ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
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
                    className="p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <p className="font-medium text-gray-800">{reminder.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
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
    </div>
  );
}

export default function LeadDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#c60000]" />
          </div>
        }>
          <LeadDetailContent id={params.id} />
        </Suspense>
      </main>
    </div>
  );
} 