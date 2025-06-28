const express = require('express');
const router = express.Router();
const statsService = require('../services/statsService');

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    let stats = statsService.getStats();
    if (stats) {
      return res.json(stats);
    }

    // If stats are currently null (previous recalculation failed), recalculate
    await statsService.recalculate();
    stats = statsService.getStats();

    if (stats) {
      return res.json(stats);
    } else {
      return res.status(500).json({ error: 'Stats unavailable' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
