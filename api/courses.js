const dbConnect = require('../db');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  await dbConnect();
  if (req.method === 'GET') {
    const courses = await Course.find({});
    return res.status(200).json(courses);
  }
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
      const newCourse = await Course.create(req.body);
      return res.status(201).json(newCourse);
    } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
  }
};
