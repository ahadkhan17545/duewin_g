import React from 'react';
import loaderimg from '../../Assets/loader/download.png'

const RotatingLoader = ({ isVisible = true }) => {
  // Inline styles for the loader
  const styles = {
    loaderOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isVisible ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rotatingImage: {
      width: '80px',
      height: '80px',
      animation: 'rotate 1.5s infinite linear',
    },
    '@keyframes rotate': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  };

  // Add the keyframes animation to the document
  React.useEffect(() => {
    // Create the keyframes style element if it doesn't exist
    if (!document.getElementById('rotating-loader-keyframes')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'rotating-loader-keyframes';
      styleEl.innerHTML = `
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Clean up on unmount
    return () => {
      const styleEl = document.getElementById('rotating-loader-keyframes');
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div style={styles.loaderOverlay}>
      <div style={styles.loaderContainer}>
        <img
          src={loaderimg} // Replace with actual path to your image
          alt="Loading"
          style={styles.rotatingImage}
        />
      </div>
    </div>
  );
};

export default RotatingLoader;