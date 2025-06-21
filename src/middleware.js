import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'brandoverts-leads-secret-key';

export async function middleware(request) {
  // Only apply to /leads routes except login
  if (!request.nextUrl.pathname.startsWith('/leads') || 
      request.nextUrl.pathname === '/leads/login') {
    return NextResponse.next();
  }
  
  // Check for auth token
  const token = request.cookies.get('brandoverts-auth-token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    const url = new URL('/leads/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify the token
    const textEncoder = new TextEncoder();
    const secretKey = textEncoder.encode(JWT_SECRET);
    
    await jwtVerify(token, secretKey);
    
    // Token is valid, continue
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Invalid token, redirect to login
    const url = new URL('/leads/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

// Apply middleware to lead management routes
export const config = {
  matcher: '/leads/:path*',
}; 