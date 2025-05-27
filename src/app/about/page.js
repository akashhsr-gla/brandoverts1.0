"use client"
import Header from '@/Components/header'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'; // Import useState if not already present
import { FaWhatsapp, FaPhone, FaEnvelope, FaInstagram, FaLinkedin, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa' 
import { IoCall } from "react-icons/io5";// Import necessary icons if not already present

export default function AboutPage() {
  const founders = [
    {
      name: "Yuvraj Singh",
      position: "Co-Founder & CEO",
      image: "/IMG_20240604_024051_211 (1).webp",
      bio: "Leads strategic vision and business development at Brandoverts."
    },
    {
      name: "Akash Singh",
      position: "Co-Founder & CTO",
      image: "/Screenshot 2025-05-26 at 3.28.46 PM.png",
      bio: "Oversees technology implementation and digital solutions."
    },
    {
      name: "Vivek Kumar",
      position: "Co-Founder & Creative Director",
      image: "/Untitled design_20250514_235948_0000.png",
      bio: "Drives brand strategy and creative direction for clients."
    }
  ]

  // Add state for modal if needed for service section, assuming it's part of the original code
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [selectedService, setSelectedService] = useState('');

  return (
    <>
      <Header/> {/* Add the Header component here */}
      {/* Removed the extra <br></br> tag */}
      <main className="pt-24 pb-16 bg-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#333]">
            About <span className="text-[#c60000]">Brandoverts</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            We believe in crafting intelligent, performance-driven solutions that power real business growth. We&rsquo;re not just an agency — we&rsquo;re your end-to-end partner in building brands, scaling digital presence, and unlocking potential through smart technology and sharp strategy.
          </p>
          <p className="text-lg md:text-xl font-medium text-[#c60000]">
            We bring complete solutions under one roof, aligning creativity with code, and performance with purpose.
          </p>
        </section>
        {/* Founders Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">
              Meet Our <span className="text-[#c60000]">Founders</span>
            </h2>
            <p className="text-lg text-gray-700 mb-12">The visionaries behind Brandoverts mission and success</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {founders.map((founder, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="relative h-80 w-full">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#333] mb-1">{founder.name}</h3>
                    <p className="text-[#c60000] font-medium mb-3">{founder.position}</p>
                    <p className="text-gray-700">{founder.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section className="bg-gray-50 py-16 mb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#333]">
              What We <span className="text-[#c60000]">Offer</span>
            </h2>

            <div className="space-y-8">
              {[{
                title: "✅ Performance Marketing",
                description: "We drive high-ROI advertising campaigns across platforms like Google, Meta, LinkedIn, and more — ensuring your brand not only reaches the right audience, but converts them too."
              },
              {
                title: "✅ Web & App Development",
                description: "From sleek landing pages to powerful, scalable software and mobile apps — our tech team builds fast, secure, and future-ready digital products tailored to your needs."
              },
              {
                title: "✅ Branding & Design",
                description: "We help businesses stand out through compelling visual identities, intuitive UI/UX, and branding that tells your story and drives connection."
              },
              {
                title: "✅ Content Creation",
                description: "Lights, camera, conversion. From spokesperson videos and product reels to UGC and promotional content — we create media that engages and performs."
              },
              {
                title: "✅ Business Consulting",
                description: "Navigate complex challenges with confidence. Our experts guide you in strategy, operations, and digital transformation to help you grow smarter and faster."
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#c60000]">
                <h3 className="text-xl font-bold mb-3 text-[#333]">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
            </div>
          </div>
        </section>



        {/* Why Choose Us Section */}
        <section className="bg-gray-50 py-16 mb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-[#333]">
              Why Choose <span className="text-[#c60000]">Brandoverts</span>?
            </h2>
            <p className="text-xl font-medium text-center mb-12 text-[#c60000]">
              Smart Tech. Strong Strategy. Real Results.
            </p>

            <div className="space-y-6">
              {[{
                title: "Cross-functional in-house teams",
                description: "We blend technology, creativity, marketing, and strategy — all under one agile, collaborative framework."
              },
              {
                title: "Tailored approach",
                description: "Every business is different. Our software solutions and consulting services adapt to your unique stage and goals."
              },
              {
                title: "End-to-end services",
                description: "From ideation to execution, we handle every step so you can focus on what matters most — growing your business."
              },
              {
                title: "Results-driven mindset",
                description: "Our performance-based culture ensures we’re always optimizing for impact, not just output."
              },
              {
                title: "Transparent collaboration",
                description: "We keep you informed, involved, and empowered throughout our partnership — always."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start">
                <div className="bg-[#c60000] text-white rounded-full p-2 mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-[#333]">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>
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
                      <a href="tel:+918235377886" className="flex items-center space-x-2">
  <IoCall className="text-lg md:text-xl" />
  <span className="font-medium text-sm md:text-base">Call Now</span>
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
