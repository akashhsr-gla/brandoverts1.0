import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { withAuth } from '@/lib/authMiddleware';

// GET reminders with optional date filtering
export const GET = withAuth(async (request) => {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    
    let query = {};
    
    if (dateParam) {
      // Create date range for the specified date (00:00 to 23:59)
      const startDate = new Date(dateParam);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999);
      
      query.datetime = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Fetch reminders and populate lead information
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