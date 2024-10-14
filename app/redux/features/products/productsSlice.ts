import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  images: string[];
  categoryId: number;
  description: string;
  price: number;
  discount: number;
  stock: number;
}

interface AddProductParams {
  title: string;
  images: string[];
  categoryId: number;
  description: string;
  price: number;
  discount?: number;
  stock: number;
}

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData: AddProductParams, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ success: boolean; product: Product }>(
        '/api/products/add-product',
        productData
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to add the product');
      }

      return response.data.product;
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const fetchProductCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ success: boolean; categories: { id: number; title: string }[] }>(
        '/api/categories/list-categories'
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to fetch categories');
      }

      return response.data.categories;
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

interface ProductsState {
  products: Product[];
  loading_add: boolean;
  error_add: string | null;
  categories: { id: number; title: string }[]; 
  loadingCategories: boolean;
  errorCategories: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading_add: false,
  error_add: null,
  categories: [], 
  loadingCategories: false,
  errorCategories: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading_add = true;
        state.error_add = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading_add = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading_add = false;
        state.error_add = action.payload as string;
      })
      .addCase(fetchProductCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategories = null;
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategories = action.payload as string;
      });
  },
});

export default productsSlice.reducer;