// src/services/api.js

import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitOrder = async (orderData) => {
  try {
    // Get customerNumber (new) or fallback to the customerId from orderData (old)
    const customerNumber = sessionStorage.getItem("customerNumber") || 
                          sessionStorage.getItem("customerId") || 
                          orderData.customerId;

    // Add orderType and customerNumber for unified API
    const unifiedOrderData = {
      ...orderData,
      orderType: "nonsorted", // ✅ Required for unified API
      customerNumber: customerNumber // ✅ Use customerNumber instead of customerId
    };

    // Remove old customerId field to avoid confusion
    delete unifiedOrderData.customerId;

    const response = await axios.post(`${API_BASE_URL}/orders/submit`, unifiedOrderData, {  headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }});
    // const response = await axios.post(`${API_BASE_URL}/orders/submit`, unifiedOrderData); // ✅ Updated to unified endpoint
    console.log(response.orderData);
    console.log(response);

    console.log(response.data.orderId);

    return response.data;
  } catch (error) {
    if (error.response) {
      // // The request was made, but the server responded with a status code that falls out of the range of 2xx
      // console.error('Error response data:', error.response.data);
      // console.error('Error response status:', error.response.status);
      // console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      // console.error('Error request:', error.request)
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', error.message);
    }
    throw error;
  }
};
