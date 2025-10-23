import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload; // Save email to state
    },
    clearEmail: (state) => {
      state.email = ''; // Clear email state
      sessionStorage.removeItem('persist:Call1'); // Remove email from sessionStorage
    },
  },
});

export const { setEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
