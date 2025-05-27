import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export async function POST(request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const { name, email, service, message, source } = body;
    
    if (!name || !email || !service || !message || !source) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      service,
      message,
      source,
    });
    
    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully', data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}