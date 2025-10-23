

import axios from "axios";
import { getCustomerId, getCustomerNumber, getCustomerIdentifier } from "../utils/CustomerId";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// -------------------------------------------------------------------------------------------------------
//                                    fetchPresotedOrders
// -----------------------------------------------------------------------------------------------------

export const getPresortedOrdersByCustomer = async () => {
  const customerNumber = getCustomerIdentifier();
  const response = await axios.get(`${API_BASE_URL}/orders/customer-orders/${customerNumber}`, {
    headers: {
      'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
    }
  });
  return response.data.data?.orders || [];
};

export const sendOrderEmail = async () => {
  const customerNumber = getCustomerIdentifier();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/customer-orders/${customerNumber}`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
      }
    );
    console.log("API Response:", response.data); // Log response for debugging
    return response.data;
  } catch (error) {
    // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
    throw error;
  }
};

export const pmOrders = async () => {
  const customerNumber = getCustomerIdentifier(); // Using customerNumber instead of customerId
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/customer-prescriptions/${customerNumber}`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
      } // Updated to use unified orders route
    );
    console.log("API Response:", response.data); // Log response for debugging
    return response.data;
  } catch (error) {
    // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
    throw error;
  }
};

export const editPreSorted = async ({ orderNumber }) => { // Updated to use orderNumber
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/view/${orderNumber}`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
      } // Updated to use unified orders route
    );
    console.log("API Response:", response.data); // Log response for debugging
    return response.data;
  } catch (error) {
    // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
    throw error;
  }
};

export const editPS_Order = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/edit`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
      }); // Updated to use unified orders route
    console.log("API Response:", response.data); // Log response for debugging

    return response.data;
  } catch (error) {
    // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
    throw error;
  }
};

export const reOrder = async (orderNumber, orderDataToReorder) => { // Updated to use orderNumber
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/reorder/${orderNumber}`, // Updated to use main orders route
      orderDataToReorder, // Use the new parameter as the request body
      {
        headers: {
          "Content-Type": "application/json",
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
        },
      }
    );
    console.log("reOrder API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in reOrder:', error.response?.data || error.message);
    throw error;
  }
};



// export const reOrder = async (orderId) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/presorted-order/reOrder/${orderId}`,
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("API Response:", response.data); // Log response for debugging

//     return response.data;
//   } catch (error) {
//     // console.error('Error sending order email:', error.response?.data || error.message); // Log detailed error
//     throw error;
//   }
// };

// -------------------------------------------------------------------------------------------------------
//                                    CancelPresotedOrders
// -----------------------------------------------------------------------------------------------------
export const cancelOrder = async (orderNumber) => { // Updated to use orderNumber
  try {
    // Use the main orders route for cancellation
    const response = await axios.post(
      `${API_BASE_URL}/orders/cancel/${orderNumber}`, // Updated to use main orders route
      {}, // Empty body for cancellation request
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          "Content-Type": "application/json", // Specify JSON payload
        },
      }
    );

    // console.log('Order cancellation response:', response.data);
    return response.data; // Return the API response data
  } catch (error) {
    // console.error('Error while canceling the order:', error.response?.data || error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
export const ViewOrder = async (orderNumber) => { // Updated to use orderNumber
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/view/${orderNumber}`, // Updated to use main orders route
      {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.data;

    // Handle prescription images for presorted orders
    if (data && data.orderType === 'presorted' && data.presortedDetails?.prescriptionImages) {
      // Ensure the base image URL is set correctly
      const baseImageUrl = API_BASE_URL.replace("/api", "");

      // Process the images array correctly
      data.images = data.presortedDetails.prescriptionImages
        ?.map((img) => {
          if (!img) return null; // Skip if image is missing
          return img.startsWith("http")
            ? img
            : `${baseImageUrl}/${img.replace(/^\//, "")}`;
        })
        .filter(Boolean); // Remove null values
    }

    return { data };
  } catch (error) {
    console.error("ViewOrder API Error:", error);
    throw error;
  }
};

