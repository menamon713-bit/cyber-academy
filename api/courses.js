const connectDB = require('../utils/db'); // تأكد من مسار ملف الاتصال
const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// دالة بتتأكد إن اللي بيطلب البيانات "أدمن" ومعاه توكن سليم
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

module.exports = async (req, res) => {
    await connectDB();

    // 1. لو الطلب بيجيب بيانات (GET)
    if (req.method === 'GET') {
        try {
            // لو الطلب بيجيب إحصائيات الأدمن (الإيميلات والأرقام)
            if (req.query.admin_users === 'true') {
                
                // هنا بنشيك على التوكن.. لو مش أدمن، بنرفض الطلب فوراً
                if (!verifyAdmin(req)) {
                    return res.status(403).json({ message: 'غير مصرح لك بالوصول لهذه البيانات' });
                }

                const totalUsers = await User.countDocuments();
                const users = await User.find({}, 'username email'); // بنجيب الاسم والإيميل بس
                const totalCourses = await Course.countDocuments();
                
                return res.status(200).json({ 
                    totalUsers, 
                    users, 
                    totalCourses, 
                    totalCompleted: 0 // تقدر تعدلها بعدين
                });
            }

            // لو طلب عادي (عرض الكورسات للطلبة).. مسموح للجميع
            const courses = await Course.find({});
            return res.status(200).json(courses);

        } catch (error) {
            return res.status(500).json({ message: 'خطأ في جلب البيانات' });
        }
    }

    // 2. أي عملية تانية (إضافة، تعديل، حذف) لازم تعدي من فلتر الأدمن
    if (!verifyAdmin(req)) {
        return res.status(403).json({ message: 'غير مصرح لك بالقيام بهذا الإجراء' });
    }

    if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({ message: 'تم إضافة الكورس' });
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
};
