import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/api/auth/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/api/auth/me");
  return data;
});

export const fetchAuthRegister = createAsyncThunk(
  "auth/fetchAuthRegister",
  async (params) => {
    const { data } = await axios.post("/api/auth/register", params);
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });

    builder
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });

    builder
      .addCase(fetchAuthRegister.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuthRegister.fulfilled, (state, action) => {
        state.status = "loaded";
      })
      .addCase(fetchAuthRegister.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logOut } = authSlice.actions;
