import connectDB from '../db.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// دالة عشان نجيب الـ userId من التوكن
const getUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId; // بنجيب الـ ID من التوكن
    } catch (error) {
        return null;
    }
};

export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (error) {
        return res.status(500).json({ error: "DB Connection Error" });
    }

    // --- 1. جلب التقدم (GET) ---
    if (req.method === 'GET') {
        // بنجيب بيانات المستخدم اللي عامل دخول بس (من التوكن)
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ error: "غير مصرح لك بالوصول" });
        }

        try {
            // بندور على المستخدم بالـ ID بتاعه (مش الإيميل)
            const user = await User.findById(userId).select('completed');
            if (!user) return res.status(404).json({ error: "User not found" });
            
            res.status(200).json({ completed: user.completed || [] });
        } catch (error) {
            console.error("GET Progress Error:", error);
            res.status(500).json({ error: "Server Error" });
        }
    } 
    
    // --- 2. حفظ التقدم (POST) ---
    else if (req.method === 'POST') {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ error: "غير مصرح لك بالوصول" });
        }

        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ error: "Missing courseId" });

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            // بنتأكد إنه مش مخلص الكورس ده قبل كده
            if (!user.completed.includes(courseId)) {
                user.completed.push(courseId);
                await user.save();
            }
            res.status(200).json({ message: "Progress saved", completed: user.completed });
        } catch (error) {
            console.error("POST Progress Error:", error);
            res.status(500).json({ error: "Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
