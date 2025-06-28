import React from 'react';
import ItemsTable from './items/ItemsTable';
import ItemsStats from './items/ItemsStats';
import ItemsSearch from './items/ItemsSearch';

function Items() {
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h3>Your Items</h3>
        </div>
        <ItemsSearch/>
      </div>

      <ItemsStats/>

      <hr/>
  
      <ItemsTable/>
    </div>
  );
}

export default Items;
