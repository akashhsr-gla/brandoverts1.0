import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/lib/authMiddleware';

// POST add a step to a lead
export const POST = withAuth(async (request, context) => {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json(
        { success: false, message: 'Step text is required' },
        { status: 400 }
      );
    }
    
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Calculate the next step number
    const stepNumber = lead.steps.length + 1;
    
    // Add the new step
    lead.steps.push({
      stepNumber,
      text,
      timestamp: new Date()
    });
    
    // Save the updated lead
    await lead.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Step added successfully', 
        data: lead.steps[lead.steps.length - 1] 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding step:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add step' },
      { status: 500 }
    );
  }
}); 