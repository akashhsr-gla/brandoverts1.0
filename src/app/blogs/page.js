'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/Components/header'
import { useState, useEffect } from 'react' // Update this import
import { FaArrowLeft, FaArrowRight, FaPhone, FaWhatsapp } from 'react-icons/fa'
import useFormSubmit from '@/hooks/useFormSubmit' // Add this import

export default function BlogsPage() {
  const [selectedService, setSelectedService] = useState('')
  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
  
  const { submitForm, isSubmitting } = useFormSubmit()

  // Update formData when selectedService changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service: selectedService
      }))
    }
  }, [selectedService])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitForm(formData, 'blogs', () => {
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        })
        setSelectedService('')
      })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative w-80 h-80 mx-auto mb-8">
              <Image
                src="/logo.png"
                alt="Brandovert Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-[#c60000] mb-6"
            >
              Coming Soon
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            >
              We're working on creating amazing blog content for you. 
              Check back soon for industry insights, tips, and updates!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-12"
            >
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md 
                         hover:bg-white hover:text-[#c60000] border border-[#c60000]
                         transition-all duration-200 font-medium text-lg"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </motion.div>
            
            
          </motion.div>
        </div>
        
        {/* Enquiry Section */}
        <section id="enquiry" className="py-16 md:py-32 relative bg-white">
          <div className="absolute inset-0 bg-[#c60000]/5" />
          <div className="container mx-auto px-4 max-w-4xl relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-3xl md:text-5xl font-bold text-[#c60000] relative pb-4 after:content-[''] after:absolute after:w-24 after:h-1 after:bg-[#c60000] after:bottom-0 after:left-1/2 after:-translate-x-1/2"
            >
              Start Your Project
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white shadow-lg rounded-lg p-6 md:p-8 mt-8 md:mt-16 border border-[#c60000]/20"
            >
              // Update the form in the Enquiry Section
              <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Service Required</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a Service</option>
                    {[
                      'Web Development',
                      'App Development',
                      'UGC Video Creation',
                      'Digital Marketing',
                      'Other Services'
                    ].map(service => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                    placeholder="Tell us about your project..."
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c60000] text-white rounded-lg hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                  {!isSubmitting && <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
          <motion.a
            href="tel:+919876543210"
            whileHover={{ scale: 1.1 }}
            className="p-3 md:p-4 rounded-full bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
          >
            <FaPhone className="text-xl md:text-2xl" />
          </motion.a>
          <motion.a
            href="https://wa.me/+919876543210"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="p-3 md:p-4 rounded-full bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
          >
            <FaWhatsapp className="text-xl md:text-2xl" />
          </motion.a>
        </div>
      </main>
    </>
  )
}