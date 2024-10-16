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

interface FetchProductsParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ searchTerm, page, limit, sort }: FetchProductsParams) => {
    const response = await axios.get('/api/products/list-products', {
      params: {
        search: searchTerm,
        page,
        limit,
        sort,
      },
    });

    return {
      products: response.data.products.map((product: Product) => ({
        ...product
      })),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
      sort
    };
  }
);

export const addProducts = createAsyncThunk(
  'products/addProducts',
  async (productData: Product, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ success: boolean; products: Product }>(
        '/api/products/add-product',
        productData
      );

      if (response.status >= 400) {
        console.error('Failed to add the product');
      }

      return response.data.products;
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

export const fetchProductsCategories = createAsyncThunk(
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
  loading: boolean;
  error: string | null;
  loading_add: boolean;
  error_add: string | null;
  categories: { id: number; title: string }[]; 
  loadingCategories: boolean;
  errorCategories: string | null;
  total: number;    
  page: number;     
  limit: number;    
  totalPages: number;
  sort: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading_add: false,
  error_add: null,
  loading: false,
  error: null,
  categories: [], 
  loadingCategories: false,
  errorCategories: null,
  total: 0,
  page: 1,      
  limit: 10,    
  totalPages: 0,
  sort: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addProducts.pending, (state) => {
        state.loading_add = true;
        state.error_add = null;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading_add = false;
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.loading_add = false;
        state.error_add = action.payload as string;
      })
      .addCase(fetchProductsCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategories = null;
      })
      .addCase(fetchProductsCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchProductsCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategories = action.payload as string;
      });
  },
});

export default productsSlice.reducer;