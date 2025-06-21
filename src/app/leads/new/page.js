'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

export default function NewLeadPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    contactInfo: {
      phone: '',
      instagram: '',
      linkedin: ''
    },
    email: '',
    projectTitle: '',
    projectDetails: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/leads', formData);
      
      toast.success('Lead created successfully');
      router.push(`/leads/${response.data.data._id}`);
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <FaArrowLeft className="text-gray-600" />
          </motion.button>
          
          <h1 className="text-2xl font-bold text-gray-800">Create New Lead</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="clientName">
                    Client Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
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
                    value={formData.email}
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
                    value={formData.contactInfo.phone}
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
                    value={formData.contactInfo.instagram}
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
                    value={formData.contactInfo.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="projectTitle">
                    Project Title
                  </label>
                  <input
                    id="projectTitle"
                    name="projectTitle"
                    type="text"
                    value={formData.projectTitle}
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
                    value={formData.projectDetails}
                    onChange={handleChange}
                    rows="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md 
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'}
                  transition-colors duration-200`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Create Lead
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 