import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'brandoverts-leads-secret-key';

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