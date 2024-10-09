"use client";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch categories including product count
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('http://localhost:3000/api/categories/list-categories');
  console.log(response.data.categories);
  // Return categories with countProduct included
  return response.data.categories.map(category => ({
    ...category,
    countProduct: category.countProduct || 0, // Default to 0 if countProduct is not provided
  }));
});

// Add a category
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ title, image, typeId }: { title: string; image: string; typeId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/categories/add-category', {
        title,
        image,
        typeId,
      });
      if (response.status >= 400) {
        throw new Error('Failed to add the category');
      }
      return { ...response.data.category, countProduct: 0 }; // Initialize countProduct to 0
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, title, image, typeId }: { categoryId: number; title: string; image: string; typeId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/categories/update-category/${categoryId}`, {
        title,
        image,
        typeId,
      });
      if (response.status >= 400) {
        throw new Error('Failed to update the category');
      }
      return { categoryId, title, image, typeId }; // Return the updated category details
    } catch (error) {
      console.error("Error : ", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch category details
export const fetchCategoryDetails = createAsyncThunk(
  'categories/fetchCategoryDetails',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/categories/category-details/${categoryId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch category details');
      }
      return { ...response.data.category, countProduct: response.data.category.countProduct || 0 }; // Ensure countProduct is included
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/categories/delete-category/${categoryId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the category');
      }
      return categoryId;
    } catch (error) {
      console.error("Error : ", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch category types from API
export const fetchCategoryTypes = createAsyncThunk(
  'categories/fetchCategoryTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/types/list-types');
      return response.data.types;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

interface Category {
  id: number;
  title: string;
  image: string;
  typeId: string;
  countProduct: number; // Ensure countProduct is included in the Category interface
}

interface CategoriesState {
  categories: [];
  types: [],
  currentCategory: Category | null;
  loading: boolean;
  loading_details: boolean;
  loading_add: boolean;
  loading_update: boolean;
  loading_delete: boolean;
  loading_types: boolean;
  error: string | null;
  error_details: string | null;
  error_add: string | null;
  error_update: string | null;
  error_delete: string | null;
  error_types: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  types: [],
  currentCategory: null,
  loading: false,
  loading_details: false,
  loading_add: false,
  loading_update: false,
  loading_delete: false,
  loading_types: false,
  error: null,
  error_details: null,
  error_add: null,
  error_update: null,
  error_delete: null,
  error_types: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload; // Categories now include countProduct
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.pending, (state) => {
        state.loading_add = true;
        state.error_add = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // countProduct is initialized to 0
        state.loading_add = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading_add = false;
        state.error_add = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading_update = true;
        state.error_update = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const { categoryId, title, image, typeId } = action.payload;
        const existingCategory = state.categories.find((category) => category.id === categoryId);
        if (existingCategory) {
          existingCategory.title = title;
          existingCategory.image = image;
          existingCategory.typeId = typeId;
          // countProduct does not change, so it's not updated here
        }
        state.loading_update = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading_update = false;
        state.error_update = action.payload as string;
      })
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.loading_details = true;
        state.error_details = null;
      })
      .addCase(fetchCategoryDetails.fulfilled, (state, action) => {
        state.currentCategory = action.payload; // countProduct included in details
        state.loading_details = false;
      })
      .addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.loading_details = false;
        state.error_details = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category.id !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      })
      .addCase(fetchCategoryTypes.pending, (state) => {
        state.loading_types = true;
      })
      .addCase(fetchCategoryTypes.fulfilled, (state, action) => {
        state.loading_types = false;
        state.types = action.payload;
      })
      .addCase(fetchCategoryTypes.rejected, (state, action) => {
        state.loading_types = false;
        state.error_types = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
