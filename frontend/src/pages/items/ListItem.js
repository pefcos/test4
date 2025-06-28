import React from 'react';

function ListItem({ index, style, data }) {
  const { items, navigate } = data;
  const item = items[index];

  return (
    <div
      style={style}
      onClick={() => navigate(`/items/${item.id}`)}
      className="list-group-item list-group-item-action py-2 d-flex align-items-center"
    >
      <div className="col-4 text-truncate">{item.name}</div>
      <div className="col-4 text-truncate">{item.category}</div>
      <div className="col-4 text-end">$ {item.price.toFixed(2)}</div>
    </div>
  );
}

export default ListItem;
