const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Course title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Course description is required'] 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  price: { 
    type: Number, 
    default: 0,
    min: [0, 'Price cannot be negative']
  }
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
