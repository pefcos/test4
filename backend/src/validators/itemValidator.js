function validateItem(item) {
  const errors = [];

  if (!item.name || typeof item.name !== 'string') {
    errors.push('Name is required and must be a string.');
  }

  if (item.price !== undefined && typeof item.price !== 'number') {
    errors.push('Price must be a number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = { validateItem };
