module.exports = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;

    console.log(
      `[${new Date().toISOString()}] Responded ${res.statusCode} ${req.originalUrl} (${durationMs.toFixed(2)}ms)`
    );
  });

  next();
};
