import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductImageState {
  image: string | null;
  image1: string | null;
  image2: string | null;
  video: string | null;
}

const initialState: ProductImageState = {
  image: null,
  image1: null,
  image2: null,
  video: null,
};

const productImageSlice = createSlice({
  name: "productMedia",
  initialState,
  reducers: {
    setProductMedia: (state, action: PayloadAction<Partial<ProductImageState>>) => {
      Object.assign(state, action.payload);
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