import connectDB from '../db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'يرجى إدخال جميع البيانات' });

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'هذا الإيميل مسجل بالفعل' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, role: 'student' });
        await newUser.save();
        
        return res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
    } catch (error) {
        return res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
}
