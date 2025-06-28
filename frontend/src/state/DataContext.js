import React, { createContext, useCallback, useContext, useState } from 'react';
import { fetchItemsFromAPI } from '../services/items';
import { fetchStatsFromAPI } from '../services/stats';

const DataContext = createContext();
const LIMIT_PER_PAGE = 100;

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});

  // Params to fetch items
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const fetchItems = useCallback(async ({ signal }) => {
    const data = await fetchItemsFromAPI({ signal, query, LIMIT_PER_PAGE, page });
    setItems(data);
  }, []);

  const fetchStats = useCallback(async ({ signal }) => {
    const data = await fetchStatsFromAPI(signal);
    setStats(data);
  }, []);

  const searchItems = useCallback(async (queryInput, signal) => {
    setQuery(queryInput);
    setPage(1);
    const data = await fetchItemsFromAPI({ signal, query: queryInput, LIMIT_PER_PAGE, page: 1 });
    setItems(data);
  }, []);

  return (
    <DataContext.Provider value={{
      items,
      fetchItems,
      stats,
      fetchStats,
      page,
      query,
      searchItems,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
