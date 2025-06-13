import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch data
export const fetchPromotionData = createAsyncThunk(
  "promotion/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.example.com/promotion-data"); // Replace with your API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    data: null,
    isLoading: false,
    isError: false,
  },
  reducers: {}, // If you need other synchronous reducers, define them here
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotionData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPromotionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchPromotionData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default promotionSlice.reducer;
