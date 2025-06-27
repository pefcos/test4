function mean(items) {
  return items.reduce((acc, cur) => acc + cur.price, 0) / items.length;
}

module.exports = { mean };