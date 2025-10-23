import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Nav,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { buildPrescriptionImageUrl } from "../../../../utils/urlBuilder";
import {
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  cancelOrder,
  reOrder,
  getOrderDetailsById,
  getOrderDetailsByIdForNonsorted,
  fetchCustomerOrderList,
} from "../../../../services/HistoryOrder.js";

// Import both components
import OrderDetailView from "./OrderDetailView";


import "./OrderManagement.css";
import "./PreSortedOrderDetailView.css";
import { getCustomerId } from "../../../../utils/CustomerId";
import PreSortedOrderDetailview from "./PreSortedOrderDetailView.jsx";


// Add this utility function to parse your date format
const parseCustomDate = (dateString) => {
  if (!dateString) return new Date(NaN);
  
  const parts = dateString.split('/');
  if (parts.length === 3) {
    // Note: months are 0-indexed in JavaScript Date (0 = January)
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  return new Date(dateString); // fallback to default parsing
};


const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("activeOrders");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  
  // By default, sort by date with the newest order on top
  const [sortField, setSortField] = useState("created_at"); 
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [dateFilter, setDateFilter] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const customerId = getCustomerId();

  // Fetches orders whenever the activeTab changes
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsLoadingPage(true);
    try {
      const customerOrders = await fetchCustomerOrderList();

      const normalize = (s) => {
        if (!s) return "unknown";
        let x = s.toString().trim().toLowerCase().replace(/[_-]+/g, " ");
        if (x === "processing") x = "in progress";
        if (x === "completed") x = "delivered";
        if (x === "canceled") x = "cancelled";
        return x;
      };
      
      const normalizedOrders = customerOrders.map(o => ({
        ...o,
        status: normalize(o.status),
      }));

      // Directly set the 'orders' state based on the active tab
      if (activeTab === "activeOrders") {
        const active = normalizedOrders.filter(
          o => o.status !== "delivered" && o.status !== "cancelled"
        );
        setOrders(active);
      } else {
        const history = normalizedOrders.filter(
          o => o.status === "delivered" || o.status === "cancelled"
        );
        setOrders(history);
      }

    } catch (error) {
      Swal.fire("Error", "Failed to fetch orders from backend.", "error");
      console.error(error);
    } finally {
      setIsLoadingPage(false);
    }
  };

  const handleViewOrder = async (orderFromTable) => {
    setIsLoadingOrder(true);
    setShowDetailView(true);
    setSelectedOrder(null);
    try {
      const medicationTypeLowercase = orderFromTable.medicationType?.toLowerCase().replace("-", "");
      
      const fetchedDetailResponse =
        medicationTypeLowercase === "nonsorted"
          ? await getOrderDetailsByIdForNonsorted(orderFromTable.orderNumber || orderFromTable.id) // Use orderNumber if available
          : await getOrderDetailsById(orderFromTable.orderNumber || orderFromTable.id); // Use orderNumber if available

      console.log("DEBUG: fetchedDetailResponse:", fetchedDetailResponse);
      
      // Handle the new API structure from main orders route
      let items = [];
      let orderDetails = {};
      let prescriptionImageUrl = null;
      
      if (medicationTypeLowercase === "presorted") {
        // For presorted orders using the new main orders API
        if (fetchedDetailResponse?.items) {
          // New API structure - items are directly in response
          items = fetchedDetailResponse.items;
          orderDetails = fetchedDetailResponse;
          
          // Get prescription images from presortedDetails
          if (fetchedDetailResponse.presortedDetails?.prescriptionImages?.length > 0) {
            prescriptionImageUrl = buildPrescriptionImageUrl(fetchedDetailResponse.presortedDetails.prescriptionImages[0]);
          }
        } else {
          // Fallback to old API structure
          items = fetchedDetailResponse?.items || [];
          orderDetails = fetchedDetailResponse?.order || {};
          if (fetchedDetailResponse?.images?.length > 0) {
            prescriptionImageUrl = fetchedDetailResponse.images[0];
          }
        }
      } else {
        // For nonsorted orders using the new main orders API
        if (fetchedDetailResponse?.items) {
          // New API structure - data is directly in response
          items = fetchedDetailResponse.items;
          orderDetails = fetchedDetailResponse;
        } else {
          // Fallback to old API structure
          items = fetchedDetailResponse?.items || [];
          orderDetails = fetchedDetailResponse?.order || {};
        }
      }

      let finalSelectedOrder = {
        // Include the complete API response for the component to access
        ...fetchedDetailResponse,
        // Legacy structure for backward compatibility
        order_info: orderFromTable,
        invoice_id: orderDetails.invoice_id || orderDetails.orderNumber || null,
        payment_method: orderDetails.payment_method || "Cash on Delivery",
        order_detail: items,
        firstName: orderDetails.firstName || orderDetails.customer?.name?.split(' ')[0] || 'N/A',
        lastName: orderDetails.lastName || orderDetails.customer?.name?.split(' ').slice(1).join(' ') || '',
        address: orderDetails.address || 'N/A',
        city: orderDetails.city || 'N/A',
        state: orderDetails.state || 'N/A',
        prescription_image_url: prescriptionImageUrl,
      };
      
      console.log('DEBUG: finalSelectedOrder being passed to detail view:', {
        finalSelectedOrder,
        totalAmount: finalSelectedOrder.totalAmount,
        items: finalSelectedOrder.items,
        order_detail: finalSelectedOrder.order_detail
      });
      
      setSelectedOrder(finalSelectedOrder);
    } catch (error) {
      Swal.fire("Error", "Could not fetch order details.", "error");
      setShowDetailView(false);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedOrder(null);
  };

  const handleRenewOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to renew this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, renew it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await reOrder(selectedOrder.orderNumber || orderId); // Use orderNumber if available
        if (response.status === 200) {
          Swal.fire("Success", "Order renewed successfully.", "success");
          fetchOrders();
          setShowDetailView(false);
        } else {
          Swal.fire("Error", "Failed to renew order.", "error");
        }
      } catch {
        Swal.fire("Error", "Failed to renew order.", "error");
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter === dateFilter ? null : filter);
    setCurrentPage(1);
  };

  const filterByDate = (orders) => {
    if (!dateFilter) return orders;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter(order => {
      const orderDate = parseCustomDate(order.created_at);
      
      switch (dateFilter) {
        case "Today":
          return orderDate >= today;
        case "Last 7 Days":
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return orderDate >= sevenDaysAgo;
        case "Last 30 Days":
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return orderDate >= thirtyDaysAgo;
        default:
          return true;
      }
    });
  };

  const handleCancelOrder = async (orderId, status) => {
    // Check if order is approved
    if (status?.toLowerCase() !== 'pending') {
      Swal.fire({
        title: "Cannot Cancel Order",
        text: "Approved orders cannot be cancelled. Please contact support for assistance.",
        icon: "info",
        confirmButtonText: "Contact Support",
        showCancelButton: true,
        cancelButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          // Here you can redirect to support page or open contact modal
          // For now, just show contact info
          Swal.fire("Contact Support", "Please call us at: +92-XXX-XXXXXXX or email: contact@smartmedics.com", "info");
        }
      });
      return;
    }

    // Show confirmation modal for other statuses
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it"
    });

    if (result.isConfirmed) {
      try {
        const response = await cancelOrder(orderId); // Use orderId parameter directly
        if (response.status === 'success') {
          Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
          fetchOrders(); // Refresh the orders list
          if (showDetailView) {
            setShowDetailView(false); // Close detail view if open
          }
        } else {
          Swal.fire("Error", response.message || "Failed to cancel order.", "error");
        }
      } catch (error) {
        if (error.response?.status === 400) {
          // Handle approved order error from backend
          Swal.fire("Cannot Cancel", error.response.data.message, "info");
        } else {
          Swal.fire("Error", "Failed to cancel order.", "error");
        }
      }
    }
  };

  const renderStatusBadge = (status) => {
    let badgeClass = "status-badge";
    let statusText = status;
    switch (status.toLowerCase()) {
      case "pending": badgeClass += " status-pending"; break;
      case "new": badgeClass += " status-new"; break;
      case "in progress": badgeClass += " status-in-progress"; break;
      case "shipped": badgeClass += " status-shipped"; break;
      case "delivered": badgeClass += " status-delivered"; break;
      case "cancelled": badgeClass += " status-cancelled"; break;
      case "approved": badgeClass += " status-approved"; break;
      default: badgeClass += " status-default"; break;
    }
    return <span className={badgeClass}>{statusText}</span>;
  };

  const renderActionButtons = (order) => {
    const status = order.status?.toLowerCase();
    const medicationType = order.medicationType?.toLowerCase();
    return (
      <>
        <Button size="sm" onClick={() => handleViewOrder(order)} className="me-2 custom-view-button">
          View
        </Button>
        {/* Show Cancel button for active orders (not delivered or cancelled) */}
        {activeTab === "activeOrders" && status !== "delivered" && status !== "cancelled" && (
          <Button
            size="sm"
            className="me-2 custom-cancel-button"
            onClick={() => handleCancelOrder(order.orderNumber || order.id, status)} // Use orderNumber if available, fallback to id
          >
            Cancel
          </Button>
        )}
        {status === "delivered" && activeTab === "orderHistory" && (
          <Button
            size="sm"
            className="custom-reorder-button"
            onClick={medicationType === "pre-sorted" ? () => handleViewOrder(order) : () => handleRenewOrder(order.id)}
          >
            Re-Order
          </Button>
        )}
      </>
    );
  };

  const sortedAndFilteredOrders = () => {
    const filtered = filterByDate(orders);
    
    if (!sortField) return filtered;
    
    return [...filtered].sort((a, b) => {
      let aVal, bVal;

      if (sortField === "created_at") {
        aVal = parseCustomDate(a.created_at);
        bVal = parseCustomDate(b.created_at);
      } else {
        aVal = a[sortField]?.toString().toLowerCase() || '';
        bVal = b[sortField]?.toString().toLowerCase() || '';
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  const renderTableRows = (ordersToRender) => {
    if (isLoadingPage) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            <Spinner animation="border" size="sm" className="me-2" /> Loading orders...
          </td>
        </tr>
      );
    }
    if (ordersToRender.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">No record</td>
        </tr>
      );
    }
    return ordersToRender.map((order, idx) => (
      <tr key={order.id}>
        {/* --- CHANGES START HERE --- */}
        <td>{idx + 1 + (currentPage - 1) * ordersPerPage}</td>
        <td>{order.order_id}</td>
        <td className="mobile-hide">{order.created_at}</td>
        {/* <td className="mobile-hide address-cell">{order.address}</td> */}
        <td>{renderStatusBadge(order.status)}</td>
        <td className="mobile-hide">{order.medicationType}</td>
        <td>{renderActionButtons(order)}</td>
        {/* --- CHANGES END HERE --- */}
      </tr>
    ));
  };

  const currentOrders = sortedAndFilteredOrders().slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const totalOrders = sortedAndFilteredOrders().length;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = window.innerWidth <= 768 ? 2 : 3; // Show fewer pages on mobile
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center mt-3 mb-3">
        
        {/* Mobile view - compact layout */}
        <div className="d-flex d-md-none w-100 justify-content-between align-items-center mb-2">
          <Button
            variant="link"
            className="previousbtn mobile-nav-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            <FaChevronLeft style={{ marginRight: '4px', fontSize: '12px' }} /> Prev
          </Button>

          <div className="d-flex align-items-center">
            <span className="page-info" style={{ fontSize: '14px', color: '#666' }}>
              {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="link"
            className="Nextbtn mobile-nav-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            Next <FaChevronRight style={{ marginLeft: '4px', fontSize: '12px' }} />
          </Button>
        </div>

        {/* Desktop view - original layout */}
        <div className="d-none d-md-flex w-100 justify-content-between align-items-center">
          <Button
            variant="link"
            className="previousbtn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft style={{ marginRight: '8px' }} /> Previous
          </Button>

          <div className="d-flex">
            {startPage > 1 && (
              <>
                <Button
                  variant="link"
                  className={`px-3 py-1 mx-1 text-decoration-none link ${1 === currentPage ? 'bg-light text-dark' : ''}`}
                  onClick={() => paginate(1)}
                >
                  1
                </Button>
                {startPage > 2 && <span className="px-3 py-1 mx-1">...</span>}
              </>
            )}

            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant="link"
                className={`px-3 py-1 mx-1 text-decoration-none link previou ${currentPage === number ? 'bg-light text-dark' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-3 py-1 mx-1">...</span>}
                <Button
                  variant="link"
                  className={`px-3 py-1 mx-1 text-decoration-none link ${totalPages === currentPage ? 'bg-light text-dark' : ''}`}
                  onClick={() => paginate(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="link"
            className="Nextbtn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next <FaChevronRight style={{ marginLeft: '14px' }} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 className=" mb-0 order-management-heading">Order Management</h2>

      <Nav variant="tabs" defaultActiveKey="activeOrders" className="mb-4 order-management-tabs">
        <Nav.Item>
          <Nav.Link eventKey="activeOrders" onClick={() => setActiveTab("activeOrders")} className={activeTab === "activeOrders" ? "active" : ""}>
            Active Orders
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="orderHistory" onClick={() => setActiveTab("orderHistory")} className={activeTab === "orderHistory" ? "active" : ""}>
            Order History
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="order-mamagment">
        <Container
        style={{ maxWidth: showDetailView ? '100%' : '1200px' }}>
          {showDetailView ? (
            // Use PreSortedOrderDetailView for both presorted and nonsorted orders
            // since it handles both cases correctly with the new unified API
            <PreSortedOrderDetailview
              order={selectedOrder}
              isLoading={isLoadingOrder}
              onClose={handleCloseDetailView}
              breadcrumbLabel={activeTab === "activeOrders" ? "Active Orders" : "Order History"}
            />
          ) : (
            <>
              <div className="order-header">
                <h3 className="mb-0 fs-md-4" style={{ fontWeight: 600 }}>
                  {activeTab === "activeOrders" ? "Active Order" : "Order History"}
                </h3>
                <div className="filter-container">
                  <div className="filter-item">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" id="dropdown-date" className="btnDateSort">
                        {dateFilter || "Date"} 
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleDateFilter("Today")}
                          active={dateFilter === "Today"}
                        >
                          Today
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDateFilter("Last 7 Days")}
                          active={dateFilter === "Last 7 Days"}
                        >
                          Last 7 Days
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDateFilter("Last 30 Days")}
                          active={dateFilter === "Last 30 Days"}
                        >
                          Last 30 Days
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="filter-item">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort-by" className="btnDateSort">
                        Sort By 
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleSort("order_id")}
                          active={sortField === "order_id"}
                        >
                          Order Number
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleSort("created_at")}
                          active={sortField === "created_at"}
                        >
                          Order Date
                        </Dropdown.Item>
                        {/* <Dropdown.Item
                          onClick={() => handleSort("status")}
                          active={sortField === "status"}
                        >
                          Status
                        </Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="table-responsive custom-table-container">
                <div className="table-wrapper">
                  <Table className="order-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                      <th>Order Number</th>
                      <th className="mobile-hide">Order Date</th>
                      {/* <th className="mobile-hide">Address</th> */}
                      <th>Status</th>
                      <th className="mobile-hide">Medication Type</th>
                      <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderTableRows(currentOrders)}
                    </tbody>
                  </Table>
                </div>

                {renderPagination()}
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default OrderManagement;