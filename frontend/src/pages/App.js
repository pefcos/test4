import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Navbar from './Navbar';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <div>
      <Navbar/>
      <DataProvider>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </div>
      </DataProvider>
    </div>
  );
}

export default App;
