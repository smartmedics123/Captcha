import axios from 'axios';
import { getCustomerId } from '../../utils/CustomerId';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// -------------------------------------------------------------------------------------------------------
//                                    fetchRecipientOrders
// -----------------------------------------------------------------------------------------------------
// recipientId: number, page: number
export const fetchRecipientOrders = async (recipientId, page = 1) => {
  const response = await axios.get(`${API_BASE_URL}/recipient-orders/${recipientId}?page=${page}`, {
    headers: {
      'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
    },
  });
  // Expected response: { orders: [...], recipientName: '', totalPages: n }
  return response.data;
};

// -------------------------------------------------------------------------------------------------------
//                                    fetchrecipients (DEPRECATED - use recipients() instead)
// -----------------------------------------------------------------------------------------------------
export const fetchRecipients = async (customerId) => {
  console.warn('⚠️ fetchRecipients is deprecated, use recipients() instead');
  // Redirect to the new function
  return recipients();
};

export const recipients = async () => {
  // Try to get customerNumber first (like NotificationContext does)
  let customerIdOrNumber = sessionStorage.getItem('customerNumber') || 
                         localStorage.getItem('customerNumber') ||
                         getCustomerId();

  if (!customerIdOrNumber) {
    throw new Error('Customer identification is required');
  }
  
  console.log('🧾 ReceiptProfile: Using customer identifier:', customerIdOrNumber);
  
  try {
    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    let requestBody;
    if (isNumeric) {
      // It's a numeric customerId
      requestBody = { customerId: Number(customerIdOrNumber) };
      console.log('🧾 Using numeric customerId:', Number(customerIdOrNumber));
    } else {
      // It's a customerNumber string (like "WA-1")
      requestBody = { customerNumber: customerIdOrNumber };
      console.log('🧾 Using customerNumber:', customerIdOrNumber);
    }
    
    // Send a POST request with the appropriate identifier
    const response = await axios.post(`${API_BASE_URL}/customer/customer-recipients`,
      requestBody, // Request body containing customerId or customerNumber
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          'Content-Type': 'application/json' // Set content type to JSON
        }
      }
    );

    //   console.log('Customer Data Response:', response);
    return response.data; // Assuming response.data contains the customer details
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
};
// -------------------------------------------------------------------------------------------------------
//                                    updaterecipients
// -----------------------------------------------------------------------------------------------------
export const updaterecipients = async (recipientData) => {
  const customerId = getCustomerId();

  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-recipient`,
      {
        ...recipientData, // Include recipient data to update
        customerId, // Include customer ID
      },
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          'Content-Type': 'application/json', // Set content type to JSON
        },
      }
    );
    return response.data; // Return updated recipient data
  } catch (error) {
    console.error('Error updating recipient data:', error);
    throw error;
  }
};

// -------------------------------------------------------------------------------------------------------
//                                    Deleteecipients
// -----------------------------------------------------------------------------------------------------
export const deleteRecipient = async (id) => {
  const customerId = getCustomerId();

  try {
    const response = await axios.delete(`${API_BASE_URL}/customer/delete-recipient/${id}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error deleting recipient:', error);
    throw error; // Re-throw error for further handling
  }
};


