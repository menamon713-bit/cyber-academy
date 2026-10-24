import connectDB from '../db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'يرجى إدخال البيانات' });

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'الإيميل مسجل بالفعل' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, role: 'student' });
        await newUser.save();
        res.status(201).json({ message: 'تم إنشاء الحساب' });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في السيرفر' });
    }
}
