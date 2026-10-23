import mongoose from 'mongoose';

// الاتصال بقاعدة البيانات
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

// تعريف شكل الكورس في قاعدة البيانات
const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    level: { type: String, default: 'مبتدئ' },
    pathId: { type: String, default: 'basics' },
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default async function handler(req, res) {
    await connectDB();

    // 1. جلب الكورسات (GET)
    if (req.method === 'GET') {
        try {
            const courses = await Course.find().sort({ createdAt: -1 });
            res.status(200).json(courses);
        } catch (error) {
            console.error("GET Error:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    
    // 2. إضافة كورس جديد (POST)
    else if (req.method === 'POST') {
        try {
            const { title, desc, level, pathId } = req.body;
            if (!title || !desc) return res.status(400).json({ error: "Missing data" });
            
            const newCourse = new Course({ title, desc, level, pathId });
            await newCourse.save();
            
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) {
            console.error("POST Error:", error);
            res.status(500).json({ error: "Failed to add course" });
        }
    } 
    
    // 3. حذف كورس (DELETE)
    else if (req.method === 'DELETE') {
        try {
            const courseId = req.query.id;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });

            await Course.findByIdAndDelete(courseId);
            res.status(200).json({ status: "success", message: "Course deleted successfully" });
        } catch (error) {
            console.error("DELETE Error:", error);
            res.status(500).json({ error: "Failed to delete course" });
        }
    }
    
    // 4. تعديل كورس (PUT)
    else if (req.method === 'PUT') {
        try {
            const courseId = req.query.id;
            const updatedData = req.body;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });

            await Course.findByIdAndUpdate(courseId, updatedData);
            res.status(200).json({ status: "success", message: "Course updated successfully" });
        } catch (error) {
            console.error("PUT Error:", error);
            res.status(500).json({ error: "Failed to update course" });
        }
    } 
    
    else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
