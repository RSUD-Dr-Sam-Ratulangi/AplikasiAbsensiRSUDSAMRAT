import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenExpired: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.tokenExpired = false;
      state.accessToken = action.payload.accessToken;
      Cookies.set("access_token", action.payload.accessToken);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      Cookies.remove("access_token");
      state.accessToken = null;
      state.tokenExpired = true;
    },
    expiredToken: (state) => {
      Cookies.remove("access_token");
      state.tokenExpired = true;
      state.isLoggedIn = false;
      state.accessToken = null;
    },
  },
});

export const { loginSuccess, logout, expiredToken } = authSlice.actions;

export default authSlice.reducer;
