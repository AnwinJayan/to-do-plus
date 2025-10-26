import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserState } from "./userTypes";
import { fetchCurrentUser } from "./userApi";

const initialState: UserState = {
  _id: "",
  username: "",
  email: "",
  role: "",
  isSuspended: false,
  suspensionReason: null,
  imageUrl: null,
  createdAt: "",
  updatedAt: "",
  loading: false,
};

// Thunk to fetch current user
export const fetchUserThunk = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await fetchCurrentUser({ showErrorMessage: false });
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      Object.assign(state, initialState);
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        Object.assign(state, initialState);
        state.loading = false;
      })
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
