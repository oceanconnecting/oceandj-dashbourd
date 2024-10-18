"use client";

import { configureStore } from '@reduxjs/toolkit';
import typesReducer from "@/app/redux/features/types/typesSlice";
import categoriesReducer from "@/app/redux/features/categories/categoriesSlice";
import productsReducer from "@/app/redux/features/products/productsSlice";
import ordersReducer from "@/app/redux/features/orders/ordersSlice";

const store = configureStore({
  reducer: {
    types: typesReducer,
    categories: categoriesReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
