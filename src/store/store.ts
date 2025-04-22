import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    chat: chatReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 