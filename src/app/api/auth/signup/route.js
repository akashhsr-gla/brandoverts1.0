import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/authMiddleware';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { username, email, password, displayName } = body;
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await User.create({
      username,
      email,
      passwordHash,
      displayName: displayName || username,
      role: 'blogger'
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Update user's token
    user.token = token;
    await user.save();
    
    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Signup successful',
        user: {
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          id: user._id,
          role: user.role
        }
      },
      { status: 201 }
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
} 