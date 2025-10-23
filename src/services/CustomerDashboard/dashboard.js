import axios from 'axios';
import { getCustomerId, getCustomerIdentifier } from '../../utils/CustomerId';
import axiosInstance from '../../utils/axiosInstance';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Fetch dashboard summary counts
export const fetchDashboardCounts = async () => {
  try {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('📊 Dashboard: Using customer identifier:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required for dashboard');
    }
    
    // Check if it's a numeric ID or a customerNumber string
    const isNumeric = !isNaN(Number(customerIdOrNumber)) && !customerIdOrNumber.includes('-');
    
    let recipientsRequestBody;
    if (isNumeric) {
      // It's a numeric customerId
      recipientsRequestBody = { customerId: Number(customerIdOrNumber) };
      console.log('📊 Using numeric customerId for recipients:', Number(customerIdOrNumber));
    } else {
      // It's a customerNumber string (like "WA-1")
      recipientsRequestBody = { customerNumber: customerIdOrNumber };
      console.log('📊 Using customerNumber for recipients:', customerIdOrNumber);
    }
    
    // Fetch orders and recipients in parallel
    const [ordersRes, prescriptionsRes, recipientsRes] = await Promise.all([
      axiosInstance.get(`${API_BASE_URL}/orders/customer-orders/${customerIdOrNumber}`, {headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }}),
      axiosInstance.get(`${API_BASE_URL}/orders/customer-prescriptions/${customerIdOrNumber}`, {headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }}),
      axiosInstance.post(`${API_BASE_URL}/customer/customer-recipients`, recipientsRequestBody, {headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }})
    ]);
    
    console.log('📊 Dashboard counts - Orders response:', ordersRes.data);
    console.log('📊 Dashboard counts - Prescriptions response:', prescriptionsRes.data);
    console.log('📊 Dashboard counts - Recipients response:', recipientsRes.data);
    
    // Extract orders from the nested response structure
    const orders = ordersRes.data?.data?.orders || [];
    const prescriptions = prescriptionsRes.data?.data || [];
    const recipients = recipientsRes.data.data || [];
    
    // Active orders: count with status not delivered/cancelled
    const activeOrders = Array.isArray(orders) ? orders.filter(o => (o.status && !['delivered','cancelled'].includes(o.status.toLowerCase()))).length : 0;
    // Uploaded prescriptions: count of presorted orders
    const uploadedPrescriptions = Array.isArray(prescriptions) ? prescriptions.length : 0;
    // Recipients linked
    const recipientsLinked = recipients.length;
    
    console.log('📊 Dashboard counts calculated:', { activeOrders, uploadedPrescriptions, recipientsLinked });
    
    return { activeOrders, uploadedPrescriptions, recipientsLinked };
  } catch (error) {
    console.error('❌ Dashboard fetch error:', error);
    throw error;
  }
};

// Fetch recent orders for table
export const fetchRecentOrders = async () => {
  try {
    const customerIdOrNumber = getCustomerIdentifier();
    console.log('📊 Fetching recent orders for customer:', customerIdOrNumber);
    
    if (!customerIdOrNumber) {
      throw new Error('Customer identification is required for recent orders');
    }
    
    const response = await axios.get(`${API_BASE_URL}/orders/customer-orders/${customerIdOrNumber}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    });
    console.log('📊 Recent orders API response:', response.data);
    
    // The API returns: { status: "success", data: { customer: {}, orders: [...], totalOrders: n } }
    if (response.data && response.data.data && response.data.data.orders) {
      const orders = response.data.data.orders;
      
      // Transform to dashboard table format
      const transformedOrders = orders.map((order, idx) => ({
        id: order.orderNumber || order.id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'N/A',
        address: 'Delivery Address', // We'll get the actual address from order details when needed
        medicationType: order.orderType === 'presorted' ? 'Pre-sorted' : order.orderType,
        status: order.status,
        recipient: order.recipient
      }));
      
      console.log('📊 Transformed recent orders:', transformedOrders);
      return transformedOrders;
    } else {
      console.warn('⚠️ Unexpected recent orders API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching recent orders:', error);
    throw error;
  }
};
