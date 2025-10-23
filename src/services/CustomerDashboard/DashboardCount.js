import axiosInstance from '../../utils/axiosInstance';
import { getCustomerId } from '../../utils/CustomerId';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to fetch customer data based on customerId
export const getDashboardData = async () => {
  // Try to get customerNumber first (like NotificationContext does)
  const customerIdOrNumber = sessionStorage.getItem('customerNumber') || 
                           localStorage.getItem('customerNumber') ||
                           getCustomerId();

  console.log('📊 DashboardCount: Using customer identifier:', customerIdOrNumber);




  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/dashboard-count/${customerIdOrNumber}`
      , {headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }}
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      console.error('Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      // Request was made, but no response received
      console.error('No Response:', error.request);
    } else {
      // Other errors
      console.error('Error Message:', error.message);
    }
    throw error; // Rethrow the error for further handling
  }
};