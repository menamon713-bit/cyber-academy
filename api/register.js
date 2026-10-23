import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const rateLimitMap = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 50;

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    completed: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
    const requests = rateLimitMap.get(ip).filter(t => now - t < WINDOW_MS);
    if (requests.length >= MAX_REQUESTS) return res.status(429).json({ error: "تجاوزت الحد الأقصى للطلبات. حاول لاحقاً." });
    requests.push(now);
    rateLimitMap.set(ip, requests);

    await connectDB();

    let { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "يرجى إدخال جميع البيانات" });

    username = username.replace(/[<>'"]/g, '').trim();
    email = email.replace(/[<>'"]/g, '').trim();

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ error: "الإيميل أو اسم المستخدم موجود بالفعل" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن." });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
