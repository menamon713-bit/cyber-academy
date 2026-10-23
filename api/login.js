import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. إعدادات الحماية (50 طلب في الساعة)
const rateLimitMap = new Map();
const WINDOW_MS = 60 * 60 * 1000; // ساعة
const MAX_REQUESTS = 50; 

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    // 2. التحقق من عدد الطلبات للـ IP ده
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
    const requests = rateLimitMap.get(ip).filter(t => now - t < WINDOW_MS);
    
    if (requests.length >= MAX_REQUESTS) {
        return res.status(429).json({ error: "لقد تجاوزت الحد الأقصى للطلبات (50 طلب/ساعة). يرجى المحاولة لاحقاً." });
    }
    requests.push(now);
    rateLimitMap.set(ip, requests);

    // 3. تنقية المدخلات
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "يرجى إدخال الإيميل وكلمة المرور" });

    email = email.replace(/[<>'"]/g, '').trim();

    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const JWT_SECRET = process.env.JWT_SECRET;
    const headers = { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY };

    try {
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
        const getData = await getResponse.json();
        let users = (getData && getData.record && getData.record.users) ? getData.record.users : [];

        const user = users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET, { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: "تم تسجيل الدخول بنجاح!", token: token,
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
