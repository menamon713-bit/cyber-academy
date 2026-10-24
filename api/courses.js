import connectDB from '../db.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// دالة للتحقق من التوكن
const verifyUser = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (error) { return null; }
};

export default async function handler(req, res) {
    try { await connectDB(); } catch (e) { return res.status(500).json({ message: 'DB Error' }); }

    const decoded = verifyUser(req);

    // 1. عرض البيانات (GET)
    if (req.method === 'GET') {
        // لو الطلب لإحصائيات الأدمن
        if (req.query.admin_users === 'true') {
            if (!decoded || decoded.role !== 'admin') return res.status(403).json({ message: 'غير مصرح' });
            const totalUsers = await User.countDocuments();
            const users = await User.find({}, 'username email');
            const totalCourses = await Course.countDocuments();
            return res.status(200).json({ totalUsers, users, totalCourses, totalCompleted: 0 });
        }

        // لو الطلب لعرض الكورسات للطلاب: لازم يكون مسجل دخول
        if (!decoded) return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });

        const courses = await Course.find({});
        return res.status(200).json(courses);
    }

    // 2. التعديل والإضافة: للأدمن فقط
    if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({ message: 'غير مصرح لك بالقيام بهذا الإجراء' });
    }

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
