"use client";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface FetchCategoriesParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface Category {
  id: string;
  title: string;
  image: string;
  typeId: string;
  productCount: number;
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ searchTerm, page, limit, sort }: FetchCategoriesParams) => {
    const response = await axios.get('/api/categories/list-categories', {
      params: {
        search: searchTerm,
        page,
        limit,
        sort,
      },
    });

    return {
      categories: response.data.categories.map((category: Category) => ({
        ...category,
        categoryCount: category.productCount || 0,
      })),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
      sort
    };
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ title, image, typeId }: { title: string; image: string; typeId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/categories/add-category', {
        title,
        image,
        typeId,
      });
      if (response.status >= 400) {
        throw new Error('Failed to add the category');
      }
      return { ...response.data.category, productCount: 0 };
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

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, title, image, typeId }: { categoryId: string; title: string; image: string; typeId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/categories/update-category/${categoryId}`, {
        title,
        image,
        typeId,
      });
      if (response.status >= 400) {
        throw new Error('Failed to update the category');
      }
      return { categoryId, title, image, typeId };
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

export const fetchCategoryDetails = createAsyncThunk(
  'categories/fetchCategoryDetails',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/categories/category-details/${categoryId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch category details');
      }
      return { ...response.data.category, countProduct: response.data.category.countProduct || 0 };
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

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/categories/delete-category/${categoryId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the category');
      }
      return categoryId;
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

export const fetchCategoryTypes = createAsyncThunk(
  'categories/fetchCategoryTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/types/list-types');
      return response.data.types;
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

// Delete multiple categories
export const deleteMultiCategories = createAsyncThunk(
  'categories/deleteMultiCategories',
  async (categoryIds: string[], { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/categories/delete-multi-categories', {
        data: { ids: categoryIds },
      });
      console.log("From the slice : ", categoryIds)
      if (response.status !== 200) {
        throw new Error('Failed to delete categories');
      }
      return categoryIds; // Return the deleted IDs
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


interface CategoryType {
  id: string; 
  title: string;
}

interface Category {
  id: string;
  title: string;
  image: string;
  typeId: string; 
  countProduct: number;
}

interface CategoriesState {
  categories: Category[];
  types: CategoryType[]; 
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
  total: number;   
  page: number;    
  limit: number;   
  totalPages: number;
  sort: string | null;
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
  total: 0,
  page: 1,
  limit: 10,        
  totalPages: 0,    
  sort: null
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
        state.loading = false;
        state.categories = action.payload.categories;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
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
        state.categories.push(action.payload);
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
        const existingCategory = state.categories.find((category) => category.title === categoryId);
        if (existingCategory) {
          existingCategory.title = title;
          existingCategory.image = image;
          existingCategory.typeId = typeId;
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
        state.currentCategory = action.payload;
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
        state.categories = state.categories.filter(category => category.title !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      })
      .addCase(fetchCategoryTypes.pending, (state) => {
        state.loading_types = true;
        state.error_types = null;
      })
      .addCase(fetchCategoryTypes.fulfilled, (state, action) => {
        state.loading_types = false;
        state.types = action.payload;
      })
      .addCase(fetchCategoryTypes.rejected, (state, action) => {
        state.loading_types = false;
        state.error_types = action.payload as string;
      })
      .addCase(deleteMultiCategories.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteMultiCategories.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => !action.payload.includes(category.id));
        state.loading_delete = false;
      })
      .addCase(deleteMultiCategories.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;