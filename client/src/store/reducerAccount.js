import { createSlice } from "@reduxjs/toolkit";

const accountState = {
  isLogin: false,
  user: {},
};

const accountSlice = createSlice({
  name: "account",
  initialState: accountState,
  reducers: {
    ON_LOGIN(state, action) {
      state.isLogin = true;
      state.user = action.payload;
    },
    ON_LOGOUT(state) {
      state.isLogin = false;
      state.user = {};
    },
  },
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
