export default async function handler(req, res) {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    
    if (!BIN_ID || !MASTER_KEY) {
        return res.status(500).json({ error: "Missing environment variables" });
    }

    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!response.ok) throw new Error(`JSONBin Error: ${response.status}`);
            
            const data = await response.json();
            // حماية: لو مفيش record، بنرجع مصفوفة فاضية
            const courses = (data && data.record) ? data.record : [];
            res.status(200).json(courses);
        } catch (error) {
            console.error("GET Courses Error:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const newCourse = req.body;
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!getResponse.ok) throw new Error(`JSONBin Error: ${getResponse.status}`);
            
            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = []; // لو مش مصفوفة بنعملها مصفوفة
            
            currentCourses.push(newCourse);
            
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(currentCourses)
            });
            
            res.status(200).json({ status: "success", message: "Course added successfully" });
        } catch (error) {
            console.error("POST Course Error:", error);
            res.status(500).json({ error: "Failed to add course" });
        }
    }
    else if (req.method === 'DELETE') {
        try {
            const courseId = req.query.id;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });

            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!getResponse.ok) throw new Error("JSONBin Error");
            
            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = [];

            const updatedCourses = currentCourses.filter(course => course.id !== courseId);

            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedCourses)
            });

            res.status(200).json({ status: "success", message: "Course deleted successfully" });
        } catch (error) {
            console.error("DELETE Course Error:", error);
            res.status(500).json({ error: "Failed to delete course" });
        }
    }
    else if (req.method === 'PUT') {
        try {
            const courseId = req.query.id;
            const updatedCourseData = req.body;
            if (!courseId) return res.status(400).json({ error: "Course ID is required" });

            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?t=${Date.now()}`, { headers, cache: 'no-store' });
            if (!getResponse.ok) throw new Error("JSONBin Error");

            const getData = await getResponse.json();
            let currentCourses = (getData && getData.record) ? getData.record : [];
            if (!Array.isArray(currentCourses)) currentCourses = [];

            const updatedCourses = currentCourses.map(course => 
                course.id === courseId ? { ...course, ...updatedCourseData } : course
            );

            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updatedCourses)
            });

            res.status(200).json({ status: "success", message: "Course updated successfully" });
        } catch (error) {
            console.error("PUT Course Error:", error);
            res.status(500).json({ error: "Failed to update course" });
        }
    }
    else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
