import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // Use sessionStorage
import cartReducer from "../features/cart/cartSlice";
import emailReducer from "../features/email/emailSlice"; // Email slice
import mobileReducer from "../features/mobile/mobileSlice"; // Mobile slice
import { encryptTransform } from "redux-persist-transform-encrypt";
import profileReducer from "../features/profile/profileSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import prescriptionReducer from "../features/prescriptionManagement/prescriptionSlice";
// Config for persisting email state
const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_SECRET_KEY, // Use the secure key from .env file
  onError: (error) => {
    console.error("Encryption Error:", error);
  },
});

const emailPersistConfig = {
  key: "Call1",
  storage: sessionStorage, // Use sessionStorage instead of localStorage
  transforms: [encryptor],
};

// Config for persisting mobile state
const mobilePersistConfig = {
  key: "mobile",
  storage: sessionStorage,
  transforms: [encryptor],
};

// Persisted reducers
const persistedEmailReducer = persistReducer(emailPersistConfig, emailReducer);
const persistedMobileReducer = persistReducer(mobilePersistConfig, mobileReducer);

const store = configureStore({
  reducer: {
    cart: cartReducer, // Cart state
    email: persistedEmailReducer, // Persisted email state
    mobile: persistedMobileReducer, // Persisted mobile state
    profile: profileReducer,
    wishlist: wishlistReducer,
    prescription: prescriptionReducer
  },
});

const persistor = persistStore(store); // Create persistor for Redux Persist

// Export both store and persistor
export { store, persistor };

// Default export for store
export default store;
