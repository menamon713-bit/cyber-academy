import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🛡️ إعدادات الحماية
const rateLimitMap = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 50;

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

const UserSchema = new mongoose.Schema({ username: String, email: String, password: String, completed: [String], createdAt: Date });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    // 🛡️ فحص عدد الطلبات
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
    const requests = rateLimitMap.get(ip).filter(t => now - t < WINDOW_MS);
    if (requests.length >= MAX_REQUESTS) return res.status(429).json({ error: "تجاوزت الحد الأقصى للطلبات (50 طلب/ساعة)." });
    requests.push(now);
    rateLimitMap.set(ip, requests);

    await connectDB();

    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "يرجى إدخال الإيميل وكلمة المرور" });
    email = email.replace(/[<>'"]/g, '').trim();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: "تم تسجيل الدخول بنجاح!", token, user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
