import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { testAuth as testAuthApi } from "./authApi";
import { AuthState } from "./authTypes";

// New thunk to test authentication
export const testAuthThunk = createAsyncThunk(
  "auth/testAuth",
  async (_, { rejectWithValue }) => {
    try {
      await testAuthApi({ showSuccessMessage: false, showErrorMessage: false });
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(testAuthThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testAuthThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(testAuthThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
