import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/lib/authMiddleware';

export const GET = withAuth(async (request) => {
  try {
    await connectToDatabase();
    
    // Get all leads
    const leads = await Lead.find({}).sort({ updatedAt: -1 });
    
    // Prepare data for Excel
    const data = leads.map(lead => {
      // Get the latest step if available
      const latestStep = lead.steps && lead.steps.length > 0 
        ? lead.steps[lead.steps.length - 1].text 
        : '';
      
      return {
        'Client Name': lead.clientName || '',
        'Phone': lead.contactInfo?.phone || '',
        'Instagram': lead.contactInfo?.instagram || '',
        'LinkedIn': lead.contactInfo?.linkedin || '',
        'Email': lead.email || '',
        'Project Title': lead.projectTitle || '',
        'Project Status': lead.projectStatus || '',
        'Status Comment': lead.statusComment || '',
        'Assigned To': lead.assignedTo || '',
        'Latest Step': latestStep,
        'Last Updated': new Date(lead.updatedAt).toLocaleDateString()
      };
    });
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers for file download
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="brandoverts_leads.xlsx"');
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to export leads' },
      { status: 500 }
    );
  }
}); 