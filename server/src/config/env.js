require('dotenv').config();

const env = {
  PORT: Number(process.env.PORT ?? 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? '*',
  MONGO_URI: process.env.MONGO_URI ?? '',
  TURN_USERNAME: process.env.TURN_USERNAME ?? '',
  TURN_PASSWORD: process.env.TURN_PASSWORD ?? '',
};

module.exports = { env };
