import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: false,
    trim: true,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    instagram: {
      type: String,
      required: false
    },
    linkedin: {
      type: String,
      required: false
    }
  },
  email: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  projectTitle: {
    type: String,
    required: false,
    trim: true,
  },
  projectDetails: {
    type: String,
    trim: true,
  },
  checkboxes: {
    titleMeet: {
      type: Boolean,
      default: false,
    },
    firstCall: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  steps: [
    {
      stepNumber: Number,
      text: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reminders: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Reminder' 
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
LeadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema); 