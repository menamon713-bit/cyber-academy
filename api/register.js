const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await dbConnect();

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // أول واحد هيسجل هنخليه أدمن، والباقي يوزرز عاديين (أو تقدر تغيرها من الداتابيز)
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({ email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
