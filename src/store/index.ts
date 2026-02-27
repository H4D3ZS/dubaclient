import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import contentReducer from './contentSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        content: contentReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
