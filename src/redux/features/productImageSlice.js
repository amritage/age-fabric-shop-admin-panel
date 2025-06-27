import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: null,
  image1: null,
  image2: null,
  video: null,
};

const productImageSlice = createSlice({
  name: 'productMedia',
  initialState,
  reducers: {
    setProductMedia: (state, action) => {
      state.image = action.payload.image;
      state.image1 = action.payload.image1;
      state.image2 = action.payload.image2;
      state.video = action.payload.video;
    },
    clearProductMedia: (state) => {
      state.image = null;
      state.image1 = null;
      state.image2 = null;
      state.video = null;
    },
  },
});

export const { setProductMedia, clearProductMedia } = productImageSlice.actions;
export default productImageSlice.reducer; 