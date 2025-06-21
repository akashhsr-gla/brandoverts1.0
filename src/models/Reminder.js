import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Reminder message is required'],
    trim: true,
  },
  datetime: {
    type: Date,
    required: [true, 'Reminder date and time is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema); 