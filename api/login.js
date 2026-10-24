import connectDB from '../db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'يرجى إدخال البيانات' });

    try {
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'بيانات غير صحيحة' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'بيانات غير صحيحة' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في السيرفر' });
    }
}
