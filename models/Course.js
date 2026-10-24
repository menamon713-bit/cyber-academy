import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    level: { type: String, required: true }
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
