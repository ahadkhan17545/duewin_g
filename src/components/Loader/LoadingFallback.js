import React from 'react';
import RotatingLoader from './RotatingLoader'; // Adjust path as needed

const LoadingFallback = () => {
  return <RotatingLoader isVisible={true} />;
};

export default LoadingFallback;