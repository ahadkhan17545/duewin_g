// store.js - Your Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slice/loginSlice';
import signupReducer from './Slice/signupSlice';

const store = configureStore({
  reducer: {
    login: loginReducer,
    signup: signupReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;