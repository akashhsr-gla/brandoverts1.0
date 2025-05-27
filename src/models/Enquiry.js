import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  service: {
    type: String,
    required: [true, 'Service selection is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['home', 'about', 'services', 'portfolio', 'blogs'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);