'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaUser, FaEdit, FaPen, FaHeart, FaComment, FaClock, FaThumbsUp } from 'react-icons/fa'
import BlogHeader from '@/Components/BlogHeader'
import BlogCard from '@/Components/BlogCard'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('blogs')
  const [userBlogs, setUserBlogs] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [userComments, setUserComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: ''
  })
  
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/blogs/login')
        return
      }
      
      setProfileData({
        displayName: user.displayName || '',
        bio: user.bio || ''
      })
      
      if (activeTab === 'blogs') {
        fetchUserBlogs()
      } else if (activeTab === 'likes') {
        fetchUserLikes()
      } else if (activeTab === 'comments') {
        fetchUserComments()
      }
    }
  }, [user, authLoading, router, activeTab])
  
  const fetchUserBlogs = async () => {
    try {
      setLoading(true)
      // In a real app, you would have an API endpoint to get user's blogs
      // For now, we'll fetch all blogs and filter by author
      const response = await axios.get('/api/blogs')
      
      if (response.data.success) {
        // Filter blogs by author
        const blogs = response.data.data.filter(
          blog => blog.author?._id === user.id
        )
        setUserBlogs(blogs)
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error)
      toast.error('Failed to load your blogs')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLikes = async () => {
    try {
      setLoading(true)
      // In a real app, we would have a dedicated endpoint for this
      // For now, we'll fetch all blogs and filter those liked by the user
      const response = await axios.get('/api/blogs')
      
      if (response.data.success) {
        // We need to fetch full blog details to get likes
        const likedBlogs = []
        
        for (const blog of response.data.data) {
          const detailResponse = await axios.get(`/api/blogs/${blog._id}`)
          if (detailResponse.data.success) {
            const blogDetail = detailResponse.data.data
            if (blogDetail.likes && blogDetail.likes.includes(user.id)) {
              likedBlogs.push(blogDetail)
            }
          }
        }
        
        setUserLikes(likedBlogs)
      }
    } catch (error) {
      console.error('Error fetching liked blogs:', error)
      toast.error('Failed to load your liked blogs')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserComments = async () => {
    try {
      setLoading(true);
      // In a real app, we would have a dedicated endpoint for this
      // For now, we'll fetch all blogs and extract comments by the user
      const response = await axios.get('/api/blogs');
      
      if (response.data.success) {
        const userCommentsList = [];
        
        // Use Promise.all to fetch blog details in parallel
        await Promise.all(response.data.data.map(async (blog) => {
          try {
            const detailResponse = await axios.get(`/api/blogs/${blog._id}`);
            if (detailResponse.data.success) {
              const blogDetail = detailResponse.data.data;
              
              if (blogDetail.comments && blogDetail.comments.length > 0) {
                // Find comments by this user
                const userCommentsOnBlog = blogDetail.comments.filter(
                  comment => comment.author && comment.author._id === user.id
                );
                
                if (userCommentsOnBlog.length > 0) {
                  userCommentsOnBlog.forEach(comment => {
                    userCommentsList.push({
                      ...comment,
                      blogId: blogDetail._id,
                      blogTitle: blogDetail.title,
                      blogAuthor: blogDetail.author
                    });
                  });
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching blog ${blog._id}:`, error);
          }
        }));
        
        // Sort comments by date (newest first)
        userCommentsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setUserComments(userCommentsList);
      }
    } catch (error) {
      console.error('Error fetching user comments:', error);
      toast.error('Failed to load your comments');
    } finally {
      setLoading(false);
    }
  }
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    try {
      const result = await updateProfile(profileData)
      
      if (result.success) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }
  
  if (authLoading) {
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
  
  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="md:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-32">
                  {/* Profile Info */}
                  <div className="text-center mb-6">
                    <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden mb-4 bg-[#c60000] flex items-center justify-center text-white text-3xl font-bold">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.displayName || user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{(user?.displayName || user?.username || 'A').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{user?.displayName || user?.username}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('blogs')}
                      className={`w-full py-2 px-4 rounded-md text-left flex items-center ${
                        activeTab === 'blogs'
                          ? 'bg-[#c60000] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FaPen className="mr-2" />
                      My Blogs
                    </button>
                    <button
                      onClick={() => setActiveTab('likes')}
                      className={`w-full py-2 px-4 rounded-md text-left flex items-center ${
                        activeTab === 'likes'
                          ? 'bg-[#c60000] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FaHeart className="mr-2" />
                      My Likes
                    </button>
                    <button
                      onClick={() => setActiveTab('comments')}
                      className={`w-full py-2 px-4 rounded-md text-left flex items-center ${
                        activeTab === 'comments'
                          ? 'bg-[#c60000] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FaComment className="mr-2" />
                      My Comments
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full py-2 px-4 rounded-md text-left flex items-center ${
                        activeTab === 'profile'
                          ? 'bg-[#c60000] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FaUser className="mr-2" />
                      Edit Profile
                    </button>
                  </nav>
                  
                  {/* Write Blog Button */}
                  <div className="mt-6">
                    <Link
                      href="/blogs/write"
                      className="block w-full py-2 px-4 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all text-center"
                    >
                      Write New Blog
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:w-3/4">
                {activeTab === 'blogs' && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Blogs</h1>
                    
                    {loading ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c60000]"></div>
                      </div>
                    ) : userBlogs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userBlogs.map(blog => (
                          <BlogCard key={blog._id} blog={blog} refreshBlogs={fetchUserBlogs} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-5xl mb-4 text-gray-300">📝</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No blogs yet</h3>
                        <p className="text-gray-500 mb-6">Start writing your first blog post!</p>
                        <Link
                          href="/blogs/write"
                          className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
                        >
                          <FaPen className="mr-2" />
                          Write a Blog
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'likes' && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                      Blogs You've Liked
                    </h1>
                    
                    {loading ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c60000]"></div>
                      </div>
                    ) : userLikes.length > 0 ? (
                      <div className="space-y-6">
                        {userLikes.map(blog => (
                          <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col md:flex-row"
                          >
                            {blog.coverImage && (
                              <div className="md:w-1/4 h-48 md:h-auto relative">
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            
                            <div className={`p-6 flex-1 ${!blog.coverImage ? 'md:border-l' : ''}`}>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <div className="flex items-center mr-4">
                                  {blog.author?.profileImage ? (
                                    <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                                      <Image
                                        src={blog.author.profileImage}
                                        alt={blog.author.displayName || blog.author.username}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-[#c60000] flex items-center justify-center text-white text-xs font-bold mr-2">
                                      {(blog.author?.displayName || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span>{blog.author?.displayName || blog.author?.username}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <FaClock className="mr-1 text-[#c60000]" />
                                  <span>{formatDate(blog.createdAt)}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-xl font-bold text-gray-800 mb-2">
                                <Link href={`/blogs/${blog._id}`} className="hover:text-[#c60000]">
                                  {blog.title}
                                </Link>
                              </h3>
                              
                              <div className="mb-4 text-gray-600 line-clamp-2">
                                {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center text-[#c60000]">
                                    <FaHeart className="mr-1" />
                                    <span>{blog.likes?.length || 0}</span>
                                  </div>
                                  <div className="flex items-center text-gray-500">
                                    <FaComment className="mr-1" />
                                    <span>{blog.comments?.length || 0}</span>
                                  </div>
                                </div>
                                
                                <Link
                                  href={`/blogs/${blog._id}`}
                                  className="text-[#c60000] font-medium hover:underline flex items-center"
                                >
                                  Read More
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-5xl mb-4 text-gray-300">❤️</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No liked blogs yet</h3>
                        <p className="text-gray-500 mb-6">Explore blogs and like the ones you enjoy!</p>
                        <Link
                          href="/blogs"
                          className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
                        >
                          Explore Blogs
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                      Your Comments
                    </h1>
                    
                    {loading ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c60000]"></div>
                      </div>
                    ) : userComments.length > 0 ? (
                      <div className="space-y-4">
                        {userComments.map(comment => (
                          <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3 bg-[#c60000] flex items-center justify-center text-white font-bold">
                                  {(user?.displayName || user?.username || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {user?.displayName || user?.username}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(comment.createdAt)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center text-gray-500 text-sm">
                                <FaThumbsUp className="mr-1" />
                                <span>{comment.likes?.length || 0} likes</span>
                              </div>
                            </div>
                            
                            <div className="text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                              "{comment.content}"
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              <Link
                                href={`/blogs/${comment.blogId}`}
                                className="text-[#c60000] hover:underline font-medium"
                              >
                                On: {comment.blogTitle}
                              </Link>
                              
                              {comment.blogAuthor && (
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <span className="mr-1">Blog by:</span>
                                  {comment.blogAuthor.profileImage ? (
                                    <div className="relative h-5 w-5 rounded-full overflow-hidden mx-1">
                                      <Image
                                        src={comment.blogAuthor.profileImage}
                                        alt={comment.blogAuthor.displayName || comment.blogAuthor.username}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold mx-1">
                                      {(comment.blogAuthor.displayName || comment.blogAuthor.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span>{comment.blogAuthor.displayName || comment.blogAuthor.username}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-5xl mb-4 text-gray-300">💬</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No comments yet</h3>
                        <p className="text-gray-500 mb-6">Join the conversation by commenting on blogs!</p>
                        <Link
                          href="/blogs"
                          className="inline-flex items-center px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
                        >
                          Explore Blogs
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={profileData.displayName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent"
                            placeholder="How you want to be known"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent min-h-[100px]"
                            placeholder="Tell us about yourself"
                          ></textarea>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            type="submit"
                            className="px-6 py-2 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            Save Changes
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 