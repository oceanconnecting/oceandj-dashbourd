"use client";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface FetchTypesParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface Type {
  id: string;
  title: string;
  image: string;
  categoryCount: number;
}

export const fetchTypes = createAsyncThunk(
  'types/fetchTypes',
  async ({ searchTerm, page, limit, sort }: FetchTypesParams) => {
    const response = await axios.get('/api/types/list-types', {
      params: {
        search: searchTerm,
        page,
        limit,
        sort,
      },
    });

    return {
      types: response.data.types.map((type: Type) => ({
        ...type,
        categoryCount: type.categoryCount || 0,
      })),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
      sort
    };
  }
);

// Add a type
export const addType = createAsyncThunk(
  'types/addType',
  async ({ title, image }: { title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/types/add-type', {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to add the type');
      }
      return { ...response.data.type, categoryCount: 0 }; // Initialize categoryCount to 0
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

// Update a type
export const updateType = createAsyncThunk(
  'types/updateType',
  async ({ typeId, title, image }: { typeId: string; title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/types/update-type/${typeId}`, {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to update the type');
      }
      return { typeId, title, image };
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

export const fetchTypeDetails = createAsyncThunk(
  'types/fetchTypeDetails',
  async (typeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/types/type-details/${typeId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch type details');
      }
      return response.data.type;
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


// Delete a type
export const deleteType = createAsyncThunk(
  'types/deleteType',
  async (typeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/types/delete-type/${typeId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the type');
      }
      return typeId;
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

// Delete multiple types
export const deleteMultiTypes = createAsyncThunk(
  'types/deleteMultiTypes',
  async (typeIds: string[], { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/types/delete-multi-types', {
        data: { ids: typeIds }, // Send the array of IDs in the request body
      });
      console.log("From the slice : ", typeIds)
      if (response.status !== 200) {
        throw new Error('Failed to delete types');
      }
      return typeIds; // Return the deleted IDs
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
interface Type {
  id: string;
  title: string;
  image: string;
  categoryCount: number;
  productCount: number;
}

interface TypesState {
  types: Type[];
  currentType: Type | null;
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
  total: number;        // Total number of types
  page: number;         // Current page number
  limit: number;        // Limit of items per page
  totalPages: number;   // Total number of pages
  sort: string | null;
}

const initialState: TypesState = {
  types: [],
  currentType: null,
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


const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload.types;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.sort = action.payload.sort ?? null;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch types';
      })
      .addCase(addType.pending, (state) => {
        state.loading_add = true;
        state.error_add = null;
      })
      .addCase(addType.fulfilled, (state, action) => {
        state.types.push(action.payload);
        state.loading_add = false;
      })
      .addCase(addType.rejected, (state, action) => {
        state.loading_add = false;
        state.error_add = action.payload as string;
      })
      .addCase(updateType.pending, (state) => {
        state.loading_update = true;
        state.error_update = null;
      })
      .addCase(updateType.fulfilled, (state, action) => {
        const { typeId, title, image } = action.payload;
        const existingType = state.types.find((type) => type.title === typeId);
        if (existingType) {
          existingType.title = title;
          existingType.image = image;
        }
        state.loading_update = false;
      })
      .addCase(updateType.rejected, (state, action) => {
        state.loading_update = false;
        state.error_update = action.payload as string;
      })
      .addCase(fetchTypeDetails.pending, (state) => {
        state.loading_details = true;
        state.error_details = null;
      })
      .addCase(fetchTypeDetails.fulfilled, (state, action) => {
        state.currentType = action.payload;
        state.loading_details = false;
      })
      .addCase(fetchTypeDetails.rejected, (state, action) => {
        state.loading_details = false;
        state.error_details = action.payload as string;
      })
      .addCase(deleteType.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteType.fulfilled, (state, action) => {
        state.types = state.types.filter(type => type.title !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteType.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      })
      .addCase(deleteMultiTypes.pending, (state) => {
        state.loading_delete = true;
        state.error_delete = null;
      })
      .addCase(deleteMultiTypes.fulfilled, (state, action) => {
        state.types = state.types.filter(type => !action.payload.includes(type.id));
        state.loading_delete = false;
      })
      .addCase(deleteMultiTypes.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      });
  },
});

export default typesSlice.reducer;
