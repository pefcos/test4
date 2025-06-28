import React, { useEffect } from 'react';
import { useData } from '../../state/DataContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

function ItemsTable() {
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
  );
}

export default ItemsTable;
