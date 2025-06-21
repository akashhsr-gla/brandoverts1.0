import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Reminder from '@/models/Reminder';
import { withAuth } from '@/lib/authMiddleware';

// POST add a reminder to a lead
export const POST = withAuth(async (request, context) => {
  try {
    await connectToDatabase();
    
    const id = context.params.id;
    const body = await request.json();
    const { message, datetime } = body;
    
    if (!message || !datetime) {
      return NextResponse.json(
        { success: false, message: 'Reminder message and datetime are required' },
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
    
    // Create the reminder
    const reminder = await Reminder.create({
      leadId: id,
      message,
      datetime: new Date(datetime),
      createdAt: new Date()
    });
    
    // Add reminder to lead
    lead.reminders.push(reminder._id);
    await lead.save();
    
    return NextResponse.json(
      { success: true, message: 'Reminder created successfully', data: reminder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create reminder' },
      { status: 500 }
    );
  }
}); 