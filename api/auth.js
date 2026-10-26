const dbConnect = require('../db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  await dbConnect();
  const { action, email, password } = req.body;

  if (action === 'register') {
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'الإيميل موجود بالفعل' });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const isFirst = (await User.countDocuments({})) === 0;
      
      await User.create({ email, password: hashedPassword, role: isFirst ? 'admin' : 'user' });
      return res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
    } catch (err) { return res.status(500).json({ error: err.message }); }
  }

  if (action === 'login') {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'بيانات غير صحيحة' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'بيانات غير صحيحة' });

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token, role: user.role });
    } catch (err) { return res.status(500).json({ error: err.message }); }
  }
  return res.status(400).json({ error: 'Invalid action' });
};
