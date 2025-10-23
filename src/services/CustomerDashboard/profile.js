import axios from 'axios';
import { getCustomerId } from '../../utils/CustomerId';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCustomerProfile = async () => {
  try {
    // Try to get customerNumber first (like NotificationContext does)
    let customerIdOrNumber = sessionStorage.getItem('customerNumber') || 
                           localStorage.getItem('customerNumber') ||
                           getCustomerId();
    
    console.log('👤 Profile: Using customer identifier:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required for profile');
    }
    
    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    let requestBody;
    if (isNumeric) {
      // It's a numeric customerId
      requestBody = { customerId: Number(customerIdOrNumber) };
      console.log('👤 Using numeric customerId:', Number(customerIdOrNumber));
    } else {
      // It's a customerNumber string (like "WA-1")
      requestBody = { customerNumber: customerIdOrNumber };
      console.log('👤 Using customerNumber:', customerIdOrNumber);
    }
    
    const res = await axios.post(`${API_BASE_URL}/customer/customer-profile`, requestBody, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    });
    return res.data?.data || {};
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    throw error;
  }
};

// Update customer profile
export const updateCustomerProfile = async (formData) => {
  const customerId = Number(getCustomerId());
  const formDataObj = new FormData();
  formDataObj.append('customerId', customerId);
  for (const [key, value] of Object.entries(formData)) {
    formDataObj.append(key, value);
  }
  const res = await axios.post(`${API_BASE_URL}/customer/profile-store`, formDataObj, {
    headers: { 
      'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      'Content-Type': 'multipart/form-data' 
    },
  });
  return res.data;
};
