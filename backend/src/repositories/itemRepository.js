const fs = require('fs').promises;
const path = require('path');
const { validateItem } = require('../validators/itemValidator');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');
const statsService = require('../services/statsService');

const DEFAULT_LIMIT = 200;
const DEFAULT_PAGE = 1;

async function getItems({ q, limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = {}) {
  var results = await readData();

  // Filtering
  if (q) {
    // Simple substring search (sub‑optimal) - TODO: Refactor
    results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
  }

  const totalCount = results.length;

  // Pagination
  const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : DEFAULT_LIMIT;
  const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : DEFAULT_PAGE;

  const startIndex = (pageNumber - 1) * pageSize;
  const paginatedResults = results.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedResults,
    totalCount: totalCount
  };
}

async function getItemById(id) {
  const data = await readData();
  return data.find(item => item.id === parseInt(id, 10));
}

async function insertItem(item) {
  const data = await readData();
  item.id = Date.now();

  const { isValid, errors } = validateItem(item);
  if (!isValid) {
    const err = new Error('Invalid item data');
    err.status = 400;
    err.errors = errors;
    throw err;
  }

  data.push(item);
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  await statsService.recalculate(); // Stats have changed!
}

// Private

async function readData() {
  const raw = await fs.readFile(DATA_PATH);
  return JSON.parse(raw);
}

// Exports

module.exports = {
  getItems,
  getItemById,
  insertItem,
  DEFAULT_LIMIT
};
