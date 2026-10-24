// api/courses.js
import connectDB from '../utils/db';
import Course from '../models/Course';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// دالة مساعدة للتحقق من التوكن وصلاحيات الأدمن
const verifyAdmin = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.role === 'admin'; // لازم يكون أدمن
    } catch (error) {
        return false;
    }
};

export default async function handler(req, res) {
    await connectDB();

    // عمليات القراءة (GET) متاحة للجميع (أو للطلبة)
    if (req.method === 'GET') {
        try {
            // لو عايز يجيب الإحصائيات (لازم أدمن)
            if (req.query.admin_users === 'true') {
                if (!verifyAdmin(req)) {
                    return res.status(403).json({ message: 'غير مصرح لك بالوصول لهذه البيانات' });
                }
                const totalUsers = await User.countDocuments();
                const users = await User.find({}, 'username email'); // مفيش باسوردات
                // ... كود جلب الإحصائيات التانية
                return res.status(200).json({ totalUsers, users /* ... */ });
            }
            
            // جلب الكورسات العادية
            const courses = await Course.find({});
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في جلب البيانات' });
        }
    }

    // أي عملية تانية (إضافة/تعديل/حذف) لازم تكون أدمن
    if (!verifyAdmin(req)) {
        return res.status(403).json({ message: 'غير مصرح لك بالقيام بهذا الإجراء' });
    }

    if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json(newCourse);
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في إضافة الكورس' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await Course.findByIdAndDelete(req.query.id);
            return res.status(200).json({ message: 'تم الحذف' });
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في الحذف' });
        }
    }
    // ... أضف PUT للتعديل بنفس المنطق
}
