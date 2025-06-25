import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// POST toggle like
export async function POST(request, context) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const id = context.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    // Find blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    const userId = authResult.user.id;
    
    // Initialize likes array if it doesn't exist
    if (!blog.likes) {
      blog.likes = [];
    }
    
    // Check if user already liked the blog
    const likeIndex = blog.likes.findIndex(
      like => like && like.toString() === userId
    );
    
    let message;
    let isLiked = false;
    
    if (likeIndex === -1) {
      // Add like
      blog.likes.push(userId);
      message = 'Blog liked successfully';
      isLiked = true;
    } else {
      // Remove like
      blog.likes.splice(likeIndex, 1);
      message = 'Blog unliked successfully';
      isLiked = false;
    }
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message,
      data: {
        likeCount: blog.likes.length,
        isLiked: isLiked
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle like' },
      { status: 500 }
    );
  }
} 