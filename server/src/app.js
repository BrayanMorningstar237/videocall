const cors = require('cors');
const express = require('express');
const healthRoutes = require('./routes/health.routes');
const { env } = require('./config/env');

const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/health', healthRoutes);

module.exports = app;
