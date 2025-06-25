import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import connectToDatabase from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'brandoverts-leads-secret-key';

// Hardcoded admin credentials
const ADMIN_USERNAME = 'BrandovertsAdmin';

export async function authenticateUser(request) {
  const token = request.cookies.get('brandoverts-auth-token')?.value;

  if (!token) {
    return { authenticated: false };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false };
  }
}

export async function verifyAuth(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('brandoverts-auth-token')?.value;
    
    if (!token) {
      return { success: false, message: 'Authentication required' };
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if this is the admin token
    if (decoded.username === ADMIN_USERNAME && decoded.id === 'admin-id') {
      return { 
        success: true, 
        user: {
          id: 'admin-id',
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      };
    }
    
    // For regular users, get user from database to ensure they exist
    await connectToDatabase();
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return { 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, message: 'Invalid or expired token' };
  }
}

export function withAuth(handler) {
  return async (request, ...args) => {
    const { authenticated } = await authenticateUser(request);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, ...args);
  };
}

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
} 