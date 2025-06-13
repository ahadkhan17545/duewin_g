import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://strike.atsproduct.in";

export const signupUser = createAsyncThunk(
  "signup/signupUser",
  async (signupData, { rejectWithValue }) => {
    try {
      // Client-side validation
      if (!signupData.phoneNumber || !/^\d{10}$/.test(signupData.phoneNumber)) {
        console.log("Validation failed for phoneNumber:", signupData.phoneNumber);
        return rejectWithValue("Phone number must be exactly 10 digits");
      }
      if (!signupData.password || signupData.password.length < 6) {
        console.log("Validation failed for password:", signupData.password);
        return rejectWithValue("Password must be at least 6 characters long");
      }

      // Prepare payload
      const payload = {
        phone_no: signupData.phoneNumber, // Send only the 10-digit phone number
        password: signupData.password,
      };
      // Only include referred_by if inviteCode is non-empty
      if (signupData.inviteCode) {
        payload.referred_by = signupData.inviteCode; // Changed from referral_by to referred_by
      }

      console.log("Sending signup payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/users/signup`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup response:", response.data);
      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error("Signup error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      // Return a serializable error message
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) || // Log the full data for debugging
        "Signup failed. Please check your input and try again.";
      return rejectWithValue(message);
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.log("Rejected payload:", action.payload);
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { resetError } = signupSlice.actions;
export default signupSlice.reducer;