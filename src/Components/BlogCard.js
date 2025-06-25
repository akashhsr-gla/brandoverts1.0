import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaUser, FaClock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BlogCard({ blog, refreshBlogs }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(blog.isLiked || false);
  const [likeCount, setLikeCount] = useState(blog.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/blogs/login');
      return;
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      const response = await axios.post(`/api/blogs/${blog._id}/like`);
      
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikeCount(response.data.data.likeCount);
        
        if (refreshBlogs) {
          refreshBlogs();
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to like blog');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/blogs/login');
      return;
    }
    
    router.push(`/blogs/${blog._id}#comments`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <Link href={`/blogs/${blog._id}`} className="block">
        <div className="relative h-48 w-full">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#c60000]/80 to-[#c60000] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{blog.title.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center mb-3 text-sm text-gray-500">
            <div className="flex items-center">
              <FaUser className="mr-1 text-[#c60000]" />
              <span>{blog.author?.displayName || blog.author?.username || 'Anonymous'}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <FaClock className="mr-1 text-[#c60000]" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{blog.title}</h3>
          
          <div className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(blog.content.replace(/<[^>]*>?/gm, ''), 150)}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                isLiked 
                  ? 'text-white bg-[#c60000]' 
                  : 'text-[#c60000] bg-white border border-[#c60000]'
              } transition-colors duration-200`}
              disabled={isLiking}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span>{likeCount}</span>
            </button>
            
            <button 
              onClick={handleCommentClick}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-[#c60000] bg-white border border-[#c60000] hover:bg-[#c60000] hover:text-white transition-colors duration-200"
            >
              <FaComment />
              <span>{blog.commentCount || 0}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 