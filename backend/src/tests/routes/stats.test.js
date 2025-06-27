const express = require('express');
const request = require('supertest');

jest.mock('../../services/statsService', () => ({
  getStats: jest.fn(),
  recalculate: jest.fn()
}));

const statsService = require('../../services/statsService');
const statsRouter = require('../../routes/stats');

describe('GET /stats', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/stats', statsRouter);

    jest.clearAllMocks();
  });

  it('should return stats if available', async () => {
    const mockStats = { total: 3, averagePrice: 20 };
    statsService.getStats.mockReturnValue(mockStats);

    const res = await request(app).get('/stats');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockStats);
    expect(statsService.getStats).toHaveBeenCalledTimes(1);
    expect(statsService.recalculate).not.toHaveBeenCalled();
  });

  it('should recalculate and return stats if stats are currently null', async () => {
    const mockStats = { total: 5, averagePrice: 50 };

    statsService.getStats
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(mockStats);

    statsService.recalculate.mockResolvedValue();

    const res = await request(app).get('/stats');

    expect(statsService.getStats).toHaveBeenCalledTimes(2);
    expect(statsService.recalculate).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockStats);
  });

  it('should return 500 if stats remain unavailable after recalculation', async () => {
    statsService.getStats.mockReturnValue(null);
    statsService.recalculate.mockResolvedValue();

    const res = await request(app).get('/stats');

    expect(statsService.getStats).toHaveBeenCalledTimes(2);
    expect(statsService.recalculate).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Stats unavailable' });
  });

  it('should handle thrown errors and pass them to next()', async () => {
    const error = new Error('Something broke');
    statsService.getStats.mockImplementation(() => { throw error; });

    const errorHandler = jest.fn((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    app.use(errorHandler);

    const res = await request(app).get('/stats');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Something broke' });
  });
});
