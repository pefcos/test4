const { validateItem } = require('../../src/validators/itemValidator');

describe('validateItem', () => {
  it('should return isValid: true for a valid item (name and price)', () => {
    const item = {
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics',
      id: 123
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return error if name is missing', () => {
    const item = {
      price: 20.0,
      category: 'Books',
      id: 1
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required and must be a string.');
  });

  it('should return error if name is not a string', () => {
    const item = {
      name: 12345,
      price: 50.0,
      category: 'Tools',
      id: 2
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required and must be a string.');
  });

  it('should allow missing price (price is optional)', () => {
    const item = {
      name: 'Notebook',
      category: 'Stationery',
      id: 3
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return error if price is not a number', () => {
    const item = {
      name: 'Chair',
      price: 'twenty',
      category: 'Furniture',
      id: 4
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Price must be a number.');
  });

  it('should return both errors if name is invalid and price is not a number', () => {
    const item = {
      name: null,
      price: 'expensive',
      category: 'Luxury',
      id: 5
    };

    const result = validateItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required and must be a string.');
    expect(result.errors).toContain('Price must be a number.');
    expect(result.errors.length).toBe(2);
  });
});

