import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { deleteRecipient, recipients, fetchRecipientOrders } from "../../../../services/CustomerDashboard/receiptProfile";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../../Components/Spinner/LoadingSpinner";
import { getCustomerId } from "../../../../utils/CustomerId";
import OrderDetailView from "../OrderManagement/OrderDetailView";
import PreSortedOrderDetailView from "../OrderManagement/PreSortedOrderDetailViewWrapper";
import "../OrderManagement/PreSortedOrderDetailView.css";


import { reOrder, getOrderDetailsById } from "../../../../services/HistoryOrder";

function RecipientProfile() {
  // For loading state of re-order
  const [reorderingId, setReorderingId] = useState(null);

  // Helper: handle re-order
  const handleReOrder = async (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to re-order this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, re-order!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setReorderingId(order.id);
        try {
          // Fetch full order details to get all required fields
          const fullOrder = await getOrderDetailsById(order.orderNumber || order.id); // Use orderNumber if available
          const customerId = getCustomerId();
          // Prepare payload for reOrder API
          const dataToReorder = {
            order_info: { customer_id: customerId },
            presorted: {
              firstName: fullOrder?.presorted?.firstName || '',
              lastName: fullOrder?.presorted?.lastName || '',
              phone: fullOrder?.presorted?.phone || '',
              email: fullOrder?.presorted?.email || '',
              address: fullOrder?.presorted?.address || '',
              durationType: fullOrder?.presorted?.durationType || '',
              durationNumber: fullOrder?.presorted?.durationNumber || '',
              orderingFor: fullOrder?.presorted?.orderingFor || '',
              patientName: fullOrder?.presorted?.patientName || '',
              relationToPatient: fullOrder?.presorted?.relationToPatient || '',
              nonPrescriptionMedicine: fullOrder?.presorted?.nonPrescriptionMedicine || '',
              specialInstructions: fullOrder?.presorted?.specialInstructions || '',
              referringPhysician: fullOrder?.presorted?.referringPhysician || '',
              state: fullOrder?.presorted?.state || '',
              city: fullOrder?.presorted?.city || '',
            },
            prescriptionItems: (fullOrder?.order_detail || []).map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price_pu: item.price_pu,
              total_price: item.total_price,
            })),
            images: (fullOrder?.images || []).map(img => img.filePath || img),
          };
          const response = await reOrder(order.orderNumber || order.id, dataToReorder); // Use orderNumber if available
          if (response.status === 'success') {
            Swal.fire("Success", "Order re-ordered successfully.", "success");
          } else {
            Swal.fire("Error", `Failed to re-order: ${response.message || 'Unknown error'}` , "error");
          }
        } catch (error) {
          Swal.fire("Error", "Failed to re-order.", "error");
        } finally {
          setReorderingId(null);
        }
      }
    });
  };
  const [loader, setLoader] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showOrdersFor, setShowOrdersFor] = useState(null); // recipient id for which to show orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
    
    
    
  useEffect(() => {
    const loadRecipients = async () => {
      setLoader(true);
      try {
        const data = await recipients(); // No need to pass customerId, it gets it internally
        const recipientData = data.data || data; // Handle response structure
        setAddresses(recipientData.map(item => ({
          id: item.id,
          customerId: item.customer_id,
          fullName: item.name,
          relationship: item.relationToPatient,
          address: item.address,
          phoneNumber: item.phone,
          patientName: item.patientName,
          orderingFor: item.orderingFor,
          isEditing: false,
        })));
        // Don't auto-select recipient for orders table
      } catch (err) {
        console.error("Error fetching recipients:", err);
      } finally {
        setLoader(false);
      }
    };
    loadRecipients();
  }, []);

  useEffect(() => {
    if (!showOrdersFor) return;
    setOrdersLoading(true);
    fetchRecipientOrders(showOrdersFor, 1)
      .then(res => setOrders(res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [showOrdersFor]);

      
    
      const toggleEdit = (id) => {
        const updatedAddresses = addresses.map((item) =>
          item.id === id ? { ...item, isEditing: !item.isEditing } : item
        );
        setAddresses(updatedAddresses);
      };
    

      
    
      const handleDelete = async (id) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to delete this recipient? This action cannot be undone.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await deleteRecipient(id);
      
              if (response && response.message === 'Recipient deleted successfully') {
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted',
                  text: response.message,
                });
                setAddresses(addresses.filter((item) => item.id !== id));
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to delete recipient',
                });
              }
            } catch (error) {
              console.error('Error deleting recipient:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the recipient',
              });
            }
          }
        });
      };
      
      
      
      
  return (
<Container className="py-4">
  <div className="address-book-container">
    <div className="mb-4">
      <h2 className=''>Recipient Profile</h2>
    </div>
    {loader ? (
      <LoadingSpinner />
    ) : (
      <>
        <div className="row g-4"> 
          {addresses.map((item, index) => (
            <div 
              className="col-xxl-4 col-xl-6 col-lg-6 col-md-12" 
              key={item.id}
            >
 <div
  className={`card h-100 custom-card ${showOrdersFor === item.id ? 'border-primary' : ''}`}
  style={{
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(131, 128, 128, 0.08)",
    minWidth: "275px",
    maxWidth: "100%"
  }}
>
                <div className="card-body profile ">
                  <p className="mb-1 text-dark">Recipient #{index + 1}</p>
                  <p className="mb-1 text-dark">Name : <span> {item.fullName}</span></p>
                  <p className="mb-1" style={{ color: "gray" }}>
                    Phone : {item.phoneNumber}
                  </p>
                  
                  <p className="mb-1" style={{ color: "gray" }}>Patient Name : {item.patientName || item.fullName}</p>
                  <p style={{ color: "gray" }}> Relation to Patient : {item.relationship || 'Myself'}</p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center gap-2 mt-0" style={{ borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}>
                  <Button
                    variant="info"
                    className="flex-fill"
                    style={{background:'#16b1b1',color:'#fff', borderRadius: "40px"}}
                    onClick={() => {
                      setShowOrdersFor(item.id);
                      setSelectedRecipient(item);
                      setOrderDetail(null);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    className="p-2 delete-btn"
                    style={{
                      background:'transparent',
                      border:'none',
                      color:'#6c757d', 
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Orders Table for selected recipient */}
        {showOrdersFor && selectedRecipient && selectedRecipient.id === showOrdersFor && (
          <div className="mt-5">
            {ordersLoading ? (
              <LoadingSpinner />
            ) : orderDetail ? (
              <PreSortedOrderDetailView order={orderDetail} isLoading={orderDetailLoading} onClose={() => setOrderDetail(null)} breadcrumbLabel="Recipient Orders" />
            ) : (
              <div className="table-responsive detail-card  p-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0 fw-bold">{selectedRecipient?.patientName || 'Recipient'} Orders</h4>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => {
                      setShowOrdersFor(null);
                      setSelectedRecipient(null);
                      setOrders([]);
                    }}
                    style={{
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0"
                    }}
                  >
                    ✕
                  </Button>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th style={{color:"gray", whiteSpace: "nowrap"}} className="small">ID</th>
                      <th style={{color:"gray", whiteSpace: "nowrap"}} className="small">Prescription Name</th>
                      <th style={{color:"gray", whiteSpace: "nowrap"}} className="small">Order Number</th>
                      <th style={{color:"gray", whiteSpace: "nowrap"}} className="small">Order Date</th>
                      <th style={{color:"gray", whiteSpace: "nowrap"}} className="small">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No orders found.</td></tr>
                    ) : (
                      orders.map((order, idx) => (
                        <tr key={order.id}>
                          <td style={{color:"gray"}}>{idx + 1}</td>
                          <td style={{color:"gray"}}>{selectedRecipient?.fullName}</td>
                          <td style={{color:"gray"}}>{order.orderNumber}</td>
                          <td style={{color:"gray"}}>{order.orderDate}</td>
                          
                          
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                variant="info"
                                style={{
                                  background:'#16b1b1',
                                  border:'none',
                                  color:'#fff',
                                  borderRadius: "30px",
                                  width: "100px",
                                  margin: "0"
                                }}
                                onClick={async () => {
                                  setOrderDetailLoading(true);
                                  try {
                                    // Fetch detailed order data similar to OrderManagement
                                    const fetchedDetailResponse = await getOrderDetailsById(order.orderNumber || order.id); // Use orderNumber if available
                                    const items = fetchedDetailResponse?.items || [];
                                    let orderDetails = fetchedDetailResponse?.order || {};
                                    
                                    let prescriptionImageUrl = null;
                                    if (fetchedDetailResponse?.order?.images?.length > 0) {
                                      prescriptionImageUrl = fetchedDetailResponse.order.images[0];
                                    }
                                    
                                    if (fetchedDetailResponse?.order?.presorted) {
                                      orderDetails = fetchedDetailResponse.order.presorted;
                                    }

                                    let finalSelectedOrder = {
                                      order_info: {
                                        id: order.id,
                                        order_id: order.orderNumber,
                                        medicationType: order.medicationType || "Pre-sorted",
                                        status: orderDetails.status || "pending",
                                        created_at: order.orderDate,
                                        orderNumber: order.orderNumber,
                                        orderDate: order.orderDate
                                      },
                                      invoice_id: orderDetails.invoice_id || null,
                                      payment_method: orderDetails.payment_method || "Cash on Delivery",
                                      order_detail: items,
                                      firstName: orderDetails.firstName || selectedRecipient?.fullName,
                                      lastName: orderDetails.lastName || '',
                                      address: orderDetails.address || order.address,
                                      phone: orderDetails.phone || '',
                                      email: orderDetails.email || '',
                                      city: orderDetails.city || '',
                                      province: orderDetails.province || '',
                                      patientName: orderDetails.patientName || selectedRecipient?.patientName,
                                      relationToPatient: orderDetails.relationToPatient || selectedRecipient?.relationship,
                                      referringPhysician: orderDetails.referringPhysician || '',
                                      nonPrescriptionMedicine: orderDetails.nonPrescriptionMedicine || '',
                                      specialInstructions: orderDetails.specialInstructions || '',
                                      images: fetchedDetailResponse?.order?.images || [],
                                      prescription_image_url: prescriptionImageUrl,
                                    };
                                    setOrderDetail(finalSelectedOrder);
                                  } catch (error) {
                                    console.error("Error fetching order details:", error);
                                    Swal.fire("Error", "Could not fetch order details.", "error");
                                  } finally {
                                    setOrderDetailLoading(false);
                                  }
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline-info"
                                disabled={reorderingId === order.id}
                                onClick={() => handleReOrder(order)}
                                style={{
                                  backgroundColor: "transparent",
                                  borderColor: "#09C6B2",
                                  width: "110px",
                                  color: "#09C6B2",
                                  borderRadius: "30px",
                                  margin: "0"
                                }}
                              >
                                {reorderingId === order.id ? 'Re-Ordering...' : 'Re-Order'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>
  
  <style jsx>{`
    @media (min-width: 1200px) and (max-width: 1400px) {
      .col-xl-4 {
        width: 33.33333333%;
        flex: 0 0 auto;
      }
    }
    
    .row.g-4 {
      --bs-gutter-x: 1.5rem;
      --bs-gutter-y: 1.5rem;
    }

    .delete-btn:hover {
      color: #dc3545 !important;
      background-color: rgba(220, 53, 69, 0.1) !important;
    }
  `}</style>
</Container>
  );
}

export default RecipientProfile