import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/authMiddleware';
import jwt from 'jsonwebtoken';

// Hardcoded credentials for leads admin
const ADMIN_USERNAME = 'BrandovertsAdmin';
const ADMIN_PASSWORD = 'BrandovertsToFinovert123$#@';
const JWT_SECRET = process.env.JWT_SECRET || 'brandoverts-leads-secret-key';

// POST login
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { identifier, password, username } = body;
    
    // Check if this is a leads admin login attempt
    if (username && password) {
      // Check against hardcoded admin credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // For admin, we'll create a token directly without database lookup
        const adminToken = jwt.sign(
          { 
            id: 'admin-id',
            username: ADMIN_USERNAME,
            role: 'admin' 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Create response
        const response = NextResponse.json(
          { 
            success: true, 
            message: 'Admin login successful',
            user: {
              username: ADMIN_USERNAME,
              id: 'admin-id',
              role: 'admin'
            }
          },
          { status: 200 }
        );
        
        // Set cookie
        response.cookies.set({
          name: 'brandoverts-auth-token',
          value: adminToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        
        return response;
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid admin credentials' },
          { status: 401 }
        );
      }
    } 
    else if (identifier && password) {
      // This is for blog user login
      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: identifier },
          { email: identifier }
        ]
      });
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
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
            email: user.email,
            displayName: user.displayName,
            id: user._id,
            role: user.role,
            profileImage: user.profileImage
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
    } else {
      return NextResponse.json(
        { success: false, message: 'Username/email and password are required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
} 