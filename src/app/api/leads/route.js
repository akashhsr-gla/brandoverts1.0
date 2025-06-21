import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/lib/authMiddleware';

// GET all leads
export const GET = withAuth(async () => {
  try {
    await connectToDatabase();
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: leads },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
});

// POST create a new lead
export const POST = withAuth(async (request) => {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { clientName, contactInfo, email, projectTitle, projectDetails } = body;
    
    if (!clientName || !projectTitle) {
      return NextResponse.json(
        { success: false, message: 'Client name and project title are required' },
        { status: 400 }
      );
    }
    
    const lead = await Lead.create({
      clientName,
      contactInfo: contactInfo || {},
      email,
      projectTitle,
      projectDetails,
      checkboxes: {
        titleMeet: false,
        firstCall: false,
        closed: false
      },
      steps: []
    });
    
    return NextResponse.json(
      { success: true, message: 'Lead created successfully', data: lead },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}); 