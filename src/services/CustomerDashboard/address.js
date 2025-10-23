import axios from 'axios';
import { getCustomerId, getCustomerIdentifier } from '../../utils/CustomerId';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// -------------------------------------------------------------------------------------------------------
//                                    fetchrAddress
// -----------------------------------------------------------------------------------------------------

export const address = async () => {
  try {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('🏠 Address: Using customer identifier:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required for address');
    }
    
    // Use GET request with customerNumber in URL path
    const response = await axios.get(`${API_BASE_URL}/customer/customer-address-book/${customerIdOrNumber}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
    console.log('🏠 Address response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching customer address data:', error);
    throw error;
  }
};

// -------------------------------------------------------------------------------------------------------
//                                    UpadateAddress
// -----------------------------------------------------------------------------------------------------
export const updateAdress = async (updatedData) => {
  const customerId = Number(getCustomerId());
  try {
    const response = await axios.put(
      `${API_BASE_URL}/customer/update-address`,
      {
        ...updatedData,
        customerId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Address data:', error);
    throw error;
  }
};

// -------------------------------------------------------------------------------------------------------
//                                   DeleteAddress
// -----------------------------------------------------------------------------------------------------
export const deleteAdress = async (id) => {
  if (!id) {
    throw new Error('Address ID is required');
  }
  try {
    const response = await axios.delete(`${API_BASE_URL}/customer/delete-address/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting Address:', error);
    throw error;
  }
};