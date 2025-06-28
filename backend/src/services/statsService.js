const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');
const chokidar = require('chokidar');

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
  process.stdout.write(`Initializing statsService...\n`);
  await recalculate(dataPath);
  setupWatcher(dataPath);
}

// Private

function setupWatcher(dataPath = DATA_PATH) {
  const watcher = chokidar.watch(dataPath, { persistent: true, usePolling: true, interval: 1000 });
  watcher.on('change', (changedPath) => {
    process.stdout.write(`${changedPath} has been modified.\n`);
    recalculate(dataPath);
  });
  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });
  process.stdout.write(`File ${dataPath} being watched!\n`);
}

// Exports

module.exports = {
  recalculate,
  initStatsService,
  getStats,
};
