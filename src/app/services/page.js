'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/Components/header'
import { FaCode, FaMobile, FaVideo, FaRocket, FaEllipsisH, FaTimes, FaArrowRight, FaCheck, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import useFormSubmit from '@/hooks/useFormSubmit' // Add this import

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formSelectedService, setFormSelectedService] = useState('')
  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
  
  const { submitForm, isSubmitting } = useFormSubmit()

  // Update formData when formSelectedService changes
  useEffect(() => {
    if (formSelectedService) {
      setFormData(prev => ({
        ...prev,
        service: formSelectedService
      }))
    }
  }, [formSelectedService])

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
      await submitForm(formData, 'services', () => {
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        })
        setFormSelectedService('')
      })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const services = [
    { 
      icon: FaCode, 
      name: 'Web Development', 
      desc: 'Custom websites that drive results', 
      color: '#c60000',
      longDesc: 'We create performance-focused, visually stunning websites optimized for user experience and conversion. Whether it\'s a corporate site, e-commerce platform, or portfolio, we deliver high-quality custom solutions that align with your brand and business goals.',
      features: [
        'Responsive Design',
        'E-commerce Solutions',
        'CMS Integration',
        'Performance Optimization',
        'SEO-friendly Structure',
        'Custom Web Applications'
      ]
    },
    { 
      icon: FaMobile, 
      name: 'App Development', 
      desc: 'Native & cross-platform apps', 
      color: '#c60000',
      longDesc: 'From concept to deployment, we build responsive and scalable mobile applications for iOS, Android, and cross-platform frameworks like Flutter and React Native. Our apps are designed to perform seamlessly and enhance user engagement.',
      features: [
        'iOS Development',
        'Android Development',
        'Cross-platform Solutions',
        'UI/UX Design',
        'App Maintenance',
        'API Integration'
      ]
    },
    { 
      icon: FaVideo, 
      name: 'UGC Video Creation', 
      desc: 'Authentic content that connects', 
      color: '#c60000',
      longDesc: 'We help brands connect with their audience through authentic, user-generated content. Our video creation services focus on storytelling and relatability—ideal for social media campaigns, product showcases, and brand awareness.',
      features: [
        'Social Media Content',
        'Product Demonstrations',
        'Testimonial Videos',
        'Brand Storytelling',
        'Video Editing',
        'Content Strategy'
      ]
    },
    { 
      icon: FaRocket, 
      name: 'Digital Marketing', 
      desc: 'Growth-focused strategies', 
      color: '#c60000',
      longDesc: 'Brandovert offers data-driven digital marketing services including SEO, PPC, social media management, email campaigns, and content marketing. Our strategies are designed to boost visibility, engagement, and conversions.',
      features: [
        'SEO Optimization',
        'PPC Campaigns',
        'Social Media Management',
        'Email Marketing',
        'Content Strategy',
        'Analytics & Reporting'
      ]
    },
    { 
      icon: FaEllipsisH, 
      name: 'Other Services', 
      desc: 'More specialized solutions', 
      color: '#c60000',
      longDesc: 'We also provide a wide range of custom digital solutions such as branding, UI/UX design, CRM integrations, analytics setup, and more—tailored to your specific needs and growth goals.',
      features: [
        'Brand Identity Design',
        'UI/UX Consulting',
        'CRM Integration',
        'Analytics Setup',
        'Custom Solutions',
        'Technical Consulting'
      ]
    }
  ]

  const handleServiceClick = (service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedService(null), 300) // Clear after animation
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#c60000] mb-6">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                We offer comprehensive digital solutions to help your business thrive in the digital landscape.
                Explore our services and discover how we can help you achieve your goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-md bg-[#c60000]/10 mr-4">
                        <service.icon className="text-2xl text-[#c60000]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{service.desc}</p>
                    <p className="text-sm text-gray-500 line-clamp-3">{service.longDesc}</p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm font-medium text-[#c60000]">Learn More</span>
                    <FaArrowRight className="text-[#c60000]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        
        {/* Service Detail Modal */}
        <AnimatePresence>
          {isModalOpen && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative p-6 md:p-8">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                      <div className="p-4 rounded-lg bg-[#c60000]/10 inline-block mb-6">
                        <selectedService.icon className="text-4xl text-[#c60000]" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedService.name}</h2>
                      <p className="text-xl text-gray-600 mb-4">{selectedService.desc}</p>
                      <p className="text-gray-700 mb-8">{selectedService.longDesc}</p>
                      
                      <div className="mt-auto space-y-3">
                        <a 
                          href="#enquiry" 
                          className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-300 w-full justify-center"
                          onClick={closeModal}
                        >
                          Request a Quote
                          <FaArrowRight className="ml-2" />
                        </a>
                        <div className="flex gap-3 w-full">
                          <a 
                            href="https://wa.me/+919999999999?text=I'm%20interested%20in%20your%20services" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                          >
                            <FaWhatsapp className="mr-2" />
                            WhatsApp
                          </a>
                          <a 
                            href="tel:+918235377886" 
                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                          >
                            <FaPhone className="mr-2" />
                            Call Us
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">What We Offer</h3>
                        <ul className="space-y-3">
                          {selectedService.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-3 mt-1 text-[#c60000]">
                                <FaCheck />
                              </span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-8 p-6 border border-gray-200 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Us</h3>
                        <p className="text-gray-700 mb-4">
                          At Brandovert, we combine creativity with technical expertise to deliver solutions 
                          that not only look great but also perform exceptionally well.
                        </p>
                        <p className="text-gray-700">
                          Our team of experts is dedicated to helping your business succeed in the digital world 
                          through innovative strategies and cutting-edge technologies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all" 
                    value={formSelectedService} 
                    onChange={(e) => setFormSelectedService(e.target.value)} 
                    required 
                  > 
                    <option value="">Select a Service</option> 
                    {services.map(service => ( 
                      <option key={service.name} value={service.name}> 
                        {service.name} 
                      </option> 
                    ))} 
                  </select> 
                </div> 
                <div> 
                  <label className="block text-sm font-medium mb-2 text-gray-700">Message</label> 
                  <textarea 
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
      </main>
    </>
  )
}