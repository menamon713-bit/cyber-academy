const dbConnect = require('../db');
const Quiz = require('../models/Quiz');

module.exports = async (req, res) => {
  await dbConnect();
  if (req.method === 'GET') {
    const { courseId } = req.query;
    const quizzes = await Quiz.find({ courseId });
    return res.status(200).json(quizzes);
  }
};
