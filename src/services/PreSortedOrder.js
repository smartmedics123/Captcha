// services/PreSortedOrder.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitOrderForm = async (data) => {
  const formData = new FormData();
  // Get customerNumber (new) or fallback to customerId (old)
  const customerNumber = sessionStorage.getItem("customerNumber") || sessionStorage.getItem("customerId");

  // Add customerNumber and orderType for unified API
  formData.append("customerNumber", customerNumber);
  formData.append("orderType", "presorted"); // ✅ Required for unified API

  // Append non-image, non-array fields
  for (let key in data) {
    if (key !== "images" && key !== "orderItems") {
      formData.append(key, data[key]);
    }
  }

  // ✅ Append orderItems correctly as JSON string
  if (data.orderItems && Array.isArray(data.orderItems)) {
    formData.append("orderItems", JSON.stringify(data.orderItems));
  }

  // ✅ Append image files
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/submit`, // ✅ Updated to unified endpoint
      formData,
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting presorted order:", error);
    throw error;
  }
};
