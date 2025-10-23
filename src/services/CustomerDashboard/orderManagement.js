import axios from "axios";
import { getCustomerId } from "../../utils/CustomerId";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchNonSortedOrder = async (order_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/view/${order_id}`,
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        },
      }
    );
    console.log("API Response For Unified Order:", response.data); // Log response for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error); // Log error for debugging
    // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
    throw error;
  }
};
