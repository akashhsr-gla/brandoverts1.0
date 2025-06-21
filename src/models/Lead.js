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
  projectStatus: {
    type: String,
    enum: [
      'First call',
      'Follow-up call',
      'Meet',
      'MoU sent',
      'MoU signed',
      'Development Phase 1',
      'Development Phase 2',
      'Development Phase 3',
      'Development Phase 4',
      'Deployment',
      'Management',
      'Termination'
    ],
    default: 'First call'
  },
  statusComment: {
    type: String,
    trim: true,
    maxlength: 100 // approximately 20 words
  },
  assignedTo: {
    type: String,
    trim: true
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
      assignedTo: {
        type: String,
        trim: true
      },
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