'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/Components/header'
import { FaFolder, FaArrowRight, FaCheck, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa'
import { IoCall } from "react-icons/io5";
import { motion } from 'framer-motion'
import useFormSubmit from '@/hooks/useFormSubmit'

export default function PortfolioPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
  
  const { submitForm, isSubmitting } = useFormSubmit();

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
      await submitForm(formData, 'portfolio', () => {
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        })
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  const portfolioItems = [
    {
      icon: '🔵',
      title: 'Adolaa',
      category: 'Website Development',
      description: 'We are currently building a modern, responsive website for Adolaa, designed to elevate their digital presence and drive engagement. The project focuses on clean UI/UX, optimized performance, and seamless functionality across devices.',
      status: 'In Progress',
      color: '#007bff'
    },
    {
      icon: '🟢',
      title: 'Pernod Ricard India',
      category: 'QR-Based Fixed Asset Management',
      description: 'Delivered a comprehensive Fixed Asset Management system powered by QR code technology for Pernod Ricard India. This solution enables efficient tracking, registration, and location management of high-value physical assets across operations.',
      status: 'Completed',
      color: '#28a745'
    },
    {
      icon: '🟡',
      title: 'SGPR',
      category: 'Compliance & Regulatory Support',
      description: 'Partnered with SGPR to streamline compliance workflows and support their regulatory documentation needs, ensuring accuracy, speed, and accountability in critical business processes.',
      status: 'Completed',
      color: '#ffc107'
    },
    {
      icon: '🔴',
      title: 'Multi-Brand Social Media',
      category: 'Digital Marketing',
      description: 'We manage social media strategy and digital marketing campaigns for a growing roster of brands across industries. Our work includes content creation, ad campaign management, analytics, and influencer collaborations—designed to maximize brand reach and ROI.',
      status: 'Ongoing',
      color: '#dc3545'
    }
  ]

  // List of services for the enquiry form dropdown
  const serviceOptions = [
    'Web Development',
    'App Development',
    'UGC Video Creation',
    'Digital Marketing',
    'Other Services'
  ];

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
                Our Portfolio
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                At Brandoverts, we collaborate with ambitious brands to create impactful digital solutions. 
                Here are some of our recent projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="text-4xl mr-4">{item.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <p className="text-[#c60000] font-medium">{item.category}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Let&rsquo;s collaborate to create a digital solution that drives results for your business.
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <a
                  href="#enquiry"
                  className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-[#a50000] transition-colors duration-300"
                >
                  Get in Touch
                  <FaArrowRight className="ml-2" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="enquiry" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#c60000] mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Have a project in mind? Fill out the form below and we&rsquo;ll get back to you shortly.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-[#c60000] text-white p-8">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <IoCall className="mr-3" />
                        <a href="tel:+919153832948" className="hover:underline">+91 9153832948</a>
                      </div>
                      <div className="flex items-center">
                        <FaWhatsapp className="mr-3" />
                        <a href="https://wa.me/919153832948" className="hover:underline">WhatsApp Us</a>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="mr-3" />
                        <a href="mailto:brandoverts@gmail.com" className="hover:underline">brandoverts@gmail.com</a>
                      </div>
                    </div>
                    <div className="mt-12">
                      <p className="text-sm opacity-80">
                        We're available Monday to Friday, 9:00 AM to 6:00 PM IST.
                      </p>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">Your Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                            placeholder="Your Name"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                          <input
                            type="email"
                            id="email"
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
                        <label htmlFor="service" className="block text-sm font-medium mb-2 text-gray-700">Service of Interest</label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select a service</option>
                          {serviceOptions.map(service => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">Your Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
                          placeholder="Tell us about your project..."
                          required
                        ></textarea>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#c60000] text-white rounded-lg hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        {!isSubmitting && <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />}
                      </motion.button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}