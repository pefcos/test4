import React, { useEffect } from 'react';
import { useData } from '../../state/DataContext';
import LoadingSpinner from '../LoadingSpinner';

function ItemsStats() {
  const { stats, fetchStats } = useData();
  
  useEffect(() => {
    const controller = new AbortController();

    fetchStats({ signal: controller.signal }).catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

    return () => {
      controller.abort();
    };
  }, [fetchStats]);

  // Loading Spinner
  if (stats.total === undefined) return <LoadingSpinner center={false}/>;

  return (
    <div>
      <span className="text-muted">
        <b>$ {stats.averagePrice.toFixed(2)}</b> average price across <b>{stats.total} items</b>.
      </span>
    </div>
  );
}

export default ItemsStats;
