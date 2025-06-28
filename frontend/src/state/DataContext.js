import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { fetchItemsFromAPI } from '../services/items';
import { fetchStatsFromAPI } from '../services/stats';
import { useLocation } from 'react-router-dom';

const DataContext = createContext();
const LIMIT_PER_PAGE = 200;

export function DataProvider({ children }) {
  const [items, setItems] = useState(undefined);
  const [stats, setStats] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  // Params to fetch items
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const location = useLocation();

  const fetchItems = useCallback(async ({ signal }) => {
    const data = await fetchItemsFromAPI({ signal, query, limit: 200, page: page });
    setItems(data.items);
    setTotalCount(data.totalCount);
  }, []);

  const fetchStats = useCallback(async ({ signal }) => {
    const data = await fetchStatsFromAPI(signal);
    setStats(data);
  }, []);

  const searchItems = useCallback(async (queryInput, signal) => {
    setQuery(queryInput);
    setItems(undefined);
    setPage(1);
    const data = await fetchItemsFromAPI({ signal, query: queryInput, LIMIT_PER_PAGE, page: 1 });
    setItems(data.items);
    setTotalCount(data.totalCount);
  }, []);

  const goToPage = useCallback(async (newPage, signal) => {
    if (newPage < 1) return;

    setItems(undefined);
    setPage(newPage);
    const data = await fetchItemsFromAPI({ signal, query, limit: 200, page: newPage });
    setItems(data.items);
  }, [query, stats.total]);

  const clearFilters = useCallback(() => {
    setQuery('');
    setPage(1);
    setItems(undefined);
  }, []);

  // Clears filters on location change, avoids inconsistent behavior
  useEffect(() => {
    clearFilters();
  }, [location.pathname, clearFilters]);

  return (
    <DataContext.Provider value={{
      items,
      fetchItems,
      stats,
      fetchStats,
      page,
      query,
      searchItems,
      goToPage,
      clearFilters,
      totalCount,
      limitPerPage: LIMIT_PER_PAGE,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
