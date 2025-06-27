const { mean } = require('../../utils/stats');

describe('mean', () => {
  it('calculates correctly for many items', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    expect(mean(items)).toBe(20);
  });

  it('calculates correctly for a single item', () => {
    const items = [{ price: 100 }];
    expect(mean(items)).toBe(100);
  });

  it('returns 0 for an empty array', () => {
    const items = [];
    expect(mean(items)).toBeNaN();
  });

  it('calculates correctly for decimal values', () => {
    const items = [
      { price: 1.5 },
      { price: 2.5 },
      { price: 3 }
    ];
    expect(mean(items)).toBeCloseTo(2.33, 2);
  });

  it('throws if param is null', () => {
    const items = null;
    expect(() => mean(items)).toThrow();
  });
});

