import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productItem: null,
  isModalOpen:false,
};

export const productModalSlice = createSlice({
  name: "productModal",
  initialState,
  reducers: {
    handleProductModal: (state, { payload }) => {
      state.productItem = payload;
      state.isModalOpen = true;
    },
    // eslint-disable-next-line no-unused-vars
    handleModalClose:(state,{ payload: _payload }) => {
      state.isModalOpen = false;
      state.productItem = null;
    }
  },
});

export const { handleProductModal,handleModalClose } = productModalSlice.actions;
export default productModalSlice.reducer;
