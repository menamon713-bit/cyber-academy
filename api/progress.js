export default async function handler(req, res) {
    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const headers = { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY };

    // 1. جلب تقدم المستخدم (GET)
    if (req.method === 'GET') {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email is required" });

        try {
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let users = getData.record.users || [];

            const user = users.find(u => u.email === email);
            if (!user) return res.status(404).json({ error: "User not found" });

            res.status(200).json({ completed: user.completed || [] });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    } 
    
    // 2. حفظ تقدم المستخدم (POST)
    else if (req.method === 'POST') {
        const { email, courseId } = req.body;
        if (!email || !courseId) return res.status(400).json({ error: "Missing data" });

        try {
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let users = getData.record.users || [];

            const userIndex = users.findIndex(u => u.email === email);
            if (userIndex === -1) return res.status(404).json({ error: "User not found" });

            if (!users[userIndex].completed) users[userIndex].completed = [];
            
            if (!users[userIndex].completed.includes(courseId)) {
                users[userIndex].completed.push(courseId);
            }

            await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ users: users }) 
            });

            res.status(200).json({ message: "Progress saved", completed: users[userIndex].completed });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
