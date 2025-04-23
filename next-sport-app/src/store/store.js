// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import arenaReducer from "./slice/arenaSlice";
import { authReducer } from "./slice/authSlice";
import { couchReducer } from "./slice/couchSlice";
import { reviewReducer } from "./../store/slice/reviewSlice";
import bookingReducer from "../store/slice/bookingSlice";

export const store = configureStore({
  reducer: {
    arenas: arenaReducer,
    auth: authReducer,
    couch: couchReducer,
    review: reviewReducer,
    booking: bookingReducer,
  },
});
