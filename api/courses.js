import mongoose from 'mongoose';

export default async function handler(req, res) {
    try {
        // بنحاول نتصل بقاعدة البيانات
        await mongoose.connect(process.env.MONGODB_URI);
        
        // لو وصلنا هنا، يبقى الاتصال نجح
        res.status(200).json({ message: "MongoDB Connected Successfully!" });
    } catch (error) {
        // لو حصل خطأ، بنطبعه في الـ Logs عشان نشوفه
        console.error("Connection Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}
