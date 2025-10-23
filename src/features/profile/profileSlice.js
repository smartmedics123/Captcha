import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    firstName: '',
    lastName: '',
    address: '',
    primaryEmail: '',
    secondaryEmail: '',
    primaryPhone: '',
    secondaryPhone: '',
  },
  reducers: {
    setProfileData: (state, action) => {
      return { ...state, ...action.payload }; // Update all profile data
    },
    clearProfileData: () => {
      return {
        firstName: '',
        lastName: '',
        address: '',
        primaryEmail: '',
        secondaryEmail: '',
        primaryPhone: '',
        secondaryPhone: '',
      };
    },
  },
});

export const { setProfileData, clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;
