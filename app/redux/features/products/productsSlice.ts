/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface FetchProductsParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface Product {
  category: any;
  id: number;
  title: string;
  images: string[];
  categoryId: number;
  description: string;
  price: number;
  discount: number;
  stock: number;
  orderCount: number;
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

    const productsData = response.data || {};
    const products = productsData.products || [];
    const total = productsData.total || 0;
    const totalPages = productsData.totalPages || 1;
    const currentPage = productsData.page || 1;

    return {
      products,
      total,
      page: currentPage,
      limit,
      totalPages,
      sort,
    };
  }
);


export const addProduct = createAsyncThunk(
  'products/addProduct',
  async ({title, images, categoryId, description, price, discount, stock}: { 
    title: string;
    images: string[];
    categoryId: number;
    description: string;
    price: number;
    discount: number;
    stock: number
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/products/add-product', {
        title,
        images,
        categoryId,
        description,
        price,
        discount,
        stock,
      });

      if (response.status >= 400) {
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

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productData: Product, { rejectWithValue }) => {
    try {
      const response = await axios.put<{ success: boolean; product: Product }>(
        '/api/products/update-product',
        productData
      );

      if (response.status >= 400) {
        throw new Error('Failed to update the product');
      }

      return  { ...response.data.product, countOrder: 0 };
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

// export const fetchProductsCategories = createAsyncThunk(
//   'products/fetchCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get<{ success: boolean; categories: { id: number; title: string }[] }>(
//         '/api/categories/list-categories'
//       );

//       if (response.status < 200 || response.status >= 300) {
//         throw new Error('Failed to fetch categories');
//       }

//       return response.data.categories;
//     } catch (error) {
//       console.error('Error:', error);
//       if (axios.isAxiosError(error)) {
//         const errorMessage = error.response?.data?.message || 'Something went wrong';
//         return rejectWithValue(errorMessage);
//       } else {
//         return rejectWithValue('An unexpected error occurred');
//       }
//     }
//   }
// );

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/product-details/${productId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch product details');
      }
      return response.data.product;
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

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/products/delete-product/${productId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the product');
      }
      return productId;
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

export const deleteMultiProducts = createAsyncThunk(
  'products/deleteMultiProducts',
  async (productIds: number[], { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/products/delete-multi-products', {
        data: { ids: productIds },
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete products');
      }
      return productIds;
    } catch (error) {
      console.error("Error:", error);
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

export const fetchProductCategories = createAsyncThunk(
  'products/fetchProductCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/categories/list-categories');
      return response.data.categories;
    } catch (error) {
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

export const fetchTopProducts = createAsyncThunk(
  'products/fetchTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/top-products');

      if (response.status >= 400) {
        throw new Error('Failed to fetch top products');
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

interface ProductCategory {
  id: number; 
  title: string;
}

interface ProductsState {
  products: Product[];
  categories: ProductCategory[]; 
  loadingCategories: boolean;
  errorCategories: string | null;
  loading: boolean;
  loading_details: boolean;
  loading_add: boolean;
  loading_update: boolean;
  loading_delete: boolean;
  error: string | null;
  error_details: string | null;
  error_add: string | null;
  error_update: string | null;
  error_delete: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort: string | null;
  currentProduct?: Product;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  loadingCategories: false,
  errorCategories: null,
  loading: false,
  loading_details: false,
  loading_add: false,
  loading_update: false,
  loading_delete: false,
  error: null,
  error_details: null,
  error_add: null,
  error_update: null,
  error_delete: null,
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
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? initialState.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Products';
      })
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
      .addCase(updateProduct.pending, (state) => {
        state.loading_update = true;
        state.error_update = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const existingProductIndex = state.products.findIndex((product) => product.id === updatedProduct.id);
        if (existingProductIndex >= 0) {
          state.products[existingProductIndex] = updatedProduct;
        }
        state.loading_update = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading_update = false;
        state.error_update = action.payload as string;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading_details = true;
        state.error_details = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.loading_details = false;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading_details = false;
        state.error_details = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      })
      .addCase(deleteMultiProducts.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteMultiProducts.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => !action.payload.includes(product.id));
        state.loading_delete = false;
      })
      .addCase(deleteMultiProducts.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
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
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
