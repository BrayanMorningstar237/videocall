const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  if (!env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Call history persistence is disabled.');
    return;
  }

  await mongoose.connect(env.MONGO_URI);
  console.log('MongoDB connected');
}

module.exports = { connectDatabase };
