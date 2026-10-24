import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    level: { type: String, default: 'مبتدئ' },
    pathId: { type: String, default: 'basics' },
    imageUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const UserSchema = new mongoose.Schema({ 
    username: String, email: String, password: String, completed: [String], createdAt: Date 
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

            if (req.query.admin_users === 'true' && req.query.key === 'MinaAdmin2026') {
                const totalUsers = await User.countDocuments();
                const totalCourses = await Course.countDocuments();
                
                const users = await User.find({}, 'completed');
                let totalCompleted = 0;
                users.forEach(u => { if (u.completed) totalCompleted += u.completed.length; });

                const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);

                return res.status(200).json({ 
                    totalUsers, 
                    totalCourses, 
                    totalCompleted,
                    users: recentUsers.map(u => ({ username: u.username, email: u.email, createdAt: u.createdAt })) 
                });
            }
            const courses = await Course.find().sort({ createdAt: -1 });
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to add course" });
        }
    }
    else if (req.method === 'DELETE') {
        try {
            const courseId = req.query.id;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });
            await Course.findByIdAndDelete(courseId);
            res.status(200).json({ status: "success", message: "Course deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete course" });
        }
    }
    else if (req.method === 'PUT') {
        try {
            const courseId = req.query.id;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });
            await Course.findByIdAndUpdate(courseId, req.body);
            res.status(200).json({ status: "success", message: "Course updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to update course" });
        }
    } 
    else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
