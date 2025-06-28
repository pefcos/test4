import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Navbar from './Navbar';
import NewItem from './NewItem';

function App() {
  return (
    <div>
      <Navbar/>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/items/new" element={<NewItem />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
