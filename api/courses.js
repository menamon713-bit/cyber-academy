const dbConnect = require('../db');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await dbConnect();

  // جلب الكورسات متاح للكل
  if (req.method === 'GET') {
    try {
      const courses = await Course.find({});
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 
  
  // إضافة كورس للأدمن بس
  else if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
      }

      const newCourse = await Course.create(req.body);
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token or Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
