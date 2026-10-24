// api/login.js
const connectDB = require('../utils/db'); // تأكد من مسار ملف الاتصال
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    // 1. التأكد من نوع الطلب
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'يرجى إدخال الإيميل والباسورد' });
    }

    try {
        // 2. الاتصال بالداتابيز
        await connectDB();

        // 3. البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' }); // رسالة عامة عشان منكشفش إذا كان الإيميل موجود أو لأ
        }

        // 4. مقارنة الباسورد المشفر
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        // 5. إصدار التوكن (JWT)
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // صالح ليوم واحد
        );

        // 6. إرسال النتيجة
        res.status(200).json({
            message: 'تم تسجيل الدخول بنجاح',
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};
