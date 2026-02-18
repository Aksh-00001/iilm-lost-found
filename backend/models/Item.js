const mongoose = require('mongoose');

const claimRequestSchema = new mongoose.Schema({
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Books & Stationery', 'Clothing & Accessories', 'ID & Cards', 'Bags', 'Keys', 'Jewelry', 'Sports Equipment', 'Other']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['lost', 'found']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: ['Library', 'Cafeteria', 'Main Block', 'Hostel Block A', 'Hostel Block B', 'Sports Complex', 'Parking Area', 'Lecture Hall Complex', 'Admin Block', 'Labs & Workshop', 'Other']
  },
  image: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  claimRequests: [claimRequestSchema]
}, { timestamps: true });

// Text index for search
itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
