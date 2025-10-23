import axios from 'axios';
import { getCustomerId, getCustomerIdentifier } from '../../utils/CustomerId';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserProfile = async (formData) => {
  try {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('👤 UserProfile: Using customer identifier:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required for profile update');
    }
    
    // Prepare request body as JSON object
    const requestBody = { ...formData };

    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    if (isNumeric) {
      // It's a numeric customerId
      requestBody.customerId = Number(customerIdOrNumber);
      console.log('👤 Using numeric customerId for profile update:', Number(customerIdOrNumber));
    } else {
      // It's a customerNumber string (like "WA-1")
      requestBody.customerNumber = customerIdOrNumber;
      console.log('👤 Using customerNumber for profile update:', customerIdOrNumber);
    }

    console.log('👤 UserProfile Request Body:', requestBody);

    const response = await axios.post(`${API_BASE_URL}/customer/profile-store`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('👤 UserProfile Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting profile:', error);
    throw error;
  }
};

// Function to fetch customer data based on customer identifier
export const getCustomerData = async () => {
  try {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('👤 getCustomerData: Using customer identifier:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required');
    }
    
    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    let requestBody = {};
    if (isNumeric) {
      // It's a numeric customerId
      requestBody.customerId = Number(customerIdOrNumber);
      console.log('👤 Using numeric customerId for profile fetch:', Number(customerIdOrNumber));
    } else {
      // It's a customerNumber string (like "WA-1")
      requestBody.customerNumber = customerIdOrNumber;
      console.log('👤 Using customerNumber for profile fetch:', customerIdOrNumber);
    }

    // Send a POST request with the customer identifier
    const response = await axios.post(`${API_BASE_URL}/customer/customer-profile`, 
      requestBody, // Request body containing customerId or customerNumber
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('👤 Customer Data Response:', response.data);
    return response.data; // Assuming response.data contains the customer details
  } catch (error) {
    console.error('❌ Error fetching customer data:', error);
    throw error;
  }
};