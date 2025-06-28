import React, { useState, useContext } from 'react';
import { useData } from '../../state/DataContext';

function ItemsSearch() {
  const { fetchItems } = useData();
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    fetchItems({ signal: controller.signal, query });
  };

  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-primary" type="submit">
        Search
      </button>
    </form>
  );
}

export default ItemsSearch;
