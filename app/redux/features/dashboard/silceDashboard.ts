// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface Product {
//   category: any;
//   id: number;
//   title: string;
//   images: string[];
//   categoryId: number;
//   description: string;
//   price: number;
//   discount: number;
//   stock: number;
//   orderCount: number;
// }

// interface ProductState {
//   products: Product[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProductState = {
//   products: [],
//   loading: false,
//   error: null,
// };

// export const fetchTopProducts = createAsyncThunk(
//   'products/fetchTopProducts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/products/top');
//       return response.data.products;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data.message || 'Failed to fetch top products');
//     }
//   }
// );

// const productsSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTopProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopProducts.fulfilled, (state, action) => {
//         state.products = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTopProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default productsSlice.reducer;
