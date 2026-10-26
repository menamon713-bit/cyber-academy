const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  await dbConnect();

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // أول مستخدم في الداتابيز هيكون أدمن أوتوماتيك
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({ email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
