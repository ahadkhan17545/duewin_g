// Complete console disabling for production
export const disableAllConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      trace: console.trace,
      dir: console.dir,
      dirxml: console.dirxml,
      group: console.group,
      groupCollapsed: console.groupCollapsed,
      groupEnd: console.groupEnd,
      time: console.time,
      timeEnd: console.timeEnd,
      timeLog: console.timeLog,
      count: console.count,
      countReset: console.countReset,
      assert: console.assert,
      profile: console.profile,
      profileEnd: console.profileEnd,
      table: console.table,
      exception: console.exception,
      clear: console.clear
    };

    // Override all console methods
    Object.keys(originalConsole).forEach(method => {
      console[method] = () => {};
    });

    // Make console object non-writable and non-configurable
    Object.defineProperty(window, 'console', {
      value: console,
      writable: false,
      configurable: false
    });

    // Also override console in global scope
    if (typeof global !== 'undefined') {
      global.console = console;
    }

    // Override console methods that might be called directly
    window.console = console;
    
    // Prevent console from being redefined
    Object.freeze(console);
  }
};

// Disable console immediately when this module is loaded
disableAllConsole(); 