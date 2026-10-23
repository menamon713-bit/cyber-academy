export default async function handler(req, res) {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    
    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    // 1. لو الطلب GET (عشان نجيب الكورسات)
    if (req.method === 'GET') {
        try {
            // ضفنا ?t=Date.now() عشان نمنع الكاش ونجيب أحدث نسخة
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { 
                headers,
                cache: 'no-store' 
            });
            const data = await response.json();
            const courses = data.record || [];
            res.status(200).json(courses);
        } catch (error) {
            console.error("GET Error:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    
    // 2. لو الطلب POST (عشان نضيف كورس جديد)
    else if (req.method === 'POST') {
        try {
            const newCourse = req.body;
            
            // بنجيب الكورسات الحالية الأول (مع منع الكاش)
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { 
                headers,
                cache: 'no-store' 
            });
            const getData = await getResponse.json();
            let currentCourses = getData.record || [];
            
            // بنضيف الكورس الجديد للمصفوفة
            currentCourses.push(newCourse);
            
            // بنحفظ المصفوفة كلها تاني في JSONBin
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(currentCourses)
            });
            
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) {
            console.error("POST Error:", error);
            res.status(500).json({ error: "Failed to add course" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
