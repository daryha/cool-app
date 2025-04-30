import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./../../axios";

// Thunk для получения отзывов о тренерах
export const fetchReviewsCoach = createAsyncThunk(
  "fetch/reviews/coach",
  async (id) => {
    const { data } = await axios.get(`/api/review/coach/${id}`);
    return data;
  }
);

// Новый thunk для получения отзывов о спортивных объектах
export const fetchReviewsByFacility = createAsyncThunk(
  "fetch/reviews/facility",
  async (id) => {
    const { data } = await axios.get(`/api/review/facility/${id}`);
    return data;
  }
);

const initialState = {
  coachReviews: null,
  facilityReviews: null,
  status: "loading",
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Обработчики для отзывов о тренерах
      .addCase(fetchReviewsCoach.pending, (state) => {
        state.status = "loading";
        state.coachReviews = null;
      })
      .addCase(fetchReviewsCoach.fulfilled, (state, action) => {
        state.status = "loaded";
        state.coachReviews = action.payload;
      })
      .addCase(fetchReviewsCoach.rejected, (state) => {
        state.status = "error";
        state.coachReviews = null;
      })

      // Обработчики для отзывов о спортивных объектах
      .addCase(fetchReviewsByFacility.pending, (state) => {
        state.status = "loading";
        state.facilityReviews = null;
      })
      .addCase(fetchReviewsByFacility.fulfilled, (state, action) => {
        state.status = "loaded";
        state.facilityReviews = action.payload;
      })
      .addCase(fetchReviewsByFacility.rejected, (state) => {
        state.status = "error";
        state.facilityReviews = null;
      });
  },
});

export const reviewReducer = reviewSlice.reducer;

// Селекторы
export const selectReviewsCoach = (state) => state.review.coachReviews;
export const selectReviewsFacility = (state) => state.review.facilityReviews;
