const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// إعدادات إرسال الإيميل (تم تعديلها لتعمل على Vercel)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (req, res) => {
  await dbConnect();
  const { action, email, password, code } = req.body;

  // 1. إنشاء حساب جديد
  if (action === 'register') {
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'الإيميل موجود بالفعل' });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const isFirst = (await User.countDocuments({})) === 0;
      
      // توليد كود تحقق عشوائي من 6 أرقام
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // صالح لمدة 10 دقايق

      await User.create({ 
        email, 
        password: hashedPassword, 
        role: isFirst ? 'admin' : 'user',
        verificationCode,
        verificationCodeExpires
      });

      // إرسال الإيميل
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'كود تفعيل حسابك في Cyber Academy',
        text: `مرحباً، كود التحقق الخاص بك هو: ${verificationCode}\nالكود صالح لمدة 10 دقائق.`
      };
      
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ message: 'تم إنشاء الحساب، يرجى تفقد إيميلك لتفعيل الحساب' });
    } catch (err) { 
      console.error('Register Error:', err);
      return res.status(500).json({ error: 'حدث خطأ أثناء التسجيل أو إرسال الإيميل' }); 
    }
  }

  // 2. تأكيد الكود
  if (action === 'verify') {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
      
      if (user.verificationCode !== code) return res.status(400).json({ error: 'كود التحقق غير صحيح' });
      if (user.verificationCodeExpires < Date.now()) return res.status(400).json({ error: 'انتهت صلاحية الكود، يرجى إعادة إرسال كود جديد' });

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      return res.status(200).json({ message: 'تم تفعيل الحساب بنجاح! يمكنك الآن تسجيل الدخول' });
    } catch (err) { return res.status(500).json({ error: err.message }); }
  }

  // 3. تسجيل الدخول
  if (action === 'login') {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'بيانات غير صحيحة' });
      
      if (!user.isVerified) return res.status(403).json({ error: 'يرجى تفعيل حسابك أولاً من خلال الكود المرسل للإيميل' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'بيانات غير صحيحة' });

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token, role: user.role });
    } catch (err) { return res.status(500).json({ error: err.message }); }
  }

  // 4. إعادة إرسال الكود
  if (action === 'resendCode') {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
      if (user.isVerified) return res.status(400).json({ error: 'الحساب مفعل بالفعل' });

      // توليد كود جديد
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = newCode;
      user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'كود تفعيل حسابك الجديد - Cyber Academy',
        text: `مرحباً، كود التحقق الجديد الخاص بك هو: ${newCode}\nالكود صالح لمدة 10 دقائق.`
      };
      
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'تم إعادة إرسال الكود بنجاح' });
    } catch (err) { 
      return res.status(500).json({ error: 'حدث خطأ أثناء إعادة إرسال الكود' }); 
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
};
