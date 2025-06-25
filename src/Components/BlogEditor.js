import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function BlogEditor({ blog = null, isEdit = false }) {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [coverImage, setCoverImage] = useState(blog?.coverImage || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      router.push('/blogs/login');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const blogData = {
        title,
        content,
        coverImage,
        tags: tagArray
      };
      
      let response;
      
      if (isEdit && blog) {
        response = await axios.put(`/api/blogs/${blog._id}`, blogData);
      } else {
        response = await axios.post('/api/blogs', blogData);
      }
      
      if (response.data.success) {
        toast.success(isEdit ? 'Blog updated successfully' : 'Blog published successfully');
        
        // Redirect to the blog page
        router.push(isEdit ? `/blogs/${blog._id}` : `/blogs/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(isEdit ? 'Failed to update blog' : 'Failed to publish blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For now, we'll use a placeholder URL
    // In a real application, you would upload the image to a storage service
    // and use the returned URL
    setImageUploading(true);
    
    try {
      // Simulate image upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a placeholder URL based on the file name
      const imageUrl = `/uploads/${file.name}`;
      setCoverImage(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImage('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 relative pb-2 after:content-[''] after:absolute after:w-16 after:h-1 after:bg-[#c60000] after:bottom-0 after:left-0">
        {isEdit ? 'Edit Blog' : 'Write New Blog'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
            placeholder="Enter blog title"
            required
          />
        </div>
        
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          
          {coverImage ? (
            <div className="relative rounded-md overflow-hidden h-48 bg-gray-100">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <FaTimes className="text-red-500" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <FaImage className="text-gray-400 text-3xl mb-2" />
              <p className="text-sm text-gray-500 mb-2">Upload a cover image</p>
              <label className="cursor-pointer px-4 py-2 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all">
                {imageUploading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading...
                  </span>
                ) : (
                  'Select Image'
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
              </label>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all min-h-[300px]"
            placeholder="Write your blog content here..."
            required
          ></textarea>
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c60000] focus:border-transparent transition-all"
            placeholder="e.g. marketing, design, branding"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="px-6 py-3 bg-[#c60000] text-white rounded-md hover:bg-white hover:text-[#c60000] border border-[#c60000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {isEdit ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                {isEdit ? 'Update Blog' : 'Publish Blog'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
} 