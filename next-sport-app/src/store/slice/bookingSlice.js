import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchBooking = createAsyncThunk(
  "booking/fetchBooking",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/booking/mine");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка при загрузке бронирований"
      );
    }
  }
);

export const fetchAllBooking = createAsyncThunk(
  "booking/fetchAllBooking",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/booking");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка при загрузке бронирований"
      );
    }
  }
);



const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchAllBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectUserBookings = (state) => state.booking.bookings;
export const selectBookingLoading = (state) => state.booking.loading;
export const selectBookingError = (state) => state.booking.error;

export const selectAllBookings = (state) => state.booking.bookings;

export default bookingSlice.reducer;
