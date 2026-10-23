import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "يرجى إدخال جميع البيانات" });
    }

    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    
    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    try {
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
        const getData = await getResponse.json();
        let users = getData.record.users || []; 

        const userExists = users.find(u => u.email === email || u.username === username);
        if (userExists) {
            return res.status(400).json({ error: "الإيميل أو اسم المستخدم موجود بالفعل" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: "user_" + Date.now(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ users: users }) 
        });

        res.status(201).json({ message: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن." });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
