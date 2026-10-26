const dbConnect = require('../db');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const courses = await Course.find({});
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

      const newCourse = await Course.create(req.body);
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token or Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
