const fs = require('fs').promises;
const itemsRepository = require('../../src/repositories/itemRepository');
const statsService = require('../../src/services/statsService');
const { validateItem } = require('../../src/validators/itemValidator');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

jest.mock('../../src/services/statsService', () => ({
  recalculate: jest.fn()
}));

jest.mock('../../src/validators/itemValidator', () => ({
  validateItem: jest.fn()
}));

const mockItems = [
  { id: 1, name: 'Apple', price: 1.5 },
  { id: 2, name: 'Banana', price: 1.0 },
  { id: 3, name: 'Cherry', price: 2.0 }
];

describe('itemsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.writeFile.mockResolvedValue();
  });

  describe('getItems', () => {
    it('returns all items with default pagination', async () => {
      const result = await itemsRepository.getItems();
      expect(result.totalCount).toBe(mockItems.length);
      expect(result.items).toEqual(mockItems);
    });

    it('filters items by query', async () => {
      const result = await itemsRepository.getItems({ q: 'app' });
      expect(result.totalCount).toBe(1);
      expect(result.items[0].name).toBe('Apple');
    });

    it('applies pagination correctly', async () => {
      const result = await itemsRepository.getItems({ limit: 1, page: 2 });
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('Banana');
    });

    it('handles invalid limit and page fallback to defaults', async () => {
      const result = await itemsRepository.getItems({ limit: -5, page: -1 });
      expect(result.items.length).toBe(mockItems.length);
    });

    it('returns empty array if no match is found', async () => {
      const result = await itemsRepository.getItems({ q: 'zzz' });
      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('getItemById', () => {
    it('returns the correct item by ID', async () => {
      const item = await itemsRepository.getItemById(2);
      expect(item).toEqual({ id: 2, name: 'Banana', price: 1.0 });
    });

    it('returns undefined for non-existent ID', async () => {
      const item = await itemsRepository.getItemById(999);
      expect(item).toBeUndefined();
    });
  });

  describe('insertItem', () => {
    const validNewItem = { name: 'Durian', price: 3.5 };

    it('inserts a valid item and updates the file', async () => {
      validateItem.mockReturnValue({ isValid: true, errors: [] });

      const before = Date.now();
      await itemsRepository.insertItem(validNewItem);
      const after = Date.now();

      expect(validateItem).toHaveBeenCalledWith(expect.objectContaining(validNewItem));
      expect(fs.writeFile).toHaveBeenCalled();

      const writeArgs = JSON.parse(fs.writeFile.mock.calls[0][1]);
      const insertedItem = writeArgs.find(i => i.name === 'Durian');

      expect(insertedItem).toBeDefined();
      expect(insertedItem.id).toBeGreaterThanOrEqual(before);
      expect(insertedItem.id).toBeLessThanOrEqual(after);
      expect(statsService.recalculate).toHaveBeenCalled();
    });

    it('throws an error if item is invalid', async () => {
      const invalidItem = { name: null };
      validateItem.mockReturnValue({
        isValid: false,
        errors: ['Name is required']
      });

      await expect(itemsRepository.insertItem(invalidItem)).rejects.toMatchObject({
        message: 'Invalid item data',
        status: 400,
        errors: ['Name is required']
      });

      expect(fs.writeFile).not.toHaveBeenCalled();
      expect(statsService.recalculate).not.toHaveBeenCalled();
    });
  });
});

