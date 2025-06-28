import React from 'react';
import ItemsTable from './items/ItemsTable';
import ItemsStats from './items/ItemsStats';

function Items() {
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h3>Your Items</h3>
        </div>
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>
      </div>

      <ItemsStats/>

      <hr/>
  
      <ItemsTable/>
    </div>
  );
}

export default Items;
