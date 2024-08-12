import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: string;
  username?: string;
  name?: string;
}

interface SessionState {
  user: User | null;
}

const initialState: SessionState = {
  user: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearSession: (state) => {
      state.user = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
