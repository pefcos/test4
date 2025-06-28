import React, { useEffect, useRef } from 'react';
import { useData } from '../../state/DataContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';
import { FixedSizeList } from 'react-window';
import ListItem from './ListItem';

// Used by react-window
const LIST_ITEM_HEIGHT = 41.5;
const MAX_LIST_HEIGHT = 550;

function ItemsList() {
  const { items, fetchItems } = useData();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
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
  if (items === undefined) return <LoadingSpinner/>;

  // Empty list
  if (!items.length) return <h5 className="text-muted mb-4">No items found.</h5>;

  // Height used by react-window
  const listHeight = Math.min(items.length * LIST_ITEM_HEIGHT, MAX_LIST_HEIGHT);

  return (
    <div ref={containerRef} className="card mb-3" style={{ width: '100%' }}>
      <div className="card-header list-group-item-light d-flex align-items-center fw-bold">
        <div className="col-4">Name</div>
        <div className="col-4">Category</div>
        <div className="col-4 text-end">Price</div>
      </div>

      <div className="list-group list-group-flush" style={{ overflow: 'auto' }}>
        <FixedSizeList
          height={listHeight}
          itemCount={items.length}
          itemSize={LIST_ITEM_HEIGHT}
          itemData={{ items, navigate }}
          width={'100%'}
        >
          {ListItem}
        </FixedSizeList>
      </div>
    </div>
  );
}

export default ItemsList;
