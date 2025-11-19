import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`} />
  );
};

export default LoadingSpinner;