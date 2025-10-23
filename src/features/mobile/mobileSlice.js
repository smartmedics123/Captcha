import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobile: '',
};

const mobileSlice = createSlice({
  name: 'mobile',
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action.payload; // Save mobile to state
    },
    clearMobile: (state) => {
      state.mobile = ''; // Clear mobile state
      sessionStorage.removeItem('persist:mobile'); // Remove mobile from sessionStorage
    },
  },
});

export const { setMobile, clearMobile } = mobileSlice.actions;
export default mobileSlice.reducer;
