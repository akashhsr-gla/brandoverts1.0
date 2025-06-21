'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheck, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

export default function AllLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/leads');
      setLeads(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to load leads. Please try again.');
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLead = () => {
    router.push('/leads/new');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Leads</h1>
            <p className="text-gray-600">Manage and track your client leads</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000] w-full"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateLead}
              className="flex items-center justify-center px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              New Lead
            </motion.button>
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
              onClick={fetchLeads}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">No leads found.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateLead}
              className="inline-flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              Create your first lead
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <Link href={`/leads/${lead._id}`} className="block p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          {lead.projectTitle}
                        </h2>
                        <p className="text-gray-600 mb-2">
                          Client: {lead.clientName}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>
                            Latest: Step {lead.steps.length > 0 ? lead.steps.length : 0}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(lead.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          lead.checkboxes.titleMeet ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.checkboxes.titleMeet ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                          Title Meet
                        </div>
                        
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          lead.checkboxes.firstCall ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.checkboxes.firstCall ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                          First Call
                        </div>
                        
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          lead.checkboxes.closed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.checkboxes.closed ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                          Closed
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
} 