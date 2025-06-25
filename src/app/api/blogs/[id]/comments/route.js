import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// POST add comment
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
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Comment content is required' },
        { status: 400 }
      );
    }
    
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
    
    // Add comment
    blog.comments.push({
      content,
      author: authResult.user.id
    });
    
    await blog.save();
    
    // Populate the newly added comment's author
    await blog.populate('comments.author', 'username displayName profileImage');
    
    // Get the newly added comment
    const newComment = blog.comments[blog.comments.length - 1];
    
    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    }, { status: 201 });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// GET comments for a blog
export async function GET(request, context) {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    // Find blog
    const blog = await Blog.findById(id)
      .select('comments')
      .populate('comments.author', 'username displayName profileImage');
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Paginate comments
    const total = blog.comments.length;
    const comments = blog.comments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + limit);
    
    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get comments' },
      { status: 500 }
    );
  }
} 