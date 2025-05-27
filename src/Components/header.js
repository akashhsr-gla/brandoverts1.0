import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaWhatsapp, FaPhone, FaEnvelope, FaInstagram, FaLinkedin, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { IoCall } from "react-icons/io5";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('/')

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blogs', label: 'Blogs' },
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
            <Link href="/" className="flex items-center group">
              <motion.div 
                className="relative w-50 h-20"
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
                    activeLink === link.href ? 'text-[#c60000]' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                  {activeLink === link.href && (
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
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="#enquiry"
                  className="px-5 py-2.5 bg-[#c60000] text-white rounded-md 
                           hover:bg-white hover:text-[#c60000] border border-[#c60000]
                           transition-all duration-200 font-medium text-base flex items-center"
                >
                  Get a Quote
                  <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              {/* Removed Login Link */}
              {/*
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-white text-[#c60000] rounded-md 
                           hover:bg-[#c60000] hover:text-white border border-[#c60000]
                           transition-all duration-200 font-medium text-base"
                >
                  Login
                </Link>
              </motion.div>
              */}
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
            
            <div className="flex flex-col h-full bg-white pt-[72px]">
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
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#c60000]"></div>
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
                        activeLink === link.href 
                          ? 'bg-[#c60000] text-white border-[#c60000]' 
                          : 'bg-white text-[#333] border-[#c60000] hover:bg-[#c60000] hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Social Icons */}
              <div className="px-6 py-6 border-t border-gray-200 bg-white">
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-[#333]">Connect</h2>
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#c60000]"></div>
                </div>
                
                <div className="flex justify-start space-x-4">
                  <motion.a
                    href="https://instagram.com/brandovert"
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
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#c60000]"></div>
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
                    href="mailto:contact@brandovert.com"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="#enquiry"
                      className="w-full py-3 bg-[#c60000] text-white rounded-md
                              hover:bg-white hover:text-[#c60000] border border-[#c60000]
                              transition-all duration-200 font-medium text-lg text-center flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get a Quote
                      <FaArrowRight className="ml-2 text-sm" />
                    </Link>
                  </motion.div>
                  
                  {/* Removed Login Link */}
                  {/*
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/login"
                      className="w-full py-3 bg-white text-[#c60000] rounded-md
                              hover:bg-[#c60000] hover:text-white border border-[#c60000]
                              transition-all duration-200 font-medium text-lg text-center flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}