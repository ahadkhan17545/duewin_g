import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch data
export const fetchActivityData = createAsyncThunk(
  "activity/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.example.com/activity"); // Replace with actual API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    data: [],
    isLoading: false,
    isError: false,
  },
  reducers: {}, // If needed, define synchronous actions here
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActivityData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchActivityData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default activitySlice.reducer;
