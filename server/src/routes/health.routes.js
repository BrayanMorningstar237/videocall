const express = require('express');
const { getOnlineUsers } = require('../services/socketRegistry');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'rtc-engine-server' });
});

router.get('/online', (_req, res) => {
  res.json({ ok: true, users: getOnlineUsers() });
});

module.exports = router;
