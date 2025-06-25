import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyAuth } from '@/lib/authMiddleware';

// GET all blogs
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    
    // Build query
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Get blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName profileImage')
      .lean();
      
    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    // Format blogs to include like count and comment count
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      likeCount: blog.likes.length,
      commentCount: blog.comments.length,
      // Remove large arrays to reduce payload size
      likes: undefined,
      comments: undefined
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedBlogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get blogs' },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request) {
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
    
    const body = await request.json();
    const { title, content, coverImage, tags } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Create blog
    const blog = await Blog.create({
      title,
      content,
      author: authResult.user.id,
      coverImage: coverImage || '',
      tags: tags || []
    });
    
    // Populate author details
    await blog.populate('author', 'username displayName profileImage');
    
    return NextResponse.json(
      { success: true, message: 'Blog created successfully', data: blog },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
} 