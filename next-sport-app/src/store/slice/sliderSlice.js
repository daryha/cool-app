import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSlide: 0,
};

export const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    nextSlide: (state, action) => {
      state.currentSlide = action.payload;
    },
  },
});

export const { nextSlide } = sliderSlice.actions;
export default sliderSlice.reducer;
