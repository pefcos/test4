import React from 'react';
import { useNavigate } from 'react-router-dom';
import ItemsList from '../../components/items/ItemsList';
import ItemsStats from '../../components/items/ItemsStats';
import ItemsSearch from '../../components/items/ItemsSearch';
import ItemsPagination from '../../components/items/ItemsPagination';
import { DataProvider } from '../../state/DataContext';

function Items() {
  const navigate = useNavigate();

  return (
    <DataProvider>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h3>Your Items</h3>
        </div>
        <ItemsSearch/>
      </div>
      <ItemsStats/>

      <hr/>

      <ItemsList/>
      <div className="row">
        <div className="col-md-6 col-12">
          <button className="btn btn-outline-success" onClick={() => navigate("/items/new")}> Add Item </button>
        </div>
        <div className="col-md-6 col-12">
          <ItemsPagination/>
        </div>
      </div>
    </DataProvider>
  );
}

export default Items;
