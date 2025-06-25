'use client'

import { useState, useEffect } from 'react'
import BlogHeader from '@/Components/BlogHeader'
import BlogEditor from '@/Components/BlogEditor'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function EditBlogPage({ params }) {
  const { id } = params
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/blogs/login')
        return
      }
      
      fetchBlog()
    }
  }, [user, authLoading, id, router])
  
  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/blogs/${id}`)
      
      if (response.data.success) {
        const blogData = response.data.data
        
        // Check if user is the author
        if (user.id !== blogData.author._id) {
          setError('You are not authorized to edit this blog')
          toast.error('You are not authorized to edit this blog')
          return
        }
        
        setBlog(blogData)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('Failed to load blog')
      toast.error('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }
  
  if (authLoading || loading) {
    return (
      <>
        <BlogHeader />
        <main className="min-h-screen bg-white pt-24 md:pt-32">
          <div className="container mx-auto px-4">
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c60000]"></div>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  if (error || !blog) {
    return (
      <>
        <BlogHeader />
        <main className="min-h-screen bg-white pt-24 md:pt-32">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Error</h2>
              <p className="text-gray-500 mb-6">{error || 'Unable to load blog for editing'}</p>
              <button
                onClick={() => router.push('/blogs')}
                className="px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4">
          <BlogEditor blog={blog} isEdit={true} />
        </div>
      </main>
    </>
  )
} 