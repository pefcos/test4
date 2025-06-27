const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

class StatsService {
  constructor(dataPath) {
    this.dataPath = dataPath || DATA_PATH;
    this.stats = null;

    this.recalculate();
    this.setupWatcher();
  }

  async recalculate() {
    try {
      const raw = await fs.promises.readFile(this.dataPath, 'utf-8');
      const items = JSON.parse(raw);
      this.stats = {
        total: items.length,
        averagePrice: mean(items)
      };
    } catch (err) {
      console.error('Failed to recalculate stats:', err);
      this.stats = null;
    }
  }

  getStats() {
    return this.stats;
  }

  setupWatcher() {
    fs.watch(this.dataPath, (eventType) => {
      if (eventType === 'change') {
        this.recalculate();
      }
    });
  }
}

module.exports = new StatsService();