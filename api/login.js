const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
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

    // 2. البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. مقارنة الباسورد المشفر
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. توليد JWT Token محمي
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } // التوكن صالح لمدة أسبوع
    );

    res.status(200).json({ 
      message: 'Logged in successfully',
      token, 
      role: user.role 
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
