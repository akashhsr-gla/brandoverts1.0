import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { withAuth } from '@/lib/authMiddleware';

// POST logout
export const POST = withAuth(async () => {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );
    
    // Clear the authentication cookie
    response.cookies.delete('brandoverts-auth-token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}); 
 