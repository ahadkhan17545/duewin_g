// Security utilities to protect source code

// Disable right-click context menu
export const disableContextMenu = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

// Disable keyboard shortcuts for developer tools
export const disableDevTools = () => {
  document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  });
};

// Disable text selection
export const disableTextSelection = () => {
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });
};

// Initialize all security measures
export const initSecurity = () => {
  if (process.env.NODE_ENV === 'production') {
    disableContextMenu();
    // disableDevTools(); // TEMPORARILY DISABLED
    // disableTextSelection(); // TEMPORARILY DISABLED
    // disableConsole(); // TEMPORARILY DISABLED
  }
};

// Disable all console methods in production
export const disableConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    // Clear existing console
    console.clear();
    
    // Disable all console methods
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    console.dir = () => {};
    console.dirxml = () => {};
    console.group = () => {};
    console.groupCollapsed = () => {};
    console.groupEnd = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    console.timeLog = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.assert = () => {};
    console.profile = () => {};
    console.profileEnd = () => {};
    console.table = () => {};
    console.exception = () => {};
    
    // Override console object completely
    Object.defineProperty(window, 'console', {
      value: {
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {},
        trace: () => {},
        dir: () => {},
        dirxml: () => {},
        group: () => {},
        groupCollapsed: () => {},
        groupEnd: () => {},
        time: () => {},
        timeEnd: () => {},
        timeLog: () => {},
        count: () => {},
        countReset: () => {},
        assert: () => {},
        profile: () => {},
        profileEnd: () => {},
        table: () => {},
        exception: () => {},
        clear: () => {}
      },
      writable: false,
      configurable: false
    });
  }
}; 