import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

const UserSchema = new mongoose.Schema({
    username: String, email: String, password: String, completed: [String], createdAt: Date
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    await connectDB();

    // 1. جلب تقدم المستخدم (GET)
    if (req.method === 'GET') {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email is required" });

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(200).json({ completed: [] });

            res.status(200).json({ completed: user.completed || [] });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    } 
    
    // 2. حفظ تقدم المستخدم (POST)
    else if (req.method === 'POST') {
        const { email, courseId } = req.body;
        if (!email || !courseId) return res.status(400).json({ error: "Missing data" });

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ error: "User not found" });

            if (!user.completed.includes(courseId)) {
                user.completed.push(courseId);
                await user.save();
            }

            res.status(200).json({ message: "Progress saved", completed: user.completed });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
