'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaRegHeart, FaComment, FaUser, FaClock, FaEdit, FaTrash, FaArrowLeft, FaTags } from 'react-icons/fa'
import BlogHeader from '@/Components/BlogHeader'
import CommentSection from '@/Components/CommentSection'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function BlogPostPage({ params }) {
  const { id } = params
  const { user } = useAuth()
  const router = useRouter()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/blogs/${id}`)

      if (response.data.success) {
        setBlog(response.data.data)
        
        // Update document title for SEO
        document.title = `${response.data.data.title} | Brandoverts Blog`
        
        // Check if user has liked this blog
        if (user && response.data.data.likes) {
          const liked = response.data.data.likes.some(
            likeId => likeId === user.id
          )
          setIsLiked(liked)
        }
        
        setLikeCount(response.data.data.likes?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('Failed to load blog post')
      toast.error('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  // Generate meta description from blog content
  const getMetaDescription = () => {
    if (!blog) return ''
    // Strip HTML tags and get first 160 characters
    return blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
  }

  const handleLikeClick = async () => {
    if (!user) {
      router.push('/blogs/login')
      return
    }
    
    if (isLiking) return
    
    setIsLiking(true)
    
    try {
      const response = await axios.post(`/api/blogs/${id}/like`)
      
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked)
        setLikeCount(response.data.data.likeCount)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to like blog')
    } finally {
      setIsLiking(false)
    }
  }

  const handleEditClick = () => {
    router.push(`/blogs/edit/${id}`)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await axios.delete(`/api/blogs/${id}`)
      
      if (response.data.success) {
        toast.success('Blog deleted successfully')
        router.push('/blogs')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const isAuthor = user && blog && user.id === blog.author?._id

  if (loading) {
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
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Blog post not found</h2>
              <p className="text-gray-500 mb-6">{error || 'The blog post you are looking for does not exist'}</p>
              <Link
                href="/blogs"
                className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
              >
                <FaArrowLeft className="mr-2" />
                Back to Blogs
              </Link>
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
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/blogs"
                className="inline-flex items-center text-[#c60000] hover:underline"
              >
                <FaArrowLeft className="mr-2" />
                Back to Blogs
              </Link>
            </div>
            
            {/* Blog Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="relative h-80 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
              
              {/* Author and Date */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center mr-4">
                  {blog.author?.profileImage ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={blog.author.profileImage}
                        alt={blog.author.displayName || blog.author.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#c60000] flex items-center justify-center text-white font-bold mr-2">
                      {(blog.author?.displayName || blog.author?.username || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{blog.author?.displayName || blog.author?.username || 'Anonymous'}</span>
                </div>
                
                <div className="flex items-center">
                  <FaClock className="mr-1 text-[#c60000]" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                
                {/* Edit/Delete buttons for author */}
                {isAuthor && (
                  <div className="ml-auto flex space-x-2">
                    <button
                      onClick={handleEditClick}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                      title="Edit blog"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-500"
                      title="Delete blog"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-6">
                  <FaTags className="text-gray-500" />
                  {blog.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blogs?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Like and Comment counts */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleLikeClick}
                  disabled={isLiking}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    isLiked
                      ? 'bg-[#c60000] text-white'
                      : 'bg-white text-[#c60000] border border-[#c60000]'
                  } transition-all hover:opacity-90`}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
                
                <a
                  href="#comments"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#c60000] border border-[#c60000] rounded-md hover:bg-gray-50"
                >
                  <FaComment />
                  <span>{blog.comments?.length || 0} {blog.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
                </a>
              </div>
            </motion.div>
            
            {/* Blog Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Comments Section */}
            <CommentSection blogId={id} />
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Blog</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </>
  )
} 