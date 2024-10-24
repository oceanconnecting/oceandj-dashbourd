"use client";

import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

interface FetchOrdersParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
interface Order {
  id: number;
  reference: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: {
    title: ReactNode; id: number; quantity: number 
}[];
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ searchTerm, page, limit, sort }: FetchOrdersParams) => {
    const response = await axios.get('/api/orders/list-orders', {
      params: {
        search: searchTerm,
        page,
        limit,
        sort,
      },
    });

    const ordersData = response.data || {};
    const orders = ordersData.orders || [];
    const total = ordersData.total || 0;
    const totalPages = ordersData.totalPages || 1;
    const currentPage = ordersData.page || 1;

    return {
      orders,
      total,
      page: currentPage,
      limit,
      totalPages,
      sort,
    };
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/orders/order-details/${orderId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch order details');
      }
      return response.data.order;
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
      } else {
        console.error('Unexpected Error:', error);
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/orders/delete-order/${orderId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the order');
      }
      return orderId;
    } catch (error) {
      console.error("Error : ", error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
      } else {
        console.error('Unexpected Error:', error);
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

interface OrdersState {
  orders: Order[];
  items: { id: number; title: string }[];
  loading: boolean;
  loading_details: boolean;
  loading_delete: boolean;
  error: string | null;
  error_details: string | null;
  error_delete: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort: string | null;
  currentOrder?: Order;
}

const initialState: OrdersState = {
  orders: [],
  items: [],
  loading: false,
  loading_details: false,
  loading_delete: false,
  error: null,
  error_details: null,
  error_delete: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  sort: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? initialState.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading_details = true;
        state.error_details = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading_details = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading_details = false;
        state.error_details = action.payload as string;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      });
  },
});

export default ordersSlice.reducer;
