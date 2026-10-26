const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is missing! Add it to Vercel Environment Variables.');
}

// كاش عشان Vercel ميفتحش اتصال جديد مع كل Request
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // لو الداتابيز مش راضية تتصل، هيطلع خطأ بعد 5 ثواني بدل ما يعلّق
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // عشان يحاول تاني في الـ request اللي بعده
    throw e;
  }

  return cached.conn;
}

module.exports = dbConnect;
