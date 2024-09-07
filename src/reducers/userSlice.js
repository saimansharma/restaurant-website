import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const initialState = {
  isAuthenticated: false,
  email: "",
  username: "",
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addEmail: (state, action) => {
      state.email = action.payload;
    },
    removeEmail: (state) => {
       state.email = "";
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      Cookies.set('isAuthenticated', 'true', { expires: 1 }); // Expires in 1 days
      Cookies.set('username', action.payload.username, { expires: 1 });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      Cookies.remove('isAuthenticated');
      Cookies.remove('username');
    },
    },
  },
);

export const {
  addEmail, 
  removeEmail,
  setAuthentication,
  logout,
} = userSlice.actions

export default userSlice.reducer;
