import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedOrder: null,
  isEdited: false,
};

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
      state.isEdited = false; // reset when new modal opens
    },
    updateOrderField: (state, action) => {
      const { key, value } = action.payload;
      if (state.selectedOrder && state.selectedOrder.presorted) {
        state.selectedOrder.presorted[key] = value;
        state.isEdited = true;
      }
    },
      updateItemQuantity: (state, action) => {
          const { index, quantity } = action.payload;
          if (state.selectedOrder?.order_detail?.[index]) {
              state.selectedOrder.order_detail[index].quantity = quantity;
              state.isEdited = true;
          }
      },
    resetPrescriptionState: () => initialState,
  },
});

export const { setSelectedOrder, updateOrderField, resetPrescriptionState, updateItemQuantity } =
  prescriptionSlice.actions;

export default prescriptionSlice.reducer;
