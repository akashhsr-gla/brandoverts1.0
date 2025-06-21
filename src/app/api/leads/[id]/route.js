import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Reminder from '@/models/Reminder';
import { withAuth } from '@/lib/authMiddleware';

// GET a single lead by ID
export const GET = withAuth(async (request, context) => {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const lead = await Lead.findById(id).populate('reminders');
    
    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: lead },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch lead' },
      { status: 500 }
    );
  }
});

// PATCH update a lead
export const PATCH = withAuth(async (request, context) => {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const body = await request.json();
    
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Update lead fields
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(
      { success: true, message: 'Lead updated successfully', data: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
});

// DELETE a lead
export const DELETE = withAuth(async (request, context) => {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }
    
    await Lead.findByIdAndDelete(id);
    
    return NextResponse.json(
      { success: true, message: 'Lead deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}); 