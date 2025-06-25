import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// GET single blog by ID
export async function GET(request, context) {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const blog = await Blog.findById(id)
      .populate('author', 'username displayName profileImage')
      .populate('comments.author', 'username displayName profileImage');
      
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get blog' },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(request, context) {
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
    const { title, content, coverImage, tags } = body;
    
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
    
    // Check if user is the author
    if (blog.author.toString() !== authResult.user.id) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this blog' },
        { status: 403 }
      );
    }
    
    // Update blog
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.coverImage = coverImage !== undefined ? coverImage : blog.coverImage;
    blog.tags = tags || blog.tags;
    blog.updatedAt = Date.now();
    
    await blog.save();
    await blog.populate('author', 'username displayName profileImage');
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(request, context) {
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
    
    // Check if user is the author
    if (blog.author.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this blog' },
        { status: 403 }
      );
    }
    
    // Delete blog
    await Blog.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete blog' },
      { status: 500 }
    );
  }
} 