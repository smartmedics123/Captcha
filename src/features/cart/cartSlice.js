import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load initial cart state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load state", e);
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0
    };
  }
};

// Save the cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

const initialState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
  const item = action.payload;
  const { id, price, quantity } = item;
  const existingItem = state.items.find(item => item.id === id);
  const itemPrice = typeof price === "string" ? parseFloat(price.replace('Rs. ', '')) : Number(price);
  if (existingItem) {
    existingItem.quantity += quantity;
    state.totalAmount = Math.round(state.totalAmount + (itemPrice * quantity));
  } else {
    state.items.push({ ...item });
    state.totalItems += 1;
    state.totalAmount = Math.round(state.totalAmount + (itemPrice * quantity));
  }
  saveState(state);
  toast.success(`Product added to the cart`, { position: "bottom-left" });
},
removeItem: (state, action) => {
  const index = state.items.findIndex(item => item.id === action.payload.id);
  if (index !== -1) {
    const itemPrice = Number(state.items[index].price);
    state.totalAmount = Math.round(state.totalAmount - (itemPrice * state.items[index].quantity));
    state.items.splice(index, 1);
    state.totalItems -= 1;
    saveState(state);
    toast.success("Product removed from the cart", { position: "bottom-right" });
  }
},
increaseQuantity: (state, action) => {
  const item = state.items.find(item => item.id === action.payload.id);
  if (item) {
    item.quantity += 1;
    state.totalAmount = Math.round(state.totalAmount + Number(item.price));
    saveState(state);
  }
},
decreaseQuantity: (state, action) => {
  const item = state.items.find(item => item.id === action.payload.id);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    state.totalAmount = Math.round(state.totalAmount - Number(item.price));
    saveState(state);
  }
},
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      saveState(state); // Save the cleared state
      toast.success("Order Placed Sucessfully", { position: "bottom-left" });
    }
  }
});

// Export the new clearCart action along with the others
export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
