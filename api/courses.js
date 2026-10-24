// api/courses.js
const connectDB = require('../utils/db');
const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// دالة مساعدة للتحقق من التوكن وصلاحية الأدمن
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

module.exports = async (req, res) => {
    await connectDB();

    // ================= عمليات القراءة (GET) =================
    if (req.method === 'GET') {
        try {
            // طلب إحصائيات الأدمن (بيانات المستخدمين)
            if (req.query.admin_users === 'true') {
                if (!verifyAdmin(req)) {
                    return res.status(403).json({ message: 'غير مصرح لك بالوصول لهذه البيانات' });
                }

                const totalUsers = await User.countDocuments();
                // بنجيب الإيميل والاسم بس، مفيش باسوردات
                const users = await User.find({}, 'username email'); 
                const totalCourses = await Course.countDocuments();
                // ... (تقدر تضيف إحصائيات تانية هنا)

                return res.status(200).json({ 
                    totalUsers, 
                    users, 
                    totalCourses, 
                    totalCompleted: 0 // مثال
                });
            }

            // طلب الكورسات العادي (متاح للجميع)
            const courses = await Course.find({});
            return res.status(200).json(courses);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'خطأ في جلب البيانات' });
        }
    }

    // ================= العمليات الحساسة (POST, PUT, DELETE) =================
    // لازم يعدي من فلتر الأدمن
    if (!verifyAdmin(req)) {
        return res.status(403).json({ message: 'غير مصرح لك بالقيام بهذا الإجراء' });
    }

    if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({ message: 'تم إضافة الكورس', newCourse });
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في إضافة الكورس' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await Course.findByIdAndDelete(req.query.id);
            return res.status(200).json({ message: 'تم الحذف بنجاح' });
        } catch (error) {
            return res.status(500).json({ message: 'خطأ في الحذف' });
        }
    }
    
    // ... (لو عايز تضيف PUT للتعديل، هتضيفه هنا بنفس الطريقة)
};
