import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "يرجى إدخال الإيميل والباسورد الجديد" });

    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const headers = { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY };

    try {
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
        const getData = await getResponse.json();
        let users = getData.record.users || []; 

        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) return res.status(404).json({ error: "هذا الإيميل غير مسجل لدينا" });

        const salt = await bcrypt.genSalt(10);
        users[userIndex].password = await bcrypt.hash(newPassword, salt);

        await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ users: users }) 
        });

        res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن." });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
