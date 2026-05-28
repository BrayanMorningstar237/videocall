const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  if (!env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Call history persistence is disabled.');
    return;
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection failed. Call history persistence is disabled.', error.message);
  }
}

module.exports = { connectDatabase };