// export const fetchAllCustomerOrders = async () => {
//   const customerId = getCustomerId();
//   try {
//     const response = await fetch(`${API_BASE_URL}/order-status/customer-orders/${customerId}`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log("Customer ID:", customerId); // Log the fetched data for debugging
//     return data;
//   } catch (error) {
//     console.error("Error fetching all customer orders:", error);
//     throw error;
//   }
// };

export const fetchAllCustomerOrders = async (customerNumber) => { // Updated to use customerNumber
  try {
    const response = await fetch(`${API_BASE_URL}/orders/customer-orders/${customerNumber}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    }); // Using customerNumber for the route
    if (!response.ok) {
      console.error(`Failed to fetch orders from: ${API_BASE_URL}/customer-orders/${customerNumber}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Customer Number:", customerNumber);
    console.log("Fetched All Orders Data:", result); // Log the full response
    // Assuming fetchAllCustomerOrders returns a direct array, not nested in 'data'
    // If it is nested, change `return result;` to `return result.data || result;`
    return result;
  } catch (error) {
    console.error("Error fetching all customer orders:", error);
    throw error;
  }
};

export const fetchCustomerOrderList = async () => {
  const customerIdOrNumber = getCustomerIdentifier(); // Using customerNumber/customerId
  
  console.log('📋 Fetching orders for customer:', customerIdOrNumber);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/customer-orders/${customerIdOrNumber}`,
      { headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
    });

    console.log("fetchCustomerOrderList API Response (full):", response.data);

    // The backend returns: { status: "success", data: { customer: {}, orders: [...], totalOrders: n } }
    // We need to extract the orders array and transform it to match the frontend expectations
    if (response.data && response.data.data && response.data.data.orders) {
      const orders = response.data.data.orders;
      
      // Transform the backend response to match frontend expectations
      const transformedOrders = orders.map(order => ({
        id: order.orderNumber || order.id, // Use orderNumber as primary ID
        order_id: order.orderNumber,
        orderNumber: order.orderNumber,
        created_at: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'N/A',
        status: order.status,
        medicationType: order.orderType === 'presorted' ? 'pre-sorted' : order.orderType,
        address: 'Delivery Address', // We'll get the actual address from order details when needed
        recipient: order.recipient,
        totalAmount: order.totalAmount,
        items: order.items
      }));
      
      console.log('📋 Transformed orders:', transformedOrders);
      return transformedOrders;
    } else {
      console.warn('⚠️ Unexpected API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching customer order list:", error.response?.data || error.message);
    throw error;
  }
};

export const getOrderDetailsById = async (orderNumber) => { // Updated to use orderNumber
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/view/${orderNumber}` // Updated to use main orders route
    , {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
    });
    console.log("getOrderDetailsById API Response (raw):", response.data);
    // Return the response data which contains the order details with address info
    return response.data.data;
  } catch (error) {
    console.error("Error fetching order details by ID:", error);
    throw error;
  }
};

export const getOrderDetailsByIdForNonsorted = async (orderNumber) => { // Updated to use orderNumber
  try {
    // Use the main orders route for all order types
    const response = await axios.get(
      `${API_BASE_URL}/orders/view/${orderNumber}`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
        }
      } // Updated to use main orders route
    );
    console.log("getOrderDetailsByIdForNonsorted API Response (raw):", response.data);
    
    if (response.data && response.data.data) {
        return response.data.data; // This is the structure containing order data
    }
    // Fallback in case of unexpected structure
    return response.data;
  } catch (error) {
    console.error("Error fetching nonsorted order details:", error);
    throw error;
  }
};



// ... (reOrder, cancelOrder, ViewOrder, fetchAllCustomerOrders, fetchCustomerOrderList remain the same) ...

// IMPORTANT: Do not include the commented out MOCK API section if you are using real APIs.
// If those mock functions were part of your actual export, make sure they are removed or truly commented out
// so they don't interfere with the real API calls.

//=========================== >>  MOCK API for testing purposes << ==================================

// services/HistoryOrder.js

