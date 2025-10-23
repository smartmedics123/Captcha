// utils/getCustomerId.js
export const getCustomerId = () => {
    const customerId = sessionStorage.getItem('customerId');
    console.log('🔍 getCustomerId called, sessionStorage customerId:', customerId);
    
    if (!customerId) {
      console.error('❌ Customer ID not found in sessionStorage. Available keys:', Object.keys(sessionStorage));
      
      // Check if we're in development mode and can enable test customer
      const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';
      const enableTestCustomer = localStorage.getItem('enableTestCustomer') === 'true';
      
      if (isDevelopment && enableTestCustomer) {
        console.log('⚠️ Enabling test customer ID 4 for development');
        sessionStorage.setItem('customerId', '4');
        return '4';
      }
      
      throw new Error('Customer ID is required - Please login or enable test customer');
    }
    return customerId;
};

// New utility function for customerNumber
export const getCustomerNumber = () => {
    const customerNumber = sessionStorage.getItem('customerNumber');
    if (!customerNumber) {
      // Fallback to customerId if customerNumber is not available
      const customerId = sessionStorage.getItem('customerId');
      if (!customerId) {
        throw new Error('Customer identification is required');
      }
      return customerId;
    }
    return customerNumber;
};

// Helper function to get customer identifier for new API calls
export const getCustomerIdentifier = () => {
    // Try customerNumber first (new format), fallback to customerId (old format)
    return sessionStorage.getItem('customerNumber') || sessionStorage.getItem('customerId');
};
  