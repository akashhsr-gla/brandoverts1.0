'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function LeadsNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navLinks = [
    { 
      href: '/leads/allleads', 
      label: 'All Leads', 
      icon: <FaClipboardList className="mr-2" /> 
    },
    { 
      href: '/leads/reminder', 
      label: 'Reminders', 
      icon: <FaCalendarAlt className="mr-2" /> 
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/leads/allleads" className="flex items-center">
            <div className="relative w-28 h-10">
              <Image
                src="/logo.png"
                alt="Brandovert Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-800">
              Lead Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200
                  ${pathname === link.href
                    ? 'bg-[#c60000] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            {user && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200
                  ${pathname === link.href
                    ? 'bg-[#c60000] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
} 