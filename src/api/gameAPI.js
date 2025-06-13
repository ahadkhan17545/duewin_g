import axios from 'axios';
import { redirectToLogin, validateToken } from './auth';

const API_BASE_URL = 'https://strike.atsproduct.in';
const CACHE_DURATION = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

// In-memory cache object
const cache = new Map();

// Function to get the token - FIXED for environments without localStorage
const getToken = () => {
  try {
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    // Fallback: return null if localStorage is not available
    console.warn('localStorage not available, authentication may fail');
    return null;
  } catch (error) {
    console.warn('Error accessing localStorage:', error);
    return null;
  }
};

// Enhanced request interceptor with auth validation
axios.interceptors.request.use(
  async (config) => {
    // Skip auth validation for login/signup endpoints
    const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/signup');
    
    if (!isAuthEndpoint) {
      // Validate token before making request
      const isValid = await validateToken();
      if (!isValid) {
        return Promise.reject(new Error('Authentication required'));
      }
    }
    
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 20) + '...');
    } else if (!isAuthEndpoint) {
      console.warn('No authentication token found');
      redirectToLogin();
      return Promise.reject(new Error('No authentication token'));
    }
    
    // Add additional headers that might be required
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    
    console.log('Making request to:', config.url);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
axios.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token expired or invalid, redirecting to login');
      redirectToLogin();
      return Promise.reject(new Error('Authentication failed. Please login again.'));
    } else if (error.response?.status === 403) {
      console.error('403 Forbidden - Access denied, redirecting to login');
      redirectToLogin();
      return Promise.reject(new Error('Access forbidden. Please login again.'));
    } else if (error.response?.status === 404) {
      console.error('404 Not Found - Check API endpoint URL');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to generate cache key
const getCacheKey = (url, params = {}) => {
  const paramString = Object.entries(params)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return `${url}${paramString ? `?${paramString}` : ''}`;
};

// Helper function to check if cache is valid
const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

const setupCacheRefresh = () => {
  const checkTimeAndClearCache = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(now.getTime() + istOffset);
    
    if (istTime.getUTCHours() === 20 && istTime.getUTCMinutes() === 30 && istTime.getUTCSeconds() < 60) {
      cache.clear();
      console.log('Cache cleared at 2 AM IST');
    }
  };
  
  setInterval(checkTimeAndClearCache, 60 * 1000);
};

setupCacheRefresh();

// Enhanced wrapper function for API calls with auth checking
const makeAuthenticatedRequest = async (requestFn, errorContext) => {
  try {
    // Check authentication before making request
    if (!await validateToken()) {
      throw new Error('Authentication required');
    }
    
    return await requestFn();
  } catch (error) {
    console.error(`${errorContext}:`, error);
    
    // Handle auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirectToLogin();
      throw new Error('Authentication failed. Please login again.');
    }
    
    throw error;
  }
};

// Wallet API functions with enhanced auth handling
export const getWalletBalance = async () => {
  return makeAuthenticatedRequest(
    async () => {
      const response = await axios.get(`${API_BASE_URL}/api/wallet/balance`);
      return response.data;
    },
    'Error fetching wallet balance'
  );
};

export const transferFromThirdParty = async () => {
  return makeAuthenticatedRequest(
    async () => {
      const token = getToken();
      console.log('Making transfer request with token:', token?.substring(0, 20) + '...');
      
      const response = await axios.post(`${API_BASE_URL}/api/wallet/transfer-from-third-party`, {
        // Add any required body parameters here if needed by your API
      });
      
      console.log('Transfer API success:', response.data);
      return response.data;
    },
    'Transfer API error'
  );
};