// export const pmOrders = async () => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   return [
//     {
//       id: 1,
//       order_id: "ORD123456",
//       prescription_id: "RX987654",
//       created_at: "2025-04-25",
//       status: "delivered",
//       images: [
//         "https://images.template.net/20110/Blank-Prescription-1.jpg",
//         "https://images.template.net/20110/Blank-Prescription-1.jpg",
//       ],
//     },
//     {
//       id: 2,
//       order_id: "ORD654321",
//       prescription_id: "RX123456",
//       created_at: "2025-04-20",
//       status: "delivered",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//   ];
// };

// export const getOrderDetailsById = async (orderId) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   return {
//     order_info: {
//       id: orderId,
//       date: "2025-04-25",
//       status: "delivered",
//       total_amount: 500,
//     },
//     presorted: {
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@example.com",
//       phone: "1234567890",
//       address: "123 Street, City",
//       durationType: "Weeks",
//       durationNumber: "2",
//       orderingFor: "Myself",
//       patientName: "",
//       relationToPatient: "",
//       nonPrescriptionMedicine: "Vitamin C",
//       specialInstructions: "Take after meals",
//     },
//     images: [
//       {
//         filePath: "https://images.template.net/20110/Blank-Prescription-1.jpg",
//       },
//       {
//         filePath: "https://images.template.net/20110/Blank-Prescription-1.jpg",
//       },
//     ],
//     order_detail: [
//       {
//         product_id: "MED001",
//         product_name: "Paracetamol 500mg",
//         quantity: 2,
//         price_pu: 50,
//         total_price: "100.00",
//       },
//       {
//         product_id: "MED002",
//         product_name: "Ibuprofen 400mg",
//         quantity: 1,
//         price_pu: 70,
//         total_price: "70.00",
//       },
//     ],
//   };
// };

// export const reOrder = async (orderId) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   return {
//     status: 200,
//     message: "Order renewed successfully",
//   };
// };

// services/HistoryOrder.js

// export const sendOrderEmail = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 300)); // simulate delay

//   return [
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "new", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "presorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "approved", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "presorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "delivered", // New, Approved, In Progress, Shipped, Delivered
//       nonsorted_status: "delivered", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "presorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "shipped", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "presorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "in-progress", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "presorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//     {
//       id: "PRE123",
//       order_id: "ORD-PRE-001",
//       prescription_id: "RX-PRE-001",
//       presorted_created_at: "2025-04-24",
//       presorted_address: "Lahore, Pakistan",
//       presorted_status: "delivered", // New, Approved, In Progress, Shipped, Delivered
//       nonsorted_status: "delivered", // New, Approved, In Progress, Shipped, Delivered
//       medicationType: "nonsorted",
//       images: ["https://images.template.net/20110/Blank-Prescription-1.jpg"],
//     },
//   ];
// };

// export const ViewOrder = async (orderId) => {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   return {
//     order_info: {
//       id: orderId,
//       date: "2025-04-25",
//       status: "delivered",
//       total_amount: 3000,
//     },
//     presorted: {
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@example.com",
//       phone: "1234567890",
//       address: "123 Street",
//       durationType: "Weeks",
//       durationNumber: "2",
//       orderingFor: "Myself",
//       patientName: "",
//       relationToPatient: "",
//       nonPrescriptionMedicine: "Vitamin D",
//       specialInstructions: "Take after meal",
//     },
//     nonsorted: {
//       firstName: "Ali",
//       lastName: "Khan",
//       email: "ali.khan@example.com",
//       phone: "03001234567",
//       address: "Gulshan-e-Iqbal",
//     },
//     images: [
//       {
//         filePath: "https://images.template.net/20110/Blank-Prescription-1.jpg",
//       },
//     ],
//     order_detail: [
//       {
//         product_id: "PROD001",
//         product_name: "Panadol",
//         quantity: 2,
//         price_pu: 50,
//         total_price: "100.00",
//       },
//       {
//         product_id: "PROD002",
//         product_name: "Brufen",
//         quantity: 1,
//         price_pu: 70,
//         total_price: "70.00",
//       },
//     ],
//   };
// };

// export const cancelOrder = async (orderId) => {
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return { success: true };
// };

// export const submitOrder = async (orderData) => {
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return { success: true, orderId: "NEW-ORDER-123" };
// };



