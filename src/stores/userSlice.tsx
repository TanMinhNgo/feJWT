import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  user: null;
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || action.payload.access_token || null;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;
    },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    }
  },
});

export const { setUser, clearUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
