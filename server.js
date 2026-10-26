import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ربط الـ API
import loginHandler from './api/login.js';
import coursesHandler from './api/courses.js';
import registerHandler from './api/register.js';

app.post('/api/login', (req, res) => loginHandler(req, res));
app.post('/api/register', (req, res) => registerHandler(req, res));
app.all('/api/courses', (req, res) => coursesHandler(req, res));

app.listen(3000, () => console.log('🚀 السيرفر شغال على بورت 3000'));
