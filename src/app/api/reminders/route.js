import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { withAuth } from '@/lib/authMiddleware';

// GET all reminders
export const GET = withAuth(async (request) => {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let query = {};
    
    // If date is provided, filter reminders for that date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.datetime = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const reminders = await Reminder.find(query)
      .populate('leadId', 'clientName projectTitle')
      .sort({ datetime: 1 });
    
    return NextResponse.json(
      { success: true, data: reminders },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}); 