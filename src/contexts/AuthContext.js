// AuthContext.js - Consolidated authentication context
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { isAuthenticated, redirectToLogin, validateToken } from '../api/auth';

// Auth state and actions
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: true, loading: false, error: null };
    case 'SET_UNAUTHENTICATED':
      return { ...state, isAuthenticated: false, loading: false, error: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Single authentication check function
  const checkAuth = async () => {
    try {
      const authenticated = isAuthenticated();
      
      if (authenticated) {
        // Validate token if authenticated
        const isValid = await validateToken();
        if (isValid) {
          dispatch({ type: 'SET_AUTHENTICATED' });
        } else {
          console.log('Token validation failed');
          dispatch({ type: 'SET_UNAUTHENTICATED', payload: 'Token validation failed' });
        }
      } else {
        dispatch({ type: 'SET_UNAUTHENTICATED', payload: 'Not authenticated' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: 'SET_UNAUTHENTICATED', payload: error.message });
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for auth errors and storage changes
  useEffect(() => {
    const handleAuthError = (event) => {
      console.log('Global auth error detected:', event.detail);
      dispatch({ type: 'SET_UNAUTHENTICATED', payload: event.detail?.message || 'Authentication failed' });
    };

    // Listen for storage events (logout from another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue) {
        console.log('Token removed in another tab, logging out');
        dispatch({ type: 'SET_UNAUTHENTICATED', payload: 'Logged out from another tab' });
      }
    };

    window.addEventListener('auth-error', handleAuthError);
    window.addEventListener('storage', handleStorageChange);

    // Periodic auth check every 5 minutes (only if authenticated)
    const interval = setInterval(() => {
      if (state.isAuthenticated) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [state.isAuthenticated]);

  const value = {
    ...state,
    login: () => dispatch({ type: 'SET_AUTHENTICATED' }),
    logout: () => {
      dispatch({ type: 'SET_UNAUTHENTICATED', payload: 'Logged out' });
      redirectToLogin();
    },
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    checkAuth // Expose checkAuth for manual checks
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for components that need auth
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      redirectToLogin();
      return null;
    }

    return <Component {...props} />;
  };
};