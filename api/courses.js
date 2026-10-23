export default async function handler(req, res) {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID; // ضفنا ده للمستخدمين
    
    if (!BIN_ID || !MASTER_KEY) return res.status(500).json({ error: "Missing environment variables" });

    const headers = { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY };

    // 1. رابط سري للأدمن عشان يجيب إحصائيات المستخدمين
    if (req.query.admin_users === 'true' && req.query.key === 'MinaAdmin2026') {
        try {
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!getResponse.ok) throw new Error("JSONBin Error");
            
            const getData = await getResponse.json();
            let users = (getData && getData.record && getData.record.users) ? getData.record.users : [];
            
            // بنرجع البيانات الأساسية بس (من غير الباسوردات)
            const safeUsers = users.map(u => ({ username: u.username, email: u.email, createdAt: u.createdAt }));
            return res.status(200).json({ totalUsers: users.length, users: safeUsers });
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    // 2. جلب الكورسات (زي ما هو)
    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!response.ok) throw new Error(`JSONBin Error: ${response.status}`);
            
            const data = await response.json();
            const courses = (data && data.record) ? data.record : [];
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    // باقي الـ POST والـ PUT والـ DELETE زي ما هما
    else if (req.method === 'POST') {
        try {
            const newCourse = req.body;
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = [];
            currentCourses.push(newCourse);
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, { method: 'PUT', headers: headers, body: JSON.stringify(currentCourses) });
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) { res.status(500).json({ error: "Failed to add course" }); }
    }
    else if (req.method === 'DELETE') {
        try {
            const courseId = req.query.id;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = [];
            const updatedCourses = currentCourses.filter(course => course.id !== courseId);
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, { method: 'PUT', headers: headers, body: JSON.stringify(updatedCourses) });
            res.status(200).json({ status: "success", message: "Course deleted successfully" });
        } catch (error) { res.status(500).json({ error: "Failed to delete course" }); }
    }
    else if (req.method === 'PUT') {
        try {
            const courseId = req.query.id;
            const updatedCourseData = req.body;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = [];
            const updatedCourses = currentCourses.map(course => course.id === courseId ? { ...course, ...updatedCourseData } : course);
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, { method: 'PUT', headers: headers, body: JSON.stringify(updatedCourses) });
            res.status(200).json({ status: "success", message: "Course updated successfully" });
        } catch (error) { res.status(500).json({ error: "Failed to update course" }); }
    }
    else { res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']); res.status(405).end(`Method ${req.method} Not Allowed`); }
}
