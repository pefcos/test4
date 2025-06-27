const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = require('../../routes/items');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockData = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' },
  { id: 3, name: 'Special Item' },
];

const app = express();
app.use(express.json());
app.use('/api/items', router);

beforeEach(() => {
  fs.readFile.mockResolvedValue(JSON.stringify(mockData));
  fs.writeFile.mockResolvedValue();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/items', () => {
  it('should return all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(mockData.length);
  });

  it('should filter items by query string', async () => {
    const res = await request(app).get('/api/items?q=special');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      expect.objectContaining({ name: 'Special Item' })
    ]);
  });

  it('should apply limit to results', async () => {
    const res = await request(app).get('/api/items?limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /api/items/:id', () => {
  it('should return the item with the given id', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ id: 1 }));
  });

  it('should return 404 if item not found', async () => {
    const res = await request(app).get('/api/items/999');
    expect(res.statusCode).toBe(404);
    expect(res.text).toContain('Item not found');
  });
});

describe('POST /api/items', () => {
  it('should create a new item', async () => {
    const newItem = { name: 'New Item' };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({
      name: 'New Item',
      id: expect.any(Number),
    }));
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
