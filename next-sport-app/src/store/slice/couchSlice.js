import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./../../axios";

export const fetchCouch = createAsyncThunk("fetch/couch", async () => {
  const { data } = await axios.get("/api/coaches");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const couchSlice = createSlice({
  name: "couch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouch.pending, (state) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(fetchCouch.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchCouch.rejected, (state) => {
        state.status = "success";
        state.data = null;
      });
  },
});

export const selectAllCouch = (state) => state.couch.data;

export const couchReducer = couchSlice.reducer;
