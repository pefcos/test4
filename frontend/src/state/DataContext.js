import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});

  // TODO: Refactor fetches into their own files.
  const fetchItems = useCallback(async ({ signal, query = '' }) => {
    const res = await fetch(`http://localhost:3001/api/items?limit=500&q=${encodeURIComponent(query)}`, { signal });
    const json = await res.json();
    setItems(json);
  }, []);

  const fetchStats = useCallback(async ({ signal }) => {
    const res = await fetch('http://localhost:3001/api/stats', { signal });
    const json = await res.json();
    setStats(json);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, stats, fetchStats }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
