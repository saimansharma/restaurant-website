import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';

import Cookies from 'js-cookie';

const isAuthenticated = Cookies.get('isAuthenticated') === 'true';
const username = Cookies.get('username') || '';

const preloadedState = {
  user: {
    isAuthenticated,
    username,
    email: '',
  },
};

export const store = configureStore({
    reducer: {
        user : userReducer,
    },
    preloadedState,
});
