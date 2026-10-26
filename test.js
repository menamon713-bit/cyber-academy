import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ⚠️ حط رابط الداتابيز بتاعك هنا بالظبط زي اللي في Vercel
const MONGODB_URI = "mongodb+srv://menaalmoshaks_db_user:T9QCmnwqosPqpB0v@cyberacademy.86qltgk.mongodb.net/cyberacademy?retryWrites=true&w=majority";
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function testLogin() {
    console.log("⏳ جاري الاتصال بالداتابيز...");
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ تم الاتصال بالداتابيز بنجاح!");

        const email = "admin@cyber-academy.com";
        const myPassword = "Mina@CyberAcademy#2026!";

        console.log(`🔍 بندور على المستخدم: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ المستخدم مش موجود في الداتابيز! (يمكن الداتابيز اتغيرت أو اتمسحت)");
            process.exit(1);
        }

        console.log("👤 المستخدم موجود، جاري مقارنة الباسورد...");
        const isMatch = await bcrypt.compare(myPassword, user.password);

        if (isMatch) {
            console.log("🎉 الباسورد صح 100%! (الموقع شغال تمام، Vercel بس اللي كان معلق)");
            console.log(`صلاحية المستخدم: ${user.role}`);
        } else {
            console.log("❌ الباسورد مش مطابق للكود المشفر اللي في الداتابيز.");
        }

    } catch (error) {
        console.log("🚨 خطأ في الاتصال:");
        console.log(error.message);
    } finally {
        mongoose.disconnect();
    }
}

testLogin();
