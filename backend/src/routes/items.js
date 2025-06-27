const express = require('express');
const router = express.Router();
const itemRepository = require('../repositories/itemRepository');

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { q, limit, page } = req.query;

    const results = await itemRepository.getItems({ q, limit, page });

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    await itemRepository.insertItem(item);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
