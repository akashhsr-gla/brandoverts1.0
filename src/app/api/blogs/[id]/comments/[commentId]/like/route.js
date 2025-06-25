import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// POST toggle like on comment
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
    const commentId = context.params.commentId;
    
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
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
    
    // Find comment
    const comment = blog.comments.id(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    const userId = authResult.user.id;
    
    // Initialize likes array if it doesn't exist
    if (!comment.likes) {
      comment.likes = [];
    }
    
    // Check if user already liked the comment
    const likeIndex = comment.likes.findIndex(
      like => like && like.toString() === userId
    );
    
    let message;
    let isLiked = false;
    
    if (likeIndex === -1) {
      // Add like
      comment.likes.push(userId);
      message = 'Comment liked successfully';
      isLiked = true;
    } else {
      // Remove like
      comment.likes.splice(likeIndex, 1);
      message = 'Comment unliked successfully';
      isLiked = false;
    }
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message,
      data: {
        likeCount: comment.likes.length,
        isLiked: isLiked
      }
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle comment like' },
      { status: 500 }
    );
  }
} 