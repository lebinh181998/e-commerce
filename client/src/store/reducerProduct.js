import { createSlice } from "@reduxjs/toolkit";

const productState = {
  isShow: false,
  product: {},
};
const productSlice = createSlice({
  name: "popup",
  initialState: productState,
  reducers: {
    SHOW_POPUP(state, action) {
      state.isShow = true;
      state.product = action.payload;
    },
    HIDE_POPUP(state) {
      state.isShow = false;
    },
  },
});

export const productActions = productSlice.actions;

export default productSlice.reducer;
