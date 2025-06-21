import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/authMiddleware';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// GET current user
export async function GET(request) {
  try {
    const { authenticated, user } = await authenticateUser(request);
    
    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    const dbUser = await User.findById(user.id).select('-passwordHash');
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: dbUser._id,
          username: dbUser.username
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication check failed' },
      { status: 500 }
    );
  }
} 