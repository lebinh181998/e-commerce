import { configureStore } from "@reduxjs/toolkit";
import reducerProduct from "./reducerProduct";
import reducerAccount from "./reducerAccount";
import reducerCart from "./reducerCart";

const store = configureStore({
  reducer: {
    product: reducerProduct,
    account: reducerAccount,
    cart: reducerCart,
  },
});
export default store;
