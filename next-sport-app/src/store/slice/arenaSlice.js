// src/redux/arenaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchArenas = createAsyncThunk(
  "arenas/fetchArenas",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/facilities");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const arenaSlice = createSlice({
  name: "arenas",
  initialState: {
    arenas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArenas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArenas.fulfilled, (state, action) => {
        state.loading = false;
        state.arenas = action.payload;
      })
      .addCase(fetchArenas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllArenas = (state) => state.arenas.arenas;
export const selectArenasLoading = (state) => state.arenas.loading;
export const selectArenasError = (state) => state.arenas.error;

export default arenaSlice.reducer;