// Helper function for image path construction (Frontend & Backend compatible)
const formatImagePath = (filePath) => {
  if (!filePath) return null;
  const baseContentUrl = API_BASE_URL.replace("/api", ""); // e.g., http://localhost:8000

  if (filePath.startsWith("http")) {
    return filePath;
  }
  // This assumes filePath is like '/uploads/prescriptions/...' or 'uploads/prescriptions/...'
  // and your server serves static files from its root for '/uploads' path.
  // Example: http://localhost:8000/uploads/prescriptions/image.jpg
  return `${baseContentUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
};

// ... (other Order Management Related APIs remain the same) ...

// =======================================================================================================
//                                          Prescription Management Related APIs
// =======================================================================================================

// Fetches the list of prescription orders for the Prescription Management table
export const fetchPrescriptionOrdersList = async () => {
  const customerIdOrNumber = getCustomerIdentifier(); // Using customerNumber/customerId
  
  console.log('💊 Fetching prescription orders for customer:', customerIdOrNumber);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/customer-prescriptions/${customerIdOrNumber}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });
    console.log("fetchPrescriptionOrdersList API Response:", response.data);

    // The backend returns: { status: "success", data: [...], meta: { total: n, customerNumber: "..." } }
    // Extract the data array and transform it
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const prescriptionOrders = response.data.data;
      
      // Transform the backend response to match frontend expectations
      const transformedOrders = prescriptionOrders.map(order => ({
        id: order.orderNumber || order.id,
        order_id: order.orderNumber,
        orderNumber: order.orderNumber,
        created_at: order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB') : 'N/A',
        status: order.status,
        medicationType: order.order_type === 'presorted' ? 'pre-sorted' : order.order_type,
        recipient: order.recipient,
        referringPhysician: order.referringPhysician || '',
        // Backend already returns formatted URLs, no need to format again
        images: order.prescriptionImages || []
      }));
      
      console.log('💊 Transformed prescription orders:', transformedOrders);
      return transformedOrders;
    } else {
      console.warn('⚠️ Unexpected prescription API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching prescription order list:", error.response?.data || error.message);
    throw error;
  }
};

// --- THIS IS THE FUNCTION YOU NEED ---
// Fetches detailed information for a single prescription order (for the modal in PrescriptionManagement)
export const getPrescriptionDetailsById = async (orderNumber) => { // Updated to use orderNumber
  try {
    // Use the main orders route instead of presorted route
    const response = await axios.get(`${API_BASE_URL}/orders/view/${orderNumber}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
      
    }); // Updated to use main orders route
    console.log("getPrescriptionDetailsById (PM) API Response (raw):", response.data);

    // The main orders route returns: { status: "success", data: { ...order_data... } }
    const data = response.data.data;

    if (data) {
        // For presorted orders, transform the response to match expected structure
        if (data.orderType === 'presorted') {
            const transformedData = {
                order: {
                    id: data.id,
                    order_id: data.orderNumber,
                    firstName: data.customer?.name?.split(' ')[0] || 'N/A',
                    lastName: data.customer?.name?.split(' ')[1] || '',
                    email: data.customer?.email || 'N/A',
                    phone: data.customer?.phone || 'N/A',
                    address: data.address || 'N/A',
                    city: data.city || 'N/A',
                    state: data.state || 'N/A',
                    status: data.status,
                    created_at: new Date(data.createdAt).toLocaleDateString('en-GB'),
                    updated_at: new Date(data.updatedAt).toLocaleDateString('en-GB'),
                    durationType: data.presortedDetails?.durationType,
                    durationNumber: data.presortedDetails?.durationNumber,
                    specialInstructions: data.presortedDetails?.specialInstructions,
                    referringPhysician: data.presortedDetails?.referringPhysician,
                    customer: data.customer
                },
                items: data.items || [],
                images: data.presortedDetails?.prescriptionImages?.map(img => formatImagePath(img)).filter(Boolean) || []
            };
            return transformedData;
        }
        
        // For nonsorted orders, return as is
        return data;
    }
    return data;
  } catch (error) {
    console.error("Error fetching prescription details by ID:", error.response?.data || error.message);
    throw error;
  }
};