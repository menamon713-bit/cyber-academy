const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    const { email, password } = req.body;

    // 1. التأكد من إدخال البيانات
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // 2. التأكد إن الإيميل مش متسجل قبل كده
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // 3. تشفير الباسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. أول مستخدم في الداتابيز هيبقى أدمن أوتوماتيك
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // 5. إنشاء المستخدم
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      role 
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      role: user.role 
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};
