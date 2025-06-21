import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/lib/authMiddleware';

// GET all leads with optional filtering
export const GET = withAuth(async (request) => {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const assignedTo = url.searchParams.get('assignedTo');
    const search = url.searchParams.get('search');
    
    // Build query
    const query = {};
    
    if (status) {
      query.projectStatus = status;
    }
    
    if (assignedTo) {
      query.assignedTo = { $regex: assignedTo, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { projectTitle: { $regex: search, $options: 'i' } },
        { assignedTo: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    const leads = await Lead.find(query).sort({ updatedAt: -1 });
    
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
    
    const lead = await Lead.create(body);
    
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