import React, { useState } from 'react';
import { useData } from '../../state/DataContext';

function ItemsSearch() {
  const { searchItems } = useData();
  const [localQuery, setLocalQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    await searchItems(localQuery, controller.signal);
  };

  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
      <button className="btn btn-outline-primary" type="submit">
        Search
      </button>
    </form>
  );
}

export default ItemsSearch;
