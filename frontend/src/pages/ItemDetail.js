import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  // Loading spinnner
  if (!item) return <LoadingSpinner/>;

  return (
    <div>
      <h2>{item.name}</h2>
      <hr></hr>
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Go back</button>
    </div>
  );
}

export default ItemDetail;
