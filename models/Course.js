const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, default: 'Beginner' },
  price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
