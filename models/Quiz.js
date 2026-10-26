const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  explanation: { type: String, required: true }
});
module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
