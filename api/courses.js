const dbConnect = require('../db');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    await dbConnect();

    // -----------------------------------------
    // GET: جلب الكورسات (متاح للكل)
    // -----------------------------------------
    if (req.method === 'GET') {
      const courses = await Course.find({}).sort({ createdAt: -1 }); // الأحدث الأول
      return res.status(200).json(courses);
    }

    // -----------------------------------------
    // POST: إضافة كورس (للأدمن فقط)
    // -----------------------------------------
    if (req.method === 'POST') {
      // 1. التأكد إن فيه توكن
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];

      // 2. فك تشفير التوكن والتأكد من صلاحية الأدمن
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
      }

      // 3. التأكد من بيانات الكورس
      const { title, description, level, price } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      // 4. إنشاء الكورس
      const newCourse = await Course.create({
        title,
        description,
        level: level || 'Beginner',
        price: price || 0
      });

      return res.status(201).json(newCourse);
    }

    // أي ميثود تانية مرفوضة
    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (err) {
    console.error('Courses API Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
