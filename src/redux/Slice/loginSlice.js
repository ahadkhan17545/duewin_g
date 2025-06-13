// loginSlice.js - Updated slice with better error handling
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../api/auth";

const initialState = {
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        console.log("Login fulfilled payload:", action.payload);
        
        // Handle your API response structure: {success: true, data: {user: {...}, tokens: {accessToken, refreshToken}}}
        if (action.payload?.success && action.payload?.data) {
          const responseData = action.payload.data;
          
          // Extract tokens
          if (responseData.tokens?.accessToken) {
            state.token = responseData.tokens.accessToken;
            state.isAuthenticated = true;
            console.log("Access token set in Redux state:", responseData.tokens.accessToken);
          }
          
          // Extract user data
          if (responseData.user) {
            state.user = responseData.user;
            console.log("User data set in Redux state:", responseData.user);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Handle registration response - some APIs return token on registration
        if (action.payload?.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else if (action.payload?.data?.token) {
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
        }
        
        if (action.payload?.user) {
          state.user = action.payload.user;
        } else if (action.payload?.data?.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { resetError, logout, setToken } = loginSlice.actions;
export default loginSlice.reducer;