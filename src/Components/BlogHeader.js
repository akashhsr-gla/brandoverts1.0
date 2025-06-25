import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaWhatsapp, FaEnvelope, FaInstagram, FaLinkedin, FaBars, FaTimes, FaArrowRight, FaUser, FaPen, FaSignOutAlt } from 'react-icons/fa'
import { IoCall } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function BlogHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('/')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    const path = window.location.pathname
    setActiveLink(path)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const handleLogout = async () => {
    await logout()
    setIsProfileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About Us' }
  ]

  return (
    <>
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white py-2 shadow-md border-b-2 border-[#c60000]/80'
          : 'bg-white/95 backdrop-blur-sm py-3 border-b-2 border-[#c60000]'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group p-0 m-0">
              <motion.div 
                className="relative w-28 h-10 sm:w-32 sm:h-12" // Responsive size
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/logo.png"
                  alt="Brandovert Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium text-lg transition-colors duration-200 hover:text-[#c60000] ${
                    activeLink === link.href || (link.href === '/blogs' && activeLink.startsWith('/blogs')) 
                      ? 'text-[#c60000]' 
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                  {(activeLink === link.href || (link.href === '/blogs' && activeLink.startsWith('/blogs'))) && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#c60000]" 
                      initial={false}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-2">
                <motion.a
                  href="https://wa.me/+919153832948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-md bg-[#c60000] hover:bg-white hover:text-[#c60000] text-white border border-[#c60000] transition-all duration-200 flex items-center justify-center"
                  aria-label="WhatsApp"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="text-lg" />
                </motion.a>
                <motion.a
                  href="tel:+919153832948"
                  className="p-2.5 rounded-md bg-[#c60000] hover:bg-white hover:text-[#c60000] text-white border border-[#c60000] transition-all duration-200 flex items-center justify-center"
                  aria-label="Phone"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoCall className="text-lg" />
                </motion.a>
              </div>
              
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center px-4 py-2 bg-[#c60000] text-white rounded-md 
                             hover:bg-white hover:text-[#c60000] border border-[#c60000]
                             transition-all duration-200 font-medium text-base"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaUser className="mr-2" />
                    {user.displayName || user.username}
                  </motion.button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link 
                        href="/blogs/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaUser className="mr-2" />
                        My Profile
                      </Link>
                      <Link 
                        href="/blogs/write" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaPen className="mr-2" />
                        Write Blog
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/blogs/login"
                    className="px-5 py-2.5 bg-white text-[#c60000] rounded-md 
                             hover:bg-[#c60000] hover:text-white border border-[#c60000]
                             transition-all duration-200 font-medium text-base"
                  >
                    Login / Sign Up
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex items-center justify-center p-2 rounded-md text-[#c60000] hover:text-white bg-white hover:bg-[#c60000] border border-[#c60000] transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Now outside the header element */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[60] bg-white shadow-lg overflow-y-auto"
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 p-3 rounded-full text-[#c60000] hover:text-white bg-white hover:bg-[#c60000] border border-[#c60000] transition-all duration-200 z-[70]"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes className="text-xl" />
            </motion.button>
            
            <div className="flex flex-col h-full bg-white pt-[12px]">
              {/* Logo in Mobile Menu */}
              <div className="px-6 pt-6 pb-4 border-b-2 border-[#c60000] bg-white">
                <div className="relative w-36 h-14 mx-auto">
                  <Image
                    src="/logo.png"
                    alt="Brandovert Logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex flex-col p-6 bg-white">
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-[#333]">Navigation</h2>
                  <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#c60000]"></div>
                </div>
                
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`py-3 px-4 block rounded-md mb-2 transition-all duration-200 border ${
                        activeLink === link.href || (link.href === '/blogs' && activeLink.startsWith('/blogs'))
                          ? 'bg-[#c60000] text-white border-[#c60000]' 
                          : 'bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Login/Profile in Mobile Menu */}
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.1 }}
                    >
                      <Link
                        href="/blogs/profile"
                        className="py-3 px-4 block rounded-md mb-2 transition-all duration-200 border bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg font-medium flex items-center">
                          <FaUser className="mr-2" />
                          My Profile
                        </span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    >
                      <Link
                        href="/blogs/write"
                        className="py-3 px-4 block rounded-md mb-2 transition-all duration-200 border bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg font-medium flex items-center">
                          <FaPen className="mr-2" />
                          Write Blog
                        </span>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 2) * 0.1 }}
                    >
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-3 px-4 block rounded-md mb-2 transition-all duration-200 border bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white text-left"
                      >
                        <span className="text-lg font-medium flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Sign Out
                        </span>
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Link
                      href="/blogs/login"
                      className="py-3 px-4 block rounded-md mb-2 transition-all duration-200 border bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">Login / Sign Up</span>
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Social Icons */}
              <div className="px-6 py-6 border-t border-gray-200 bg-white">
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-[#333]">Connect</h2>
                  <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#c60000]"></div>
                </div>
                
                <div className="flex justify-start space-x-4">
                  <motion.a
                    href="https://instagram.com/brandoverts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c60000] bg-white p-4 rounded-md border border-[#c60000] hover:bg-[#c60000] hover:text-white transition-all duration-200"
                    aria-label="Instagram"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaInstagram className="text-2xl" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/company/brandovert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c60000] bg-white p-4 rounded-md border border-[#c60000] hover:bg-[#c60000] hover:text-white transition-all duration-200"
                    aria-label="LinkedIn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin className="text-2xl" />
                  </motion.a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto p-6 border-t border-gray-200 bg-white">
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-[#333]">Contact Us</h2>
                  <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#c60000]"></div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <motion.a
                    href="https://wa.me/+919153832948"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                    aria-label="WhatsApp"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-3 mb-2 rounded-md bg-[#c60000] hover:bg-white hover:text-[#c60000] text-white border border-[#c60000] transition-all duration-200">
                      <FaWhatsapp className="text-xl" />
                    </div>
                    <span className="text-sm text-[#333]">WhatsApp</span>
                  </motion.a>
                  <motion.a
                    href="tel:+919153832948"
                    className="flex flex-col items-center"
                    aria-label="Phone"
                    whileHover={{ scale: 1.05 }}
                  >
                    <a href="tel:+918235377886" className="flex flex-col items-center">
                      <div className="p-3 mb-2 rounded-md bg-[#c60000] hover:bg-white hover:text-[#c60000] text-white border border-[#c60000] transition-all duration-200">
                        <IoCall className="text-xl" />
                      </div>
                      <span className="text-sm text-[#333]">Call</span>
                    </a>
                  </motion.a>
                  <motion.a
                    href="mailto:brandoverts@gmail.com"
                    className="flex flex-col items-center"
                    aria-label="Email"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-3 mb-2 rounded-md bg-[#c60000] hover:bg-white hover:text-[#c60000] text-white border border-[#c60000] transition-all duration-200">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <span className="text-sm text-[#333]">Email</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 