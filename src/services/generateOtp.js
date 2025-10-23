// src/services/apiService.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const generateOtp = async (email) => {
  const formData = new FormData();
  formData.append('email', email);

  try {
    const response = await axios.post(`${API_BASE_URL}/otp/generate`, {email}, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
     console.log('generateOtp Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};
// / Function to verify OTP
export const verifyOtp = async (email, otp) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);

  try {
    const response = await axios.post(`${API_BASE_URL}/otp/verify`, {  email, otp  }, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
    console.log('Customer Number:', response.data.customerNumber);
    const customerNumber = response.data.customerNumber;
    const customerId = response.data.customerId; // Keep for backward compatibility
    
    // Store both for transition period
    sessionStorage.setItem("customerNumber", customerNumber);
    sessionStorage.setItem("customerId", customerId);
    
    return response.data;
  } catch (error) {
    // console.error('Error verifying OTP:', error);
    throw error;
  } 
};

// UCHat WhatsApp OTP functions
export const generateUchatOtp = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uchat/generate-otp`, { phoneNumber }, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
    console.log('UCHat OTP Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating UCHat OTP:', error);
    throw error;
  }
};

export const verifyUchatOtp = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uchat/verify-otp`, { phoneNumber, otp }, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
    console.log('UCHat Verify Response:', response.data);
    
    // ✅ Extract customerNumber from response.data.data.customer
    const customerNumber = response.data.data?.customer?.customerNumber;
    console.log('UCHat Customer Number:', customerNumber);
    
    if (customerNumber) {
      // Store customerNumber for session management
      sessionStorage.setItem("customerNumber", customerNumber);
      // Keep customerId as null for UCHat users (they don't have internal DB ID in frontend)
      sessionStorage.setItem("customerId", customerNumber); // Use customerNumber as fallback
    }
    
    return response.data; // Return the actual response structure
  } catch (error) {
    console.error('Error verifying UCHat OTP:', error);
    throw error;
  }
};