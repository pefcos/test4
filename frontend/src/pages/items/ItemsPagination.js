import React from 'react';
import { useData } from '../../state/DataContext';

const ItemsPagination = () => {
  const { page, goToPage, limitPerPage, totalCount } = useData();
  const lastPage = Math.ceil(totalCount / limitPerPage);

  if (lastPage <= 1) return null;

  return (
    <nav className="float-end">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(1)} disabled={page === 1}>
            First
          </button>
        </li>

        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
        </li>

        <li className="page-item active">
          <span className="page-link">
            {page}
          </span>
        </li>

        <li className={`page-item ${page === lastPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(page + 1)} disabled={page === lastPage}>
            Next
          </button>
        </li>

        <li className={`page-item ${page === lastPage || lastPage === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(lastPage)} disabled={page === lastPage}>
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default ItemsPagination;
