import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import { showError } from "../utils/toastUtils";

const SOCKET_URL = "wss://api.strikecolor1.com";

const useSocket = (gameType = "wingo", duration = 60) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [gameData, setGameData] = useState({
    currentPeriod: null,
    timeRemaining: { minutes: 0, seconds: 60 },
    currentResult: null,
    gameHistory: [],
  });

  // Get token from localStorage
  const getToken = useCallback(() => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      return null;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    const token = getToken();

    if (!token) {
      setConnectionError("Authentication token not found");
      return null;
    }

    return io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
  }, [getToken]);

  // Setup socket event listeners
  const setupSocketListeners = useCallback(
    (socket) => {
      socket.on("connect", () => {
        setIsConnected(true);
        setConnectionError(null);
        socket.emit("joinGame", { gameType, duration });
        socket.emit("getCurrentPeriod", { gameType, duration });
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);
        if (reason === "io server disconnect") {
          setTimeout(() => socketRef.current?.connect(), 1000);
        }
      });

      socket.on("connect_error", (error) => {
        setIsConnected(false);
        setConnectionError(error.message || "Connection failed");
      });

      socket.on("joinedGame", (data) => {
        if (data.currentPeriod || data.periodId) {
          const periodId = data.currentPeriod?.periodId || data.periodId;
          setGameData((prev) => ({
            ...prev,
            currentPeriod: { periodId },
            currentResult: null,
          }));
        }
      });

      socket.on("timeUpdate", (data) => {
        if (data.timeRemaining !== undefined) {
          const totalSeconds = Math.max(0, data.timeRemaining);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;

          setGameData((prev) => {
            const updates = {
              ...prev,
              timeRemaining: { minutes, seconds },
            };

            if (data.periodId && data.periodId !== prev.currentPeriod?.periodId) {
              updates.currentPeriod = { periodId: data.periodId };
              updates.currentResult = null;
            }

            return updates;
          });
        }
      });

      socket.on("periodInfo", (data) => {
        if (data.periodId) {
          setGameData((prev) => ({
            ...prev,
            currentPeriod: { periodId: data.periodId },
            currentResult: null,
          }));
        }

        if (data.timeRemaining !== undefined) {
          const totalSeconds = Math.max(0, data.timeRemaining);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;

          setGameData((prev) => ({
            ...prev,
            timeRemaining: { minutes, seconds },
          }));
        }
      });

      socket.on("periodResult", (data) => {
        if (data.result && data.periodId) {
          const newEntry = {
            period: data.periodId,
            number: data.result.number,
            bigSmall: data.result.size || (data.result.number >= 5 ? "Big" : "Small"),
            color: data.result.color,
            timestamp: new Date().toISOString(),
          };

          setGameData((prev) => ({
            ...prev,
            currentResult: [data.result.number],
            gameHistory: [newEntry, ...prev.gameHistory].slice(0, 50),
          }));
        }
      });

      socket.on("newPeriodStarted", (data) => {
        setGameData((prev) => ({
          ...prev,
          currentPeriod: { periodId: data.periodId },
          currentResult: null,
          timeRemaining: {
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          },
        }));
      });

      socket.on("gameUpdate", (data) => {
        setGameData((prev) => {
          const updates = {};

          if (data.periodId && data.periodId !== prev.currentPeriod?.periodId) {
            updates.currentPeriod = { periodId: data.periodId };
            updates.currentResult = null;
          }

          if (data.result && data.periodId) {
            updates.currentResult = [data.result.number];
            const newEntry = {
              period: data.periodId,
              number: data.result.number,
              bigSmall: data.result.size || (data.result.number >= 5 ? "Big" : "Small"),
              color: data.result.color,
              timestamp: new Date().toISOString(),
            };
            updates.gameHistory = [newEntry, ...prev.gameHistory].slice(0, 50);
          }

          return { ...prev, ...updates };
        });
      });
            // Handle bet error events
      socket.on("betError", (data) => {
        const errorMessage = data.error || data.message || "Failed to place bet. Please try again.";
        showError(errorMessage);
      });
    },
    [gameType, duration]
  );

  // Connect to socket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = initializeSocket();
    if (!socket) return;
    
    socketRef.current = socket;
    setupSocketListeners(socket);
    socket.connect();
  }, [initializeSocket, setupSocketListeners]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("leaveGame", { gameType, duration });
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  }, [gameType, duration]);

  // Emit events
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      return true;
    }
    return false;
  }, []);

  // Place bet function
  const placeBet = useCallback(
    (betData) => {
      if(betData?.betValue == "3 Continuous"){
        betData.betValue = null
        betData.betType = "STRAIGHT"
      }
      const fullBetData = {
        ...betData,
        gameType,
        duration,
        periodId: gameData.currentPeriod?.periodId,
      };
      return emit("placeBet", fullBetData);
    },
    [emit, gameType, duration, gameData.currentPeriod]
  );

  // Initialize timer countdown with period management
  useEffect(() => {
    if (!isConnected) return;

    const countdownInterval = setInterval(() => {
      setGameData((prev) => {
        const { minutes, seconds } = prev.timeRemaining;

        if (minutes === 0 && seconds === 0) {
          if (socketRef.current?.connected) {
            socketRef.current.emit("requestNewPeriod", { gameType, duration });
          }

          return {
            ...prev,
            timeRemaining: { 
              minutes: Math.floor(duration / 60), 
              seconds: duration % 60 
            },
            currentPeriod: { periodId: "Loading..." },
            currentResult: null,
          };
        }

        if (seconds > 0) {
          return {
            ...prev,
            timeRemaining: { minutes, seconds: seconds - 1 },
          };
        } else if (minutes > 0) {
          return {
            ...prev,
            timeRemaining: { minutes: minutes - 1, seconds: 59 },
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isConnected, duration, gameType]);

  // Initialize socket on mount and when game settings change
  useEffect(() => {
    connect();
    return disconnect;
  }, [gameType, duration]);

  // Initialize timer and period on game change
  useEffect(() => {
    setGameData((prev) => ({
      ...prev,
      timeRemaining: { 
        minutes: Math.floor(duration / 60), 
        seconds: duration % 60 
      },
      currentPeriod: prev.currentPeriod || { periodId: "Loading..." },
      currentResult: null,
    }));
  }, [duration]);

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
    socket: socketRef.current,
  };
};

export default useSocket;