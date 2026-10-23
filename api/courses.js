export default async function handler(req, res) {
    const BIN_ID = process.env.JSONBIN_BIN_ID;
    const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
    
    const headers = {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
    };

    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
            const data = await response.json();
            res.status(200).json(data.record || []);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const newCourse = req.body;
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
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
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