const gameApi = {
  // Test function to check API connectivity and auth
  testConnection: async () => {
    try {
      console.log('Testing API connection...');
      
      // Check auth first
      if (!await validateToken()) {
        return { success: false, error: 'Authentication required' };
      }
      
      const token = getToken();
      console.log('Token available:', !!token);
      
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 10000
      });
      console.log('Connection test successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Connection test failed:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        redirectToLogin();
        return { success: false, error: 'Authentication failed' };
      }
      
      return { success: false, error: error.message };
    }
  },

  // Enhanced getUserBets function with auth checking
  getUserBets: async (gameType, duration, { page = 1, limit = 10 } = {}) => {
    return makeAuthenticatedRequest(
      async () => {
        console.log(`🔄 Fetching user bets for ${gameType}/${duration}, page ${page}, limit ${limit}`);
        
        // Try multiple possible endpoint variations
        const possibleEndpoints = [
          `${API_BASE_URL}/api/games/${gameType}/${duration}/my-bets`,
          `${API_BASE_URL}/api/games/${gameType}/my-bets`,
          `${API_BASE_URL}/api/games/${gameType}/user-bets`,
          `${API_BASE_URL}/api/user/bets/${gameType}/${duration}`,
          `${API_BASE_URL}/api/user/bets/${gameType}`,
          `${API_BASE_URL}/api/bets/user/${gameType}/${duration}`,
          `${API_BASE_URL}/api/bets/user/${gameType}`
        ];

        let lastError;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`🔍 Trying endpoint: ${endpoint}`);
            
            const cacheKey = getCacheKey(endpoint, { page, limit });
            
            // Check cache first
            const cachedData = cache.get(cacheKey);
            if (isCacheValid(cachedData)) {
              console.log('✅ Returning cached user bets data');
              return cachedData.data;
            }

            const response = await axios.get(endpoint, { 
              params: { page, limit },
              timeout: 15000
            });
            
            console.log(`✅ Success with endpoint: ${endpoint}`);
            
            // Cache the successful response
            cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
            
            return response.data;
            
          } catch (error) {
            console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status || error.message);
            lastError = error;
            
            // If it's an auth error, don't try other endpoints
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            
            // If it's not a 404, break early as it might be a server issue
            if (error.response?.status !== 404) {
              break;
            }
            continue;
          }
        }
        
        // If all endpoints failed, throw the last error
        throw lastError;
      },
      `Error fetching user bets for ${gameType}/${duration}`
    ).catch(error => {
      // Return empty data structure instead of throwing
      return {
        success: false,
        data: [],
        pagination: { total_pages: 1, current_page: page, total: 0 },
        error: error.message
      };
    });
  },

  getBetDetails: async (betId) => {
    return makeAuthenticatedRequest(
      async () => {
        const response = await axios.get(`${API_BASE_URL}/api/bets/${betId}`);
        return response.data;
      },
      `Error fetching bet details for ${betId}`
    );
  },

  getGameHistory: async (gameType, duration = 60, page = 1, limit = 20) => {
    return makeAuthenticatedRequest(
      async () => {
        console.log(`Fetching game history for ${gameType}/${duration}, page ${page}, limit ${limit}`);
        
        // Try different endpoint variations for game history
        const possibleEndpoints = [
          `${API_BASE_URL}/api/games/${gameType}/${duration}/history`,
          `${API_BASE_URL}/api/games/${gameType}/history`,
          `${API_BASE_URL}/api/games/history/${gameType}/${duration}`,
          `${API_BASE_URL}/api/games/history/${gameType}`
        ];

        let lastError;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`🔍 Trying history endpoint: ${endpoint}`);
            
            const cacheKey = getCacheKey(endpoint, { page, limit });
            
            // Check cache first
            const cachedData = cache.get(cacheKey);
            if (isCacheValid(cachedData)) {
              console.log('✅ Returning cached history data');
              return cachedData.data;
            }

            const response = await axios.get(endpoint, { 
              params: { page, limit },
              timeout: 15000
            });
            
            console.log(`✅ Success with history endpoint: ${endpoint}`);
            cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
            return response.data;
            
          } catch (error) {
            console.log(`❌ Failed history endpoint ${endpoint}:`, error.response?.status || error.message);
            lastError = error;
            
            // If it's an auth error, don't try other endpoints
            if (error.response?.status === 401 || error.response?.status === 403) {
              throw error;
            }
            
            if (error.response?.status !== 404) {
              break;
            }
            continue;
          }
        }
        
        throw lastError;
      },
      `Error fetching game history for ${gameType}/${duration}`
    );
  },

  getActivePeriods: async (gameType) => {
    return makeAuthenticatedRequest(
      async () => {
        const url = `${API_BASE_URL}/api/games/${gameType}/active`;
        const cacheKey = getCacheKey(url);
        
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (isCacheValid(cachedData)) {
          return cachedData.data;
        }

        // Fetch from API if cache is invalid or missing
        const response = await axios.get(url);
        cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
      },
      `Error fetching active periods for ${gameType}`
    );
  },

  getPeriodDetails: async (gameType, periodId, duration = 60) => {
    return makeAuthenticatedRequest(
      async () => {
        const url = `${API_BASE_URL}/api/games/${gameType}/periods/${periodId}`;
        const cacheKey = getCacheKey(url, { duration });
        
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (isCacheValid(cachedData)) {
          return cachedData.data;
        }

        // Fetch from API if cache is invalid or missing
        const response = await axios.get(url, { params: { duration } });
        cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
      },
      `Error fetching period details for ${gameType}, period ${periodId}`
    );
  },

  placeBet: async (gameType, betData) => {
    return makeAuthenticatedRequest(
      async () => {
        const response = await axios.post(`${API_BASE_URL}/api/games/${gameType}/bet`, betData);
        return response.data;
      },
      `Error placing bet for ${gameType}`
    );
  },

  fetchGames: async (provider) => {
    return makeAuthenticatedRequest(
      async () => {
        const url = `${API_BASE_URL}/api/seamless-wallet/games`;
        const cacheKey = getCacheKey(url, { provider, page: 1, limit: 50 });
        
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (isCacheValid(cachedData)) {
          return cachedData.data;
        }

        // Fetch from API if cache is invalid or missing
        const response = await axios.get(url, { params: { provider, page: 1, limit: 50 } });
        cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
      },
      `Error fetching games for provider ${provider}`
    );
  },

  launchGame: async (gameId) => {
    return makeAuthenticatedRequest(
      async () => {
        const url = `${API_BASE_URL}/api/seamless/launch/${gameId}`;
        
        // Don't cache launch requests as they should be fresh each time
        const response = await axios.get(url);
        return response.data;
      },
      `Error launching game with ID ${gameId}`
    );
  },
};

export default gameApi;