// ProductService.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProductList = async () => {
  const res = await axios.get(`${API_BASE_URL}/products/product-list`, {
    headers: {
      'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
    }
  });
  console.log('Product List API Response:', res.data);
  return res.data?.data || [];
};
