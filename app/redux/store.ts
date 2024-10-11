"use client";

import { configureStore } from '@reduxjs/toolkit';
import typesReducer from "@/app/redux/features/types/typesSlice";
import categoriesReducer from "@/app/redux/features/categories/categoriesSlice";

const store = configureStore({
  reducer: {
    types: typesReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
