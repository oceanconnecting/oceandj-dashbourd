"use client";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface FetchBrandsParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface Brand {
  id: number;
  title: string;
  image: string;
  productCount: number;
}

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async ({ searchTerm, page, limit, sort }: FetchBrandsParams) => {
    const response = await axios.get('/api/brands/list-brands', {
      params: {
        search: searchTerm,
        page,
        limit,
        sort,
      },
    });

    return {
      brands: response.data.brands.map((brand: Brand) => ({
        ...brand,
        productCount: brand.productCount || 0,
      })),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
      sort
    };
  }
);

// Add a brand
export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async ({ title, image }: { title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/brands/add-brand', {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to add the brand');
      }
      return { ...response.data.brand, productCount: 0 }; // Initialize productCount to 0
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

// Update a brand
export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ brandId, title, image }: { brandId: number; title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/brands/update-brand/${brandId}`, {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to update the brand');
      }
      return { brandId, title, image };
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

export const fetchBrandDetails = createAsyncThunk(
  'brands/fetchBrandDetails',
  async (brandId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/brands/brand-details/${brandId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch brand details');
      }
      return response.data.brand;
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


// Delete a brand
export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (brandId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/brands/delete-brand/${brandId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the brand');
      }
      return brandId;
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

// Delete multiple brands
export const deleteMultiBrands = createAsyncThunk(
  'brands/deleteMultiBrands',
  async (brandIds: number[], { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/brands/delete-multi-brands', {
        data: { ids: brandIds }, // Send the array of IDs in the request body
      });
      console.log("From the slice : ", brandIds)
      if (response.status !== 200) {
        throw new Error('Failed to delete brands');
      }
      return brandIds; // Return the deleted IDs
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
interface Brand {
  id: number;
  title: string;
  image: string;
  productCount: number;
}

interface BrandsState {
  brands: Brand[];
  currentBrand: Brand | null;
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
  total: number;        // Total number of brands
  page: number;         // Current page number
  limit: number;        // Limit of items per page
  totalPages: number;   // Total number of pages
  sort: string | null;
}

const initialState: BrandsState = {
  brands: [],
  currentBrand: null,
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
  total: 0,             // Initial total
  page: 1,              // Initial current page
  limit: 10,            // Initial limit
  totalPages: 0,        // Initial total pages
  sort: null
};


const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brands';
      })
      .addCase(addBrand.pending, (state) => {
        state.loading_add = true;
        state.error_add = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
        state.loading_add = false;
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading_add = false;
        state.error_add = action.payload as string;
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading_update = true;
        state.error_update = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const { brandId, title, image } = action.payload;
        const existingBrand = state.brands.find((brand) => brand.id === brandId);
        if (existingBrand) {
          existingBrand.title = title;
          existingBrand.image = image;
        }
        state.loading_update = false;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading_update = false;
        state.error_update = action.payload as string;
      })
      .addCase(fetchBrandDetails.pending, (state) => {
        state.loading_details = true;
        state.error_details = null;
      })
      .addCase(fetchBrandDetails.fulfilled, (state, action) => {
        state.currentBrand = action.payload;
        state.loading_details = false;
      })
      .addCase(fetchBrandDetails.rejected, (state, action) => {
        state.loading_details = false;
        state.error_details = action.payload as string;
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      })
      .addCase(deleteMultiBrands.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteMultiBrands.fulfilled, (state, action) => {
        state.brands = state.brands.filter(brand => !action.payload.includes(brand.id));
        state.loading_delete = false;
      })
      .addCase(deleteMultiBrands.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      });
  },
});

export default brandsSlice.reducer;
