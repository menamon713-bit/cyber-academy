import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI);
};

const UserSchema = new mongoose.Schema({ username: String, email: String, password: String, completed: [String], createdAt: Date });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
    await connectDB();

    let { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "يرجى إدخال الإيميل والباسورد الجديد" });
    email = email.replace(/[<>'"]/g, '').trim();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "هذا الإيميل غير مسجل لدينا" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن." });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
