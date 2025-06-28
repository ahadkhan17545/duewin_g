import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://api.strikecolor1.com';

const useSocket = (gameType = 'wingo', duration = 60) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [gameData, setGameData] = useState({
    currentPeriod: null,
    timeRemaining: { minutes: 0, seconds: 60 },
    currentResult: null,
    gameHistory: [],
  });

  // Enhanced logging function
  const logSocket = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      'info': '🔵',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'data': '📊',
      'event': '📨',
      'emit': '📤',
      'connect': '🔌'
    };
    
    // console.group(`${prefix[type] || '📝'} [${timestamp}] SOCKET ${type.toUpperCase()}: ${message}`);
    if (data) {
      // console.log('Data:', data);
    }
    // console.log('Socket ID:', socketRef.current?.id || 'Not connected');
    // console.log('Connection Status:', isConnected);
    // console.log('Game Type:', gameType, 'Duration:', duration);
    console.groupEnd();
  };

  // Generate a new period ID based on current time
  // const generatePeriodId = useCallback(() => {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0');
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const hours = String(now.getHours()).padStart(2, '0');
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const seconds = String(now.getSeconds()).padStart(2, '0');
    
  //   const periodId = `${year}${month}${day}${hours}${minutes}${seconds.substring(0, 1)}`;
  //   logSocket('info', 'Generated new period ID', { periodId });
  //   return periodId;
  // }, []);

  // Get token from localStorage
  const getToken = useCallback(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        logSocket('info', 'Token retrieval', { 
          hasToken: !!token, 
          tokenLength: token?.length || 0 
        });
        return token;
      }
      logSocket('warning', 'localStorage not available');
      return null;
    } catch (error) {
      logSocket('error', 'Error accessing localStorage', error);
      return null;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    const token = getToken();
    
    if (!token) {
      logSocket('error', 'No authentication token found');
      setConnectionError('Authentication token not found');
      return null;
    }

    logSocket('info', 'Initializing socket connection', {
      url: SOCKET_URL,
      gameType,
      duration,
      hasToken: true
    });
    
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    logSocket('info', 'Socket configuration', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000
    });

    return socket;
  }, [getToken, gameType, duration]);

  // Setup socket event listeners
  const setupSocketListeners = useCallback((socket) => {
    logSocket('info', 'Setting up socket event listeners');

    socket.on('connect', () => {
      logSocket('connect', 'Socket connected successfully', {
        socketId: socket.id,
        transport: socket.io.engine.transport.name
      });
      setIsConnected(true);
      setConnectionError(null);
      
      socket.emit('joinGame', { gameType, duration });
      socket.emit('getCurrentPeriod', { gameType, duration });
    });

    socket.on('disconnect', (reason) => {
      logSocket('error', 'Socket disconnected', { reason });
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        logSocket('warning', 'Server initiated disconnect, attempting reconnect');
        setTimeout(() => {
          if (socketRef.current) {
            logSocket('info', 'Manual reconnect attempt');
            socketRef.current.connect();
          }
        }, 1000);
      }
    });

    socket.on('connect_error', (error) => {
      logSocket('error', 'Socket connection error', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type
      });
      setIsConnected(false);
      setConnectionError(error.message || 'Connection failed');
    });

    socket.on('joinedGame', (data) => {
      logSocket('success', 'Successfully joined game room', data);
      
      if (data.currentPeriod || data.periodId) {
        const periodId = data.currentPeriod?.periodId || data.periodId;
        logSocket('info', 'Updating period from joinedGame', { periodId });
        setGameData(prev => ({
          ...prev,
          currentPeriod: { periodId },
          currentResult: null // Clear result on join
        }));
      }
    });

    socket.on('timeUpdate', (data) => {
      logSocket('data', 'Time update received', data);
      if (data.timeRemaining !== undefined) {
        const totalSeconds = Math.max(0, data.timeRemaining);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        setGameData(prev => {
          const updates = {
            ...prev,
            timeRemaining: { minutes, seconds }
          };
          
          if (data.periodId && data.periodId !== prev.currentPeriod?.periodId) {
            logSocket('info', 'Period ID updated from timeUpdate', { 
              oldPeriod: prev.currentPeriod?.periodId, 
              newPeriod: data.periodId 
            });
            updates.currentPeriod = { periodId: data.periodId };
            updates.currentResult = null; // Clear result on period change
          }
          
          return updates;
        });
      }
    });

    socket.on('periodInfo', (data) => {
      logSocket('data', 'Period info received', data);
      
      if (data.periodId) {
        logSocket('info', 'Updating period from periodInfo', { 
          newPeriod: data.periodId 
        });
        setGameData(prev => ({
          ...prev,
          currentPeriod: { periodId: data.periodId },
          currentResult: null // Clear result on period change
        }));
      }
      
      if (data.timeRemaining !== undefined) {
        const totalSeconds = Math.max(0, data.timeRemaining);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        setGameData(prev => ({
          ...prev,
          timeRemaining: { minutes, seconds }
        }));
      }
    });

    socket.on('periodResult', (data) => {
      logSocket('success', 'Period result received', data);
      if (data.result && data.periodId) {
        const newEntry = {
          period: data.periodId,
          number: data.result.number,
          bigSmall: data.result.size || (data.result.number >= 5 ? 'Big' : 'Small'),
          color: data.result.color,
          timestamp: new Date().toISOString(),
        };

        logSocket('data', 'Adding new game history entry', newEntry);

        setGameData(prev => ({
          ...prev,
          currentResult: [data.result.number],
          gameHistory: [newEntry, ...prev.gameHistory].slice(0, 50)
        }));
      }
    });

    socket.on('newPeriodStarted', (data) => {
      logSocket('info', 'New period started', data);
      
      const newPeriodId = data.periodId;
      logSocket('info', 'Starting new period', { 
        receivedPeriod: data.periodId,
        newPeriod: newPeriodId
      });
      
      setGameData(prev => ({
        ...prev,
        currentPeriod: { periodId: newPeriodId },
        currentResult: null, // Explicitly clear result
        timeRemaining: { minutes: Math.floor(duration / 60), seconds: duration % 60 }
      }));
    });

    socket.on('gameUpdate', (data) => {
      logSocket('data', 'Game update received', data);
      setGameData(prev => {
        const updates = {};
        
        if (data.periodId && data.periodId !== prev.currentPeriod?.periodId) {
          updates.currentPeriod = { periodId: data.periodId };
          updates.currentResult = null; // Clear result on period change
          logSocket('info', 'Period updated from gameUpdate', { 
            oldPeriod: prev.currentPeriod?.periodId,
            newPeriod: data.periodId 
          });
        }
        
        if (data.result && data.periodId) {
          updates.currentResult = [data.result.number];
          const newEntry = {
            period: data.periodId,
            number: data.result.number,
            bigSmall: data.result.size || (data.result.number >= 5 ? 'Big' : 'Small'),
            color: data.result.color,
            timestamp: new Date().toISOString(),
          };
          updates.gameHistory = [newEntry, ...prev.gameHistory].slice(0, 50);
          logSocket('data', 'Game result processed', newEntry);
        }
        
        return { ...prev, ...updates };
      });
    });

    socket.on('betConfirmation', (result) => {
      logSocket('success', 'Bet confirmation received', result);
    });

    socket.on('betError', (error) => {
      logSocket('error', 'Bet error received', error);
    });

    socket.onAny((event, ...args) => {
      logSocket('event', `Received event: ${event}`, {
        event,
        argsCount: args.length,
        data: args
      });
    });

    logSocket('success', 'All socket event listeners configured');
  }, [gameType, duration]);

  // Connect to socket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      logSocket('warning', 'Socket already connected');
      return;
    }

    logSocket('info', 'Initiating socket connection');
    const socket = initializeSocket();
    if (!socket) {
      logSocket('error', 'Failed to initialize socket');
      return;
    }

    socketRef.current = socket;
    setupSocketListeners(socket);
    
    logSocket('info', 'Attempting to connect socket');
    socket.connect();
  }, [initializeSocket, setupSocketListeners]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      logSocket('info', 'Disconnecting socket', { socketId: socketRef.current.id });
      socketRef.current.emit('leaveGame', { gameType, duration });
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      logSocket('success', 'Socket disconnected and cleaned up');
    }
    setIsConnected(false);
    setConnectionError(null);
  }, [gameType, duration]);

  // Emit events
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      logSocket('emit', `Emitting event: ${event}`, data);
      socketRef.current.emit(event, data);
      return true;
    } else {
      logSocket('warning', `Cannot emit ${event}: Socket not connected`, { event, data });
      return false;
    }
  }, []);

  // Place bet function
  const placeBet = useCallback((betData) => {
    const fullBetData = {
      ...betData,
      gameType,
      duration,
      periodId: gameData.currentPeriod?.periodId
    };
    
    logSocket('emit', 'Placing bet', fullBetData);
    return emit('placeBet', fullBetData);
  }, [emit, gameType, duration, gameData.currentPeriod]);

  // Initialize timer countdown with period management
  useEffect(() => {
    let countdownInterval;
    
    if (isConnected) {
      logSocket('info', 'Starting local countdown timer');
      countdownInterval = setInterval(() => {
        setGameData(prev => {
          const { minutes, seconds } = prev.timeRemaining;
          
          if (minutes === 0 && seconds === 0) {
            const newMinutes = Math.floor(duration / 60);
            const newSeconds = duration % 60;
            
            logSocket('info', 'Timer expired - starting new period', { 
              newMinutes, 
              newSeconds, 
              duration,
              oldPeriodId: prev.currentPeriod?.periodId
            });
            
            if (socketRef.current?.connected) {
              socketRef.current.emit('requestNewPeriod', { 
                gameType, 
                duration 
              });
            }
            
            // Instead of generating a period ID, set it to loading state
            return {
              ...prev,
              timeRemaining: { minutes: newMinutes, seconds: newSeconds },
              currentPeriod: { periodId: " Loading... " },
              currentResult: null // Clear result on timer expiration
            };
          }
          
          if (seconds > 0) {
            return {
              ...prev,
              timeRemaining: { minutes, seconds: seconds - 1 }
            };
          } else if (minutes > 0) {
            return {
              ...prev,
              timeRemaining: { minutes: minutes - 1, seconds: 59 }
            };
          }
          
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        logSocket('info', 'Local countdown timer cleared');
      }
    };
  }, [isConnected, duration]);

  // Initialize socket on mount and when game settings change
  useEffect(() => {
    logSocket('info', 'Hook initialized/updated', { gameType, duration });
    connect();

    return () => {
      logSocket('info', 'Hook cleanup');
      disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [gameType, duration]);

  // Initialize timer and period on game change
  useEffect(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    logSocket('info', 'Timer initialized', { 
      minutes, 
      seconds, 
      duration
    });
    
    setGameData(prev => ({
      ...prev,
      timeRemaining: { minutes, seconds },
      currentPeriod: prev.currentPeriod || { periodId: "Loading..." },
      currentResult: null // Clear result on initialization
    }));
  }, [duration]);

  // Log state changes
  useEffect(() => {
    logSocket('info', 'Connection state changed', { 
      isConnected, 
      error: connectionError 
    });
  }, [isConnected, connectionError]);

  useEffect(() => {
    logSocket('data', 'Game data updated', {
      hasPeriod: !!gameData.currentPeriod,
      periodId: gameData.currentPeriod?.periodId,
      timeRemaining: gameData.timeRemaining,
      historyCount: gameData.gameHistory.length,
      hasResult: !!gameData.currentResult
    });
  }, [gameData]);

  return {
    isConnected,
    connectionError,
    currentPeriod: gameData.currentPeriod,
    timeRemaining: gameData.timeRemaining,
    currentResult: gameData.currentResult,
    gameHistory: gameData.gameHistory,
    connect,
    disconnect,
    emit,
    placeBet,
    socket: socketRef.current
  };
};

export default useSocket;