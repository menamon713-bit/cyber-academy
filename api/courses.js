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
    } catch (error) {
        return false;
    }
};

export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (dbError) {
        console.error("DB Connection Error:", dbError);
        return res.status(500).json({ message: 'خطأ في الاتصال بقاعدة البيانات' });
    }

    if (req.method === 'GET') {
        try {
            if (req.query.admin_users === 'true') {
                if (!verifyAdmin(req)) {
                    return res.status(403).json({ message: 'غير مصرح لك بالوصول لهذه البيانات' });
                }

                const totalUsers = await User.countDocuments();
                const users = await User.find({}, 'username email');
                const totalCourses = await Course.countDocuments();
                
                return res.status(200).json({ 
                    totalUsers, 
                    users, 
                    totalCourses, 
                    totalCompleted: 0 
                });
            }

            const courses = await Course.find({});
            return res.status(200).json(courses);

        } catch (error) {
            console.error("GET Error:", error);
            return res.status(500).json({ message: 'خطأ في جلب البيانات' });
        }
    }

    if (!verifyAdmin(req)) {
        return res.status(403).json({ message: 'غير مصرح لك بالقيام بهذا الإجراء' });
    }

    if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({ message: 'تم إضافة الكورس' });
        } catch (error) {
            console.error("POST Error:", error);
            return res.status(500).json({ message: 'خطأ في إضافة الكورس' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await Course.findByIdAndDelete(req.query.id);
            return res.status(200).json({ message: 'تم الحذف' });
        } catch (error) {
            console.error("DELETE Error:", error);
            return res.status(500).json({ message: 'خطأ في الحذف' });
        }
    }
}
