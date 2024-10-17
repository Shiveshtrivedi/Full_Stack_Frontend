import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
};

const adminLayoutSlice = createSlice({
  name: 'adminLayout',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleSidebar } = adminLayoutSlice.actions;
export default adminLayoutSlice.reducer;
