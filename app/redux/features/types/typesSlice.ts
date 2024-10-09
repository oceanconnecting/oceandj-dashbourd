"use client";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTypes = createAsyncThunk('types/fetchTypes', async (searchQuery) => {
  const response = await axios.get('http://localhost:3000/api/types/list-types', {
    params: {
      search: searchQuery,  // Add search query as a parameter
    },
  });
  
  console.log(response.data.types);
  return response.data.types.map(type => ({
    ...type,
    categoryCount: type.categoryCount || 0,
  }));
});

// Add a type
export const addType = createAsyncThunk(
  'types/addType',
  async ({ title, image }: { title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/types/add-type', {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to add the type');
      }
      return { ...response.data.type, categoryCount: 0 }; // Initialize categoryCount to 0
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update a type
export const updateType = createAsyncThunk(
  'types/updateType',
  async ({ typeId, title, image }: { typeId: number; title: string; image: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/types/update-type/${typeId}`, {
        title,
        image,
      });
      if (response.status >= 400) {
        throw new Error('Failed to update the type');
      }
      return { typeId, title, image }; // Return the updated type details
    } catch (error) {
      console.error("Error : ", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch type details
export const fetchTypeDetails = createAsyncThunk(
  'types/fetchTypeDetails',
  async (typeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/types/type-details/${typeId}`);
      if (response.status >= 400) {
        throw new Error('Failed to fetch type details');
      }
      return response.data.type; // Should now include categoryCount
    } catch (error) {
      console.error('Error:', error);
      return rejectWithValue(error.message);
    }
  }
);


// Delete a type
export const deleteType = createAsyncThunk(
  'types/deleteType',
  async (typeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/types/delete-type/${typeId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete the type');
      }
      return typeId;
    } catch (error) {
      console.error("Error : ", error);
      return rejectWithValue(error.message);
    }
  }
);

interface Type {
  id: number;
  title: string;
  image: string;
  categoryCount: number;
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
};

const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload;
        state.loading = false;
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
        const existingType = state.types.find((type) => type.id === typeId);
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
        state.types = state.types.filter(type => type.id !== action.payload);
        state.loading_delete = false;
      })
      .addCase(deleteType.rejected, (state, action) => {
        state.loading_delete = false;
        state.error_delete = action.payload as string;
      });
  },
});

export default typesSlice.reducer;
