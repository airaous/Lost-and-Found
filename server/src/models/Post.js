import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['lost', 'found']
    },
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model('Post', postSchema);
