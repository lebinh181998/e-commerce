import { createSlice } from "@reduxjs/toolkit";

const cartState = {
  listCart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartState,
  reducers: {
    ADD_CART(state, action) {
      const index = state.listCart.findIndex(
        (item) => item._id.$oid == action.payload._id.$oid
      );

      if (!state.listCart[index]) {
        state.listCart = [...state.listCart, action.payload];
      } else {
        state.listCart[index].quantity =
          state.listCart[index].quantity + action.payload.quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state.listCart));
    },

    UPDATE_CART(state, action) {
      const quantity =
        state.listCart[action.payload.index].quantity + action.payload.quantity;
      if (quantity >= 1) {
        state.listCart[action.payload.index].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.listCart));
      }
    },

    DELETE_CART(state, action) {
      state.listCart.splice(action.payload, 1);
      localStorage.setItem("cart", JSON.stringify(state.listCart));
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
