'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner, FaPlus, FaSearch, FaFileExcel, FaFilter, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LeadsNavbar from '@/Components/LeadsNavbar';

// Project status options
const PROJECT_STATUS_OPTIONS = [
  'All',
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

export default function AllLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);
  
  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (statusFilter && statusFilter !== 'All') {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axios.get(`/api/leads${queryString}`);
      
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
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads();
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    fetchLeads();
  };
  
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      
      // Use axios to fetch the Excel file with responseType blob
      const response = await axios.get('/api/leads/export/excel', {
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'brandoverts_leads.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Leads exported successfully');
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Get the latest step text
  const getLatestStep = (steps) => {
    if (!steps || steps.length === 0) return 'No steps yet';
    return steps[steps.length - 1].text;
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Leads</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              disabled={isExporting || leads.length === 0}
              className={`flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md 
                ${(isExporting || leads.length === 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'}
                transition-colors duration-200`}
            >
              {isExporting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileExcel className="mr-2" />
                  Export to Excel
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/leads/new')}
              className="flex items-center justify-center px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              New Lead
            </motion.button>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by client name, project title, or assigned person..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </form>
            </div>
            
            <div className="w-fulld:w-64 m">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                >
                  {PROJECT_STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={fetchLeads}
              className="px-6 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              Search
            </button>
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
        ) : leads.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">No leads found.</p>
            <button
              onClick={() => router.push('/leads/new')}
              className="px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-200"
            >
              Create your first lead
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {leads.map((lead) => (
              <motion.div
                key={lead._id}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/leads/${lead._id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border border-gray-100 hover:border-[#c60000]"
              >
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
                    {lead.projectTitle || 'Untitled Project'}
                  </h2>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {lead.projectStatus || 'First call'}
                    </span>
                    {lead.assignedTo && (
                      <span className="ml-2 text-sm text-gray-600 flex items-center">
                        • Assigned to: {lead.assignedTo}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Client:</span> {lead.clientName || 'Unknown'}
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 font-medium">Latest step:</p>
                    <p className="text-gray-700 line-clamp-2">
                      {getLatestStep(lead.steps)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                    <span>Created: {formatDate(lead.createdAt)}</span>
                    <span>Updated: {formatDate(lead.updatedAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 