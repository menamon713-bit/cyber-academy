import connectDB from '../db.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const verifyAdmin = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.role === 'admin';
    } catch (error) { return false; }
};

export default async function handler(req, res) {
    try { await connectDB(); } catch (e) { return res.status(500).json({ message: 'DB Error' }); }

    if (req.method === 'GET') {
        if (req.query.admin_users === 'true') {
            if (!verifyAdmin(req)) return res.status(403).json({ message: 'غير مصرح' });
            const totalUsers = await User.countDocuments();
            const users = await User.find({}, 'username email');
            const totalCourses = await Course.countDocuments();
            return res.status(200).json({ totalUsers, users, totalCourses, totalCompleted: 0 });
        }
        const courses = await Course.find({});
        return res.status(200).json(courses);
    }

    if (!verifyAdmin(req)) return res.status(403).json({ message: 'غير مصرح' });

    if (req.method === 'POST') {
        const newCourse = new Course(req.body);
        await newCourse.save();
        return res.status(201).json({ message: 'تمت الإضافة' });
    }

    if (req.method === 'DELETE') {
        await Course.findByIdAndDelete(req.query.id);
        return res.status(200).json({ message: 'تم الحذف' });
    }
}
