// api/login.js
import connectDB from '../utils/db'; // تأكد من مسار ملف الاتصال بالداتابيز
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'يرجى إدخال الإيميل والباسورد' });
    }

    try {
        await connectDB();

        // 1. البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        // 2. التأكد من الباسورد المشفر
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        // 3. إنشاء التوكن (JWT) وتوقيعه بالسر اللي في Vercel
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // التوكن صالح ليوم واحد
        );

        res.status(200).json({ 
            message: 'تم تسجيل الدخول بنجاح', 
            token, 
            role: user.role 
        });

    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
}
