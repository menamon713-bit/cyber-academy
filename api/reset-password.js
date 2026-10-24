import connectDB from '../db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        await connectDB();
    } catch (error) {
        return res.status(500).json({ error: "DB Connection Error" });
    }

    // بناخد الباسورد القديم كمان عشان نتأكد إنه هو صاحب الحساب
    let { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "يرجى إدخال الإيميل والباسورد القديم والجديد" });
    }

    email = email.replace(/[<>'"]/g, '').trim();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "هذا الإيميل غير مسجل لدينا" });
        }

        // 1. التحقق من الباسورد القديم (عشان نمنع أي حد يغير باسورد حد تاني)
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "الباسورد القديم غير صحيح!" });
        }

        // 2. تشفير الباسورد الجديد
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // 3. حفظ التغييرات
        await user.save();

        res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
