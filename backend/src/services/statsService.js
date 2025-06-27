const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let stats = null;

async function recalculate(dataPath = DATA_PATH) {
  try {
    const raw = await fs.promises.readFile(dataPath, 'utf-8');
    const items = JSON.parse(raw);
    stats = {
      total: items.length,
      averagePrice: mean(items),
    };
  } catch (err) {
    console.error('Failed to recalculate stats:', err);
    stats = null;
  }
}

function getStats() {
  return stats;
}

async function initStatsService(dataPath = DATA_PATH) {
  await recalculate(dataPath);
  setupWatcher(dataPath);
}

// Private

function setupWatcher(dataPath = DATA_PATH) {
  fs.watch(dataPath, (eventType) => {
    if (eventType === 'change') {
      recalculate(dataPath);
    }
  });
}

// Exports

module.exports = {
  recalculate,
  initStatsService,
  getStats,
};
