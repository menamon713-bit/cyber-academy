import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "يرجى إدخال الإيميل وكلمة المرور" });
    }

    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const JWT_SECRET = process.env.JWT_SECRET;
    
    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    try {
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
        const getData = await getResponse.json();
        let users = getData.record.users || []; 

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "الإيميل أو كلمة المرور غير صحيحة" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: "تم تسجيل الدخول بنجاح!",
            token: token,
            user: { username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
