import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaReply, FaUser, FaClock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CommentSection({ blogId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchComments();
  }, [blogId, pagination.page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blogs/${blogId}/comments`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      });

      if (response.data.success) {
        // Process comments to check if current user has liked them
        const processedComments = response.data.data.map(comment => {
          const isLiked = user && comment.likes && 
            comment.likes.some(like => like === user.id);
          
          return {
            ...comment,
            isLiked
          };
        });
        
        setComments(processedComments);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/blogs/login');
      return;
    }
    
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    
    try {
      const response = await axios.post(`/api/blogs/${blogId}/comments`, {
        content: commentText
      });
      
      if (response.data.success) {
        toast.success('Comment added successfully');
        setCommentText('');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      router.push('/blogs/login');
      return;
    }
    
    try {
      const response = await axios.post(`/api/blogs/${blogId}/comments/${commentId}/like`);
      
      if (response.data.success) {
        // Update comment likes in the UI
        setComments(comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLiked: response.data.data.isLiked,
              likes: Array(response.data.data.likeCount).fill(null)
            };
          }
          return comment;
        }));
        
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="mt-10" id="comments">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 relative pb-2 after:content-[''] after:absolute after:w-16 after:h-1 after:bg-[#c60000] after:bottom-0 after:left-0">
        Comments ({pagination.total})
      </h3>
      
      {/* Comment Form */}
      <div className="mb-8">
        <form onSubmit={handleSubmitComment} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all mb-3 min-h-[100px]"
            placeholder={user ? "Write your comment..." : "Please login to comment"}
            disabled={!user || submitting}
          ></textarea>
          
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={!user || submitting || !commentText.trim()}
              className="px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </motion.button>
          </div>
          
          {!user && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              <a href="/blogs/login" className="text-[#c60000] hover:underline">Login</a> or <a href="/blogs/signup" className="text-[#c60000] hover:underline">Sign Up</a> to join the conversation
            </p>
          )}
        </form>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c60000]"></div>
          </div>
        ) : comments.length > 0 ? (
          <>
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {comment.author?.profileImage ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={comment.author.profileImage}
                            alt={comment.author.displayName || comment.author.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#c60000] flex items-center justify-center text-white font-bold">
                          {(comment.author?.displayName || comment.author?.username || 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {comment.author?.displayName || comment.author?.username || 'Anonymous'}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" />
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-gray-700">
                        {comment.content}
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          className="flex items-center text-sm text-gray-500 hover:text-[#c60000]"
                        >
                          {comment.isLiked ? (
                            <FaHeart className="mr-1 text-[#c60000]" />
                          ) : (
                            <FaRegHeart className="mr-1" />
                          )}
                          <span>{comment.likes?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages).keys()].map((pageNum) => (
                    <button
                      key={pageNum + 1}
                      onClick={() => setPagination({ ...pagination, page: pageNum + 1 })}
                      className={`px-3 py-1 rounded-md ${
                        pagination.page === pageNum + 1
                          ? 'bg-[#c60000] text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
} 