// file: src/services/supportService.js

import axios from "axios";

// Apne backend ka base URL .env file se lein
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Customer support form ka data backend ko submit karta hai.
 * @param {object} formData - Form ka data (name, email, phone, order, message).
 * @returns {Promise<object>} Server se anay wala response.
 */
export const submitSupportForm = async (formData) => {
  try {
    // Backend API endpoint
    const endpoint = `${API_BASE_URL}/customerSupport/submit`;

    // Data ko JSON format mein POST request ke zariye bhejein
    // Axios object ko by default 'application/json' ke tor par bhejta hai
    const response = await axios.post(endpoint, formData, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    // Error ko console mein log karein aur aage component mein handle karne ke liye throw karein
    console.error("Error submitting support form:", error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    // Backend API endpoint
    const endpoint = `${API_BASE_URL}/contactForm/submit`;

    // Data ko JSON format mein POST request ke zariye bhejein
    // Axios object ko by default 'application/json' ke tor par bhejta hai
    const response = await axios.post(endpoint, formData, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    // Error ko console mein log karein aur aage component mein handle karne ke liye throw karein
    console.error("Error submitting support form:", error);
    throw error;
  }
};