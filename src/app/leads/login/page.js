'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || '/leads/allleads';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      
      if (response.data.success) {
        toast.success('Login successful');
        router.push(from);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-16">
              <Image
                src="/logo.png"
                alt="Brandovert Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Lead Management Portal
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your credentials to access the portal
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-[#c60000]"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#c60000] text-white py-3 rounded-md font-medium text-lg
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a50000]'}
                transition-all duration-200`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
        </div>
        
        <div className="py-4 bg-gray-50 text-center text-sm text-gray-600 border-t">
          &copy; {new Date().getFullYear()} Brandoverts. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c60000] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 