import React from 'react';

const LoadingSpinner = ({ center = true }) => {
  return (
    <div className={center ? 'text-center' : ''}>
      <div className="spinner-border" role="status" data-testid="loading-spinner">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
