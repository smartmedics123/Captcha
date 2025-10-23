import axios from 'axios';
import { getCustomerId, getCustomerIdentifier } from '../../utils/CustomerId';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const emailNotifications = async (emailEnabled) => {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('📧 emailNotifications: Using customer identifier:', customerIdOrNumber);

    if (!customerIdOrNumber) {
        throw new Error('Customer identification is required');
    }

    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    const payload = {};
    if (isNumeric) {
        payload.customer_id = Number(customerIdOrNumber);
    } else {
        payload.customerNumber = customerIdOrNumber;
    }
    payload.email_notif = emailEnabled; // Match the database variable name

    try {
        const response = await axios.post(`${API_BASE_URL}/notifications/email/toggle`, payload, {
            headers: {
                'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
                'Content-Type': 'application/json',
            },
        });
        console.log('📧 Email notification toggle updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error updating email notifications:', error);
        throw error;
    }
};
export const smsNotifications = async (smsEnabled) => {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('📱 smsNotifications: Using customer identifier:', customerIdOrNumber);

    if (!customerIdOrNumber) {
        throw new Error('Customer identification is required');
    }

    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    const payload = {};
    if (isNumeric) {
        payload.customer_id = Number(customerIdOrNumber);
    } else {
        payload.customerNumber = customerIdOrNumber;
    }
    payload.sms_notif = smsEnabled; // Match the database variable name

    try {
        const response = await axios.post(`${API_BASE_URL}/notifications/sms/toggle`, payload, {
            headers: {
                'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
                'Content-Type': 'application/json',
            },
        });
        console.log('📱 SMS notification toggle updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error updating SMS notifications:', error);
        throw error;
    }
};

// function to call toggle behaviour from backend 
export const NotificationToggle = async () => {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('⚙️ NotificationToggle: Using customer identifier:', customerIdOrNumber);

    if (!customerIdOrNumber) {
        throw new Error('Customer identification is required');
    }

    // Use the customer identifier directly in the URL (backend should handle both formats)
    try {
        const response = await axios.get(`${API_BASE_URL}/notifications/settings/${customerIdOrNumber}`
            , {headers: {
                'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
            }}

        );
        console.log('⚙️ NotificationToggle API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching notification toggle settings:', error);
        if (error.response) {
            // Server responded with a status code outside the range of 2xx
            console.error('❌ Error Response:', error.response.data);
            console.error('❌ Status Code:', error.response.status);
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


//function to call notifications 
export const fetchNotificaitions = async (page, limit) => {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('📄 fetchNotificaitions: Using customer identifier:', customerIdOrNumber);

    if (!customerIdOrNumber) {
        throw new Error('Customer identification is required');
    }

    // Use customerNumber if available, fallback to customerId
    let customerParam = customerIdOrNumber;
    
    // If it's a numeric ID, we need to convert it to customerNumber or handle differently
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    if (isNumeric) {
        // For numeric IDs, we still use the ID directly since the backend route expects customerNumber
        // but in practice, both should work if the backend is properly set up
        customerParam = customerIdOrNumber;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/notifications/${customerParam}`, {
            params: {
                page, // Current page number
                limit, // Number of items per page
            },
            headers: {
                'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
            }
        });
        console.log('📄 Notifications API Response:', response.data);
        
        // Transform the response to match what the frontend expects
        const apiResponse = response.data;
        if (apiResponse.status === 'success' && apiResponse.data) {
            return {
                data: apiResponse.data.notifications || [],
                last_page: apiResponse.data.pagination?.totalPages || 1,
                total: apiResponse.data.pagination?.total || 0,
                current_page: apiResponse.data.pagination?.currentPage || 1,
                has_next: apiResponse.data.pagination?.hasNext || false,
                has_prev: apiResponse.data.pagination?.hasPrev || false
            };
        } else {
            // Fallback for unexpected response structure
            return {
                data: [],
                last_page: 1,
                total: 0,
                current_page: 1,
                has_next: false,
                has_prev: false
            };
        }
    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        if (error.response) {
            // Server responded with a status code outside the range of 2xx
            console.error('❌ Error Response:', error.response.data);
            console.error('❌ Status Code:', error.response.status);
        } else if (error.request) {
            // Request was made, but no response received
            console.error('❌ No Response:', error.request);
        } else {
            // Other errors
            console.error('❌ Error Message:', error.message);
        }
        throw error; // Rethrow the error for further handling
    }
};