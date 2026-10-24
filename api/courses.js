import connectDB from '../db.js';
import Course from '../models/Course.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const courses = await Course.find({});
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في جلب البيانات' });
        }
    }

    if (req.method === 'POST') {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(403).json({ message: 'غير مصرح' });
        
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'admin') return res.status(403).json({ message: 'غير مصرح' });

            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({ message: 'تمت الإضافة' });
        } catch (error) {
            return res.status(500).json({ message: 'خطأ' });
        }
    }
}
