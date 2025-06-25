'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaSearch, FaFilter, FaPen, FaArrowRight } from 'react-icons/fa'
import BlogHeader from '@/Components/BlogHeader'
import BlogCard from '@/Components/BlogCard'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function BlogsPage() {
  const auth = useAuth() || {}
  const { user } = auth
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTag, setSelectedTag] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  })
  
  const [popularTags, setPopularTags] = useState([
    'Marketing', 'Design', 'Branding', 'Social Media', 'Web Development'
  ])

  useEffect(() => {
    fetchBlogs()
  }, [pagination.page, searchQuery, selectedTag])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/blogs', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery,
          tag: selectedTag
        }
      })

      if (response.data.success) {
        setBlogs(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Reset to page 1 when searching
    setPagination({ ...pagination, page: 1 })
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setPagination({ ...pagination, page: 1 })
    setShowFilters(false)
  }

  const handleWriteBlogClick = () => {
    if (!user) {
      router.push('/blogs/login')
    } else {
      router.push('/blogs/write')
    }
  }

  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-white pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#c60000] mb-4">Brandovert Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tips, and trends in marketing, branding, and digital strategy.
            </p>
          </motion.div>
          
          {/* Search and Filter Bar */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <FaFilter className="mr-2 text-[#c60000]" />
                  <span>Filter</span>
                </button>
                
                <motion.button
                  onClick={handleWriteBlogClick}
                  className="px-4 py-2 bg-[#c60000] text-white rounded-lg hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaPen className="mr-2" />
                  <span>Write Blog</span>
                </motion.button>
              </div>
            </div>
            
            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-medium mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTag === tag
                          ? 'bg-[#c60000] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Blog Grid */}
          <div className="mb-16">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c60000]"></div>
              </div>
            ) : blogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map(blog => (
                    <BlogCard key={blog._id} blog={blog} refreshBlogs={fetchBlogs} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 flex items-center"
                      >
                        <FaArrowRight className="mr-2 rotate-180" />
                        Previous
                      </button>
                      
                      {pagination.totalPages <= 5 ? (
                        [...Array(pagination.totalPages).keys()].map((pageNum) => (
                          <button
                            key={pageNum + 1}
                            onClick={() => setPagination({ ...pagination, page: pageNum + 1 })}
                            className={`px-4 py-2 rounded-md ${
                              pagination.page === pageNum + 1
                                ? 'bg-[#c60000] text-white'
                                : 'border border-gray-300'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        ))
                      ) : (
                        <>
                          {/* First page */}
                          <button
                            onClick={() => setPagination({ ...pagination, page: 1 })}
                            className={`px-4 py-2 rounded-md ${
                              pagination.page === 1
                                ? 'bg-[#c60000] text-white'
                                : 'border border-gray-300'
                            }`}
                          >
                            1
                          </button>
                          
                          {/* Ellipsis or second page */}
                          {pagination.page > 3 && (
                            <span className="px-4 py-2">...</span>
                          )}
                          
                          {/* Current page and surrounding pages */}
                          {[...Array(5).keys()]
                            .map(i => pagination.page - 2 + i)
                            .filter(p => p > 1 && p < pagination.totalPages)
                            .map(p => (
                              <button
                                key={p}
                                onClick={() => setPagination({ ...pagination, page: p })}
                                className={`px-4 py-2 rounded-md ${
                                  pagination.page === p
                                    ? 'bg-[#c60000] text-white'
                                    : 'border border-gray-300'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          
                          {/* Ellipsis or second-to-last page */}
                          {pagination.page < pagination.totalPages - 2 && (
                            <span className="px-4 py-2">...</span>
                          )}
                          
                          {/* Last page */}
                          <button
                            onClick={() => setPagination({ ...pagination, page: pagination.totalPages })}
                            className={`px-4 py-2 rounded-md ${
                              pagination.page === pagination.totalPages
                                ? 'bg-[#c60000] text-white'
                                : 'border border-gray-300'
                            }`}
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 flex items-center"
                      >
                        Next
                        <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4 text-gray-300">📝</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No blogs found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedTag
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to write a blog!'}
                </p>
                <motion.button
                  onClick={handleWriteBlogClick}
                  className="px-6 py-3 bg-[#c60000] text-white rounded-lg hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all inline-flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaPen className="mr-2" />
                  <span>Write a Blog</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}