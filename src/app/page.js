'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/Components/header'
import { FaCode, FaMobile, FaVideo, FaRocket, FaEllipsisH, FaPhone, FaWhatsapp, FaArrowRight, FaTimes } from 'react-icons/fa'
import { IoCall } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion'
import useFormSubmit from '@/hooks/useFormSubmit' // Add this import

export default function Home() {
  const [selectedService, setSelectedService] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeService, setActiveService] = useState(null)
  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
  
  const { submitForm, isSubmitting } = useFormSubmit()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      await submitForm(formData, 'home', () => {
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

  const services = [
    { 
      icon: FaCode, 
      name: 'Web Development', 
      desc: 'Custom websites that drive results', 
      color: '#c60000',
      details: [
        'Custom Website Development',
        'E-commerce Solutions',
        'Web Applications',
        'CMS Development',
        'API Integration',
        'Responsive Design'
      ]
    },
    { 
      icon: FaMobile, 
      name: 'App Development', 
      desc: 'Native & cross-platform apps', 
      color: '#c60000',
      details: [
        'iOS App Development',
        'Android App Development',
        'Cross-platform Solutions',
        'App UI/UX Design',
        'App Maintenance',
        'App Store Optimization'
      ]
    },
    { 
      icon: FaVideo, 
      name: 'UGC Video Creation', 
      desc: 'Authentic content that connects', 
      color: '#c60000',
      details: [
        'Social Media Content',
        'Product Demonstrations',
        'Behind-the-scenes',
        'Customer Testimonials',
        'Brand Stories',
        'Tutorial Videos'
      ]
    },
    { 
      icon: FaRocket, 
      name: 'Digital Marketing', 
      desc: 'Growth-focused strategies', 
      color: '#c60000',
      details: [
        'Social Media Marketing',
        'Content Marketing',
        'Email Marketing',
        'PPC Advertising',
        'Marketing Analytics',
        'Campaign Management'
      ]
    },
    { 
      icon: FaEllipsisH, 
      name: 'Other Services', 
      desc: 'More specialized solutions', 
      color: '#c60000',
      details: [
        'Brand Design',
        'SEO Services',
        'Content Creation',
        'Graphic Design',
        'UI/UX Design',
        'Consulting Services'
      ]
    }
  ]

  const handleServiceClick = (service) => {
    setActiveService(service)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 md:pt-0 bg-gradient-to-b from-red-600 via-red-200 to-white">

            <div className="absolute inset-0 bg-custom-gradient" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center max-w-5xl mx-auto"
            >
           <div className="relative w-[135%] max-w-[270px] aspect-square mx-auto sm:w-full sm:max-w-[200px]">
  <Image
    src="/hero.png"
    alt="Brandovert Logo"
    fill
    className="object-contain"
    priority
  />
</div>


              <h1 className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 text-[#c60000] leading-tight">
                Transform Your Brand Identity
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 md:mb-12 max-w-3xl mx-auto px-2"
              >
                We craft exceptional digital experiences that elevate your brand presence 
                and drive meaningful connections with your audience.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-4 md:gap-6"
              >
                <a 
  href="#enquiry" 
  className="btn-primary bg-[#c60000] hover:bg-[#a80000] text-white group text-sm md:text-base px-6 py-3 rounded-md transition-all duration-200 border border-[#c60000]"
>
  Start Your Project
  <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
</a>

<a 
  href="#services" 
  className="btn-primary bg-[#c60000] hover:bg-[#a80000] text-white text-sm md:text-base px-6 py-3 rounded-md transition-all duration-200 border border-[#c60000]"
>
  Explore Services
</a>

              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
          >
            <div className="animate-bounce">
              <FaArrowRight className="rotate-90 text-2xl text-[#c60000]" />
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-3xl md:text-5xl font-bold text-[#c60000] relative pb-4 after:content-[''] after:absolute after:w-24 after:h-1 after:bg-[#c60000] after:bottom-0 after:left-1/2 after:-translate-x-1/2"
            >
              Our Services
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white shadow-lg hover:shadow-xl rounded-lg p-6 group cursor-pointer transition-all duration-300 border border-[#c60000]/20 hover:border-[#c60000]"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-gradient-to-br rounded-lg opacity-0 group-hover:opacity-5 transition-opacity"
                      style={{ background: service.color }}
                    />
                    <service.icon className="text-4xl md:text-5xl text-[#c60000] mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-[#333]">{service.name}</h3>
                    <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                      placeholder="brandoverts@gmail.com"
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
            href="tel:+919153832948"
            whileHover={{ scale: 1.1 }}
            className="p-3 md:p-4 rounded-full bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
          >
            <IoCall className="text-xl md:text-2xl" />
          </motion.a>
          <motion.a
            href="https://wa.me/+919153832948"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="p-3 md:p-4 rounded-full bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
          >
            <FaWhatsapp className="text-xl md:text-2xl" />
          </motion.a>
        </div>

        {/* Service Modal */}
        <AnimatePresence>
          {isModalOpen && activeService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-4 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-xl border border-[#c60000]/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-[#c60000] transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="p-3 md:p-4 rounded-lg"
                    style={{ background: activeService.color }}
                  >
                    <activeService.icon className="text-3xl md:text-4xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#333] mb-1">
                      {activeService.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">{activeService.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {activeService.details.map((detail, index) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: activeService.color }} />
                      <span className="text-sm md:text-base text-gray-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <motion.a
                      href="https://wa.me/+919153832948"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] rounded-lg transition-all w-full sm:w-auto justify-center"
                    >
                      <FaWhatsapp className="text-lg md:text-xl" />
                      <span className="font-medium text-sm md:text-base">WhatsApp</span>
                    </motion.a>
                    <motion.a
                      href="tel:+919153832948"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] rounded-lg transition-all w-full sm:w-auto justify-center"
                    >
                      <a href="tel:+918235377886" className="flex flex-row justify-between">
  <div>
    <IoCall className="text-lg md:text-xl mr-2" />
  </div>
  <span className="font-medium text-sm md:text-base"> Call</span>
</a>
                    </motion.a>
                  </div>
                  <motion.a
                    href="#enquiry"
                    onClick={() => {
                      setSelectedService(activeService.name)
                      setIsModalOpen(false)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#c60000] text-white hover:bg-white hover:text-[#c60000] border border-[#c60000] rounded-lg transition-all w-full sm:w-auto justify-center"
                  >
                    <span className="font-medium text-sm md:text-base">Get Started</span>
                    <FaArrowRight className="text-lg md:text-xl" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
