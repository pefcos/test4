import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postItemToAPI } from '../services/items';

function NewItem() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !category.trim() || isNaN(parseFloat(price))) {
      return;
    }

    const newItem = {
      name,
      category,
      price: parseFloat(price)
    };

    await postItemToAPI(newItem);

    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemCategory" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="itemCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemPrice" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="itemPrice"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  );
}

export default NewItem;
