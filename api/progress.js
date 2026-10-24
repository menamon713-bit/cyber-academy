import connectDB from '../db.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const getUserId = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) { return null; }
};

export default async function handler(req, res) {
    await connectDB();
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "غير مصرح" });

    if (req.method === 'GET') {
        const user = await User.findById(userId).select('completed');
        return res.status(200).json({ completed: user ? user.completed : [] });
    } 
    else if (req.method === 'POST') {
        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ error: "Missing courseId" });
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.completed.includes(courseId)) {
            user.completed.push(courseId);
            await user.save();
        }
        return res.status(200).json({ message: "Progress saved", completed: user.completed });
    }
}
