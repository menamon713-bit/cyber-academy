export default async function handler(req, res) {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    
    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    // 1. GET: جلب الكورسات
    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { 
                headers,
                cache: 'no-store' 
            });
            const data = await response.json();
            res.status(200).json(data.record || []);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    
    // 2. POST: إضافة كورس جديد
    else if (req.method === 'POST') {
        try {
            const newCourse = req.body;
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let currentCourses = getData.record || [];
            
            currentCourses.push(newCourse);
            
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(currentCourses)
            });
            
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to add course" });
        }
    }
    
    // 3. DELETE: حذف كورس
    else if (req.method === 'DELETE') {
        try {
            const courseId = req.query.id; // بناخد الـ ID من الرابط
            if (!courseId) {
                return res.status(400).json({ error: "Course ID is required" });
            }

            // بنجيب الكورسات الحالية
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            const getData = await getResponse.json();
            let currentCourses = getData.record || [];

            // بنفلتر ونشيل الكورس اللي عايزين نمسحه
            const updatedCourses = currentCourses.filter(course => course.id !== courseId);

            // بنحفظ المصفوفة الجديدة
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedCourses)
            });

            res.status(200).json({ status: "success", message: "Course deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete course" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
