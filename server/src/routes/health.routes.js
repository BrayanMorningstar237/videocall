const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'rtc-engine-server' });
});

module.exports = router;
