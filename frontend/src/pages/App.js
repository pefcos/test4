import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
// Items Routes
import ItemDetail from './items/ItemDetail';
import Items from './items/Items';
import NewItem from './items/NewItem';

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
