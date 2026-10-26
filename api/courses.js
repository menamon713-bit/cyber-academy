const dbConnect = require('../db');
const Course = require('../models/Course');

module.exports = async (req, res) => {
  // تفعيل الـ CORS لو هتستخدم الدومين بتاعك
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const courses = await Course.find({});
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const newCourse = await Course.create(req.body);
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
