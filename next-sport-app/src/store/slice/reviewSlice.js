import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./../../axios";

export const fetchReviewsCoach = createAsyncThunk(
  "fetch/reviews/coach",
  async (id) => {
    const { data } = await axios.get(`/api/review/coach/${id}`);
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsCoach.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchReviewsCoach.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchReviewsCoach.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });
  },
});

export const reviewReducer = reviewSlice.reducer;

export const selectReviewsCoach = (state) => state.review.data;
