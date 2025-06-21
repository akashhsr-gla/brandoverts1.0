import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/authMiddleware';

// Hardcoded credentials
const ADMIN_USERNAME = 'BrandovertsAdmin';
const ADMIN_PASSWORD = 'BrandovertsToFinovert123$#@';

// POST login
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check hardcoded credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Find or create the user
    let user = await User.findOne({ username });
    
    if (!user) {
      // Hash the password for storage
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Create the user
      user = await User.create({
        username: ADMIN_USERNAME,
        passwordHash
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Update user's token
    user.token = token;
    await user.save();
    
    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          username: user.username,
          id: user._id
        }
      },
      { status: 200 }
    );
    
    // Set cookie
    response.cookies.set({
      name: 'brandoverts-auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
} 