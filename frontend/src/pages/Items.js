import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function Items() {
  const { items, fetchItems } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    fetchItems({ signal: controller.signal }).catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

    return () => {
      controller.abort();
    };
  }, [fetchItems]);

  // Loading Spinner
  if (!items.length) return <LoadingSpinner/>;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h3>Your Items</h3>
          <span className="text-muted"></span>
        </div>
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {items.map(item => (
            <tr
              key={item.id}
              onClick={() => navigate(`/items/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>$ {item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Items;
