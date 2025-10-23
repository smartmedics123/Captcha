import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  Button,
  Container,
  Table,
  Row,
  Col,
  Card,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { FaRedo, FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  editPS_Order,
  reOrder,
  fetchPrescriptionOrdersList,
  getPrescriptionDetailsById,
} from "../../../../services/HistoryOrder";
import { getCustomerId } from "../../../../utils/CustomerId";
import "./PrescriptionManagement.css";

const LOGO_URL = "/path/to/logo.png"; // <-- replace with your actual logo URL

const PrescriptionManagement = () => {
  const [prescriptionOrders, setPrescriptionOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [originalPrescriptionItems, setOriginalPrescriptionItems] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoadingPage(true);
    try {
      const data = await fetchPrescriptionOrdersList();
      setPrescriptionOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch prescription orders.", "error");
      console.error("Error fetching prescription orders list:", error);
    } finally {
      setIsLoadingPage(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // compute visible (sorted) orders
  const sortedOrders = () => {
    const list = [...prescriptionOrders];
    if (!sortField) return list;
    return list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "created_at") {
        // Since the date is already formatted as DD/MM/YYYY from backend, 
        // we need to parse it back to Date for proper sorting
        const parseFormattedDate = (dateStr) => {
          if (!dateStr || dateStr === "N/A") return new Date(0);
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            // DD/MM/YYYY format - convert to MM/DD/YYYY for Date constructor
            return new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
          }
          return new Date(dateStr);
        };
        
        aVal = parseFormattedDate(aVal);
        bVal = parseFormattedDate(bVal);
      } else {
        aVal = (aVal ?? "").toString().toLowerCase();
        bVal = (bVal ?? "").toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const visibleOrders = sortedOrders();
  const totalPages = Math.ceil(visibleOrders.length / itemsPerPage);
  const paginatedOrders = visibleOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToPage = (n) => setCurrentPage(n);

  // Utility: show the custom Swal reorder summary (UI)
  const showReorderSummarySwal = (prescriptionDetails = {}, items = [], onConfirmCallback) => {
    const subtotal = items.reduce((sum, it) => sum + parseFloat(it.totalPrice || it.total_price || 0), 0);
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    const itemsHtml = items
      .map((it) => {
        const name = it.product_name || it.title || "Unnamed Product";
        const qty = it.quantity ?? 1;
        const strength = it.strength || "";
        const total = parseFloat(it.totalPrice || it.total_price || (qty * (parseFloat(it.pricePerUnit || it.price_pu || 0)))).toFixed(2);
        return `
        <div class="reorder-item-row">
  <div class="left">
    <div class="product-name">${name}</div>
  </div>
  <div class="right">
    <span class="type">Tab</span>
    <span class="bar">|</span>
    <span class="strength">${strength}</span>
    <span class="price">${total}</span>
  </div>
</div>

        `;
      })
      .join("");

    const summaryHtml = `
      <div class="reorder-container ">
        <div class="reorder-header d-flex justify-content-between align-items-center mt-4">
    <div class="brand d-flex align-items-center">
      <img
        src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1750555047/logo2.svg"
        alt="logo"
        class="brand-logo"
      />
      
    </div>
  <div class="brand-text ms-2">  <button type="button" class="swal2-close custom-close" aria-label="Close">×</button></div>
  </div>

        <div class="reorder-body">
           <h5 class="mt-3 Orde-Summary">Re-Order Summary</h5>
          <div class="d-flex">
   <ul class="info-list mt-2">
  <li>
    <span class="label Re-Order-Summary">Invoice ID:</span>
    <span class="value">${prescriptionDetails.invoice_id || prescriptionDetails.orderNumber || prescriptionDetails.id || ""}</span>
  </li>
  <li>
    <span class="label">Recipient:</span>
    <span class="value">${prescriptionDetails.firstName || ""} ${prescriptionDetails.lastName || ""}</span>
  </li>
  <li>
    <span class="label">Medication Type:</span>
    <span class="value">${prescriptionDetails.medicationType || "Pre-sorted"}</span>
  </li>
  <li>
    <span class="label">Order Date:</span>
    <span class="value">${prescriptionDetails.created_at ? new Date(prescriptionDetails.created_at).toLocaleDateString("en-GB") : ""}</span>
  </li>
  <li>
    <span class="label">Address:</span>
    <span class="value">${prescriptionDetails.address || ""}</span>
  </li>
  <li>
    <span class="label">Payment Method:</span>
    <span class="value">${prescriptionDetails.payment_method || ""}</span>
  </li>
</ul>


          </div>

          <div class="">
            <h5 class="items-title mt-4">Items</h5>
            <div class="items-list">
              ${itemsHtml}
            </div>
<hr>
           <div class="totals">
  <div class="tot-row">
    <div>Subtotal:</div>
    <div class="val">${subtotal.toFixed(2)}</div>
  </div>
  <div class="tot-row">
    <div>Tax (${(taxRate * 100).toFixed(0)}%):</div>
    <div class="val">${tax.toFixed(2)}</div>
  </div>
  <hr>
  <div class="grand-row">
    <div><strong>Grand Total:</strong></div>
    <div class="val"><strong>${grandTotal.toFixed(2)}</strong></div>
  </div>
    <hr>
</div>

          </div>
        </div>

        <div class="reorder-footer">
          <button type="button" class="reorder-btn cancel">Cancel</button>
          <button type="button" class="reorder-btn confirm">Confirm Order</button>
        </div>
      </div>
    `;

    Swal.fire({
      html: summaryHtml,
      showConfirmButton: false,
      showCancelButton: false,
      customClass: {
        popup: "reorder-popup",
      },
      didOpen: () => {
        const btnConfirm = document.querySelector(".reorder-btn.confirm");
        const btnCancel = document.querySelector(".reorder-btn.cancel");
        const closeX = document.querySelector(".custom-close");

        btnCancel?.addEventListener("click", () => Swal.close());
        closeX?.addEventListener("click", () => Swal.close());

        btnConfirm?.addEventListener("click", async () => {
          btnConfirm.disabled = true;
          btnConfirm.innerText = "Processing...";
          try {
            if (typeof onConfirmCallback === "function") {
              await onConfirmCallback();
            }
            Swal.close();
            Swal.fire("Success", "Order renewed successfully.", "success");
            fetchOrders();
          } catch (err) {
            console.error("Reorder error:", err);
            Swal.fire("Error", "Failed to renew order.", "error");
          } finally {
            btnConfirm.disabled = false;
            btnConfirm.innerText = "Confirm Order";
          }
        });
      },
    });
  };

  // View details (populate modal)
  const ViewPrescription = async (order) => {
    setIsLoadingOrder(true);
    setShowModal(true);
    setSelectedOrder(null);

    try {
      const response = await getPrescriptionDetailsById(order.orderNumber || order.id); // Use orderNumber if available
      const prescriptionDetails = response?.order || {};
      const images = response?.images || [];
      const items = (response?.items || []).map((item) => ({
        ...item,
        product_name: item.product?.title || "Unnamed Product",
        strength: item.product?.strength,
      }));

      const formattedOrder = {
        order_info: {
          id: order.id,
          order_id: order.order_id,
          created_at: order.created_at,
          status: order.status,
          medicationType: "Pre-sorted",
          orderNumber: `PRSC${String(prescriptionDetails.id).padStart(3, "0")}`,
          orderDate: prescriptionDetails.created_at || "N/A",
          durationNumber: prescriptionDetails.durationNumber,
          durationType: prescriptionDetails.durationType,
          orderingFor: prescriptionDetails.orderingFor,
          specialInstructions: prescriptionDetails.specialInstructions,
        },
        firstName: prescriptionDetails.firstName,
        lastName: prescriptionDetails.lastName,
        phone: prescriptionDetails.phone,
        email: prescriptionDetails.email,
        address: prescriptionDetails.address,
        city: prescriptionDetails.city,
        state: prescriptionDetails.state,
        province: prescriptionDetails.state,
        deliveryAddress: prescriptionDetails.address,
        patientName: prescriptionDetails.patientName,
        relationToPatient: prescriptionDetails.relationToPatient,
        nonPrescriptionMedicine: prescriptionDetails.nonPrescriptionMedicine,
        images,
        order_detail: items,
        referringPhysician: prescriptionDetails.referringPhysician,
        invoice_id: prescriptionDetails.invoice_id,
        payment_method: prescriptionDetails.payment_method,
      };

      setSelectedOrder(formattedOrder);
      setEditedOrder({
        ...formattedOrder.order_info,
        firstName: formattedOrder.firstName,
        lastName: formattedOrder.lastName,
        email: formattedOrder.email,
        phone: formattedOrder.phone,
        address: formattedOrder.address,
        durationType: formattedOrder.order_info.durationType,
        durationNumber: formattedOrder.order_info.durationNumber,
        orderingFor: formattedOrder.order_info.orderingFor,
        patientName: formattedOrder.patientName,
        relationToPatient: formattedOrder.relationToPatient,
        nonPrescriptionMedicine: formattedOrder.nonPrescriptionMedicine,
        specialInstructions: formattedOrder.specialInstructions,
        referringPhysician: formattedOrder.referringPhysician,
      });
      setPrescriptionItems(formattedOrder.order_detail);
      setOriginalPrescriptionItems(formattedOrder.order_detail);
    } catch (error) {
      console.error("Error fetching prescription details:", error);
      Swal.fire("Error", "Could not fetch prescription details.", "error");
      setShowModal(false);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Direct Re-order (fetch details and show the summary UI)
  const directReOrder = async (order) => {
    setIsLoadingOrder(true);
    try {
      const response = await getPrescriptionDetailsById(order.orderNumber || order.id); // Use orderNumber if available
      const prescriptionDetails = response?.order || {};
      const images = response?.images || [];
      const items = (response?.items || []).map((item) => ({
        ...item,
        product_name: item.product?.title || "Unnamed Product",
        strength: item.product?.strength,
      }));

      // Enhanced prescription details for display
      const enhancedPrescriptionDetails = {
        ...prescriptionDetails,
        id: order.id,
        orderNumber: `PRSC${String(order.id).padStart(3, "0")}`,
        medicationType: "Pre-sorted",
        created_at: prescriptionDetails.created_at || order.created_at,
        invoice_id: prescriptionDetails.invoice_id || order.order_id,
      };

      // Callback to call backend reOrder
      const onConfirm = async () => {
        const customerId = getCustomerId();
        if (!customerId) throw new Error("Customer ID not found");

        const dataToReorder = {
          order_info: { 
            id: order.id,
            customer_id: customerId 
          },
          presorted: {
            firstName: prescriptionDetails.firstName,
            lastName: prescriptionDetails.lastName,
            email: prescriptionDetails.email,
            phone: prescriptionDetails.phone,
            address: prescriptionDetails.address,
            city: prescriptionDetails.city,
            state: prescriptionDetails.state,
            durationType: prescriptionDetails.durationType,
            durationNumber: prescriptionDetails.durationNumber,
            orderingFor: prescriptionDetails.orderingFor,
            specialInstructions: prescriptionDetails.specialInstructions,
            nonPrescriptionMedicine: prescriptionDetails.nonPrescriptionMedicine,
            patientName: prescriptionDetails.patientName,
            relationToPatient: prescriptionDetails.relationToPatient,
            referringPhysician: prescriptionDetails.referringPhysician,
          },
          prescriptionItems: items.map((it) => ({
            product_id: it.product_id,
            quantity: it.quantity,
            price_pu: it.price_pu || (parseFloat(it.total_price || 0) / parseInt(it.quantity || 1)).toFixed(2),
            total_price: it.total_price,
          })),
          images: images || [],
        };

        const result = await reOrder(order.orderNumber || order.id, dataToReorder); // Use orderNumber if available
        if (!(result && result.status === "success")) {
          throw new Error(result?.message || result?.data?.message || "Failed to reorder");
        }
      };

      showReorderSummarySwal(enhancedPrescriptionDetails, items, onConfirm);
    } catch (error) {
      console.error("Error in directReOrder:", error);
      Swal.fire("Error", "Could not fetch prescription details for re-order.", "error");
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Handle "Renew" from inside modal (calls the same UI but uses selectedOrder)
  const handleRenewOrder = (orderId) => {
    if (!selectedOrder) {
      Swal.fire("Error", "No order selected for re-order.", "error");
      return;
    }

    const prescriptionDetails = {
      ...selectedOrder,
      ...selectedOrder.order_info,
      orderNumber: selectedOrder.order_info?.orderNumber || `PRSC${String(orderId).padStart(3, "0")}`,
      medicationType: "Pre-sorted",
      created_at: selectedOrder.order_info?.created_at || selectedOrder.order_info?.orderDate,
      invoice_id: selectedOrder.invoice_id || selectedOrder.order_info?.order_id,
    };
    const items = selectedOrder.order_detail || [];

    const onConfirm = async () => {
      const customerId = getCustomerId();
      if (!customerId) throw new Error("Customer ID not found");

      const dataToReorder = {
        order_info: { 
          id: orderId,
          customer_id: customerId 
        },
        presorted: {
          firstName: selectedOrder.firstName,
          lastName: selectedOrder.lastName,
          email: selectedOrder.email,
          phone: selectedOrder.phone,
          address: selectedOrder.address,
          city: selectedOrder.city,
          state: selectedOrder.state,
          durationType: selectedOrder.order_info.durationType,
          durationNumber: selectedOrder.order_info.durationNumber,
          orderingFor: selectedOrder.order_info.orderingFor,
          specialInstructions: selectedOrder.order_info.specialInstructions,
          nonPrescriptionMedicine: selectedOrder.nonPrescriptionMedicine,
          patientName: selectedOrder.patientName,
          relationToPatient: selectedOrder.relationToPatient,
          referringPhysician: selectedOrder.referringPhysician,
        },
        prescriptionItems: (selectedOrder.order_detail || []).map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          price_pu: it.price_pu || (parseFloat(it.total_price || 0) / parseInt(it.quantity || 1)).toFixed(2),
          total_price: it.total_price,
        })),
        images: selectedOrder.images || [],
      };

      const result = await reOrder(selectedOrder.orderNumber || orderId, dataToReorder); // Use orderNumber if available
      if (!(result && result.status === "success")) throw new Error(result?.message || "Failed to reorder");
    };

    showReorderSummarySwal(prescriptionDetails, items, onConfirm);
  };

  const handleViewImage = (imgUrl) => {
    Swal.fire({
      html: `<img src="${imgUrl}" crossOrigin="anonymous" style="max-width: 100%; height: auto; border-radius: 10px;">`,
      showConfirmButton: false,
      background: "transparent",
    });
  };

  const handleSaveChanges = async () => {
    const finalData = {
      order_info: selectedOrder?.order_info || {},
      presorted: editedOrder,
      prescriptionItems: prescriptionItems,
    };

    try {
      const response = await editPS_Order(finalData);
      if (response?.status === 200) {
        Swal.fire("Success", "Changes saved successfully.", "success");
        setShowModal(false);
        fetchOrders();
      } else {
        Swal.fire("Error", "Failed to save changes.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to save changes.", "error");
      console.error("Error saving changes:", error);
    }
  };
const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 main">
        <h3 className="mb-0 prescription">Prescription Management</h3>
 <Button
  className="addPrescription"
  onClick={() => navigate("/preSorted-order")}
  style={{
    backgroundColor: "#00969E",
    borderColor: "#00969E",
    color: "#fff",
    width: "155px",
    fontWeight: 400,
    padding: "6px",
    borderRadius: "30px",
    marginTop: "10px"
  }}
>
  Add Prescription
</Button>

      </div>

      <Container className="py-3 prescription-management-container ActiveOrderMain">
        <div className=" orders-header d-flex justify-content-between  mb-4 w-100 ">
          <h4 className="mb-3 mb-md-0 ">Prescription Orders</h4>
          <div className="ActiveOrder d-flex">
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-date" className="btnDateSort">
                Date 
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Today</Dropdown.Item>
                <Dropdown.Item>Last 7 Days</Dropdown.Item>
                <Dropdown.Item>Last 30 Days</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort-by" className="btnDateSort">
                Sort By 
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSort("order_id")}>Order Number</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSort("created_at")}>Order Date</Dropdown.Item>
                {/* <Dropdown.Item onClick={() => handleSort("status")}>Status</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="table-responsive custom-table-container">
          <Table className="order-table">
            <thead>
              <tr>
                <th className="date col-id" style={{ width: '5%' }}>ID</th>
                <th className="date col-order-number" style={{ width: '15%' }}>Order Number</th>
                <th className="date col-order-date" style={{ width: '15%' }}>Order Date</th>
                <th className="date col-physician" style={{ width: '20%' }}>Referring Physician</th>
                <th className="date col-images" style={{ width: '25%' }}>Images</th>
                <th className="date action" style={{ width: '20%', textAlign: 'center !important' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPage ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" /> Loading orders...
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, idx) => (
                  <tr key={order.id}>
                    <td className="num col-id">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="col-order-number">{order.order_id}</td>
                    <td className="col-order-date">
                      {order.created_at || "No Date"}
                    </td>
                    <td className="col-physician">
                      {order.referringPhysician && order.referringPhysician.trim() !== "" 
                        ? order.referringPhysician 
                        : "Not provided"}
                    </td>
                    <td className="col-images">
                      <div className="images-container">
                        {order.images?.length > 0 ? (
                          <>
                            {order.images.slice(0, 3).map((imgUrl, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt={`prescription ${imgIdx + 1}`}
                                crossOrigin="anonymous"
                                className="prescription-thumbnail"
                                onClick={() => handleViewImage(imgUrl)}
                              />
                            ))}
                            {order.images.length > 3 && (
                              <span className="more-images">+{order.images.length - 3}</span>
                            )}
                          </>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2 btn1">
                        <Button
                          size="sm"
                          onClick={() => ViewPrescription(order)}
                          style={{
                            backgroundColor: "#00969E",
                            borderColor: "#00969E",
                            color: "#fff",
                            width: "110px",
                            fontWeight: 500,
                            padding: "8px",
                            borderRadius: "30px",
                          }}
                          className="viewbtn"
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => directReOrder(order)}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#09C6B2",
                            width: "110px",
                            color: "#09C6B2",
                            fontWeight: "bold",
                            padding: "8px 15px",
                            borderRadius: "30px",
                          }}
                          className="re-order"
                        >
                          ReOrder
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Button variant="link" onClick={handlePreviousPage} disabled={currentPage === 1} className="previousbtn">
  <FaChevronLeft size={20} style={{ marginRight: "8px" }} />
Previous
            </Button>

            <div className="d-flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                  return (
                    <Button
                      key={pageNum}
                      variant="link"
                      className={`px-3 py-1 mx-1 text-decoration-none link ${pageNum === currentPage ? "bg-light text-dark" : ""}`}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                } else if ((pageNum === currentPage - 2 && pageNum > 1) || (pageNum === currentPage + 2 && pageNum < totalPages)) {
                  return (
                    <span key={`ellipsis-${pageNum}`} className="px-3 py-1 mx-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button variant="link" onClick={handleNextPage} disabled={currentPage === totalPages} className="Nextbtn">
              Next <FaChevronRight style={{ marginLeft: "14px" }} />
            </Button>
          </div>
        </div>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered className="prescription-detail-modal">
        <Modal.Header closeButton className="">
          <Modal.Title>
            <span className="modal-title" onClick={() => setShowModal(false)} style={{ cursor: "pointer" }}>
              Prescription Management
            </span>{" "}
          <span style={{ margin: "0 10px" }}>&gt;</span>
{selectedOrder?.order_info?.id || "N/A"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-custom">
          {isLoadingOrder ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading details...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
         <div className="detail-column-left p-3 detail-card">
  <div className="d-flex main">

    {/* Order Information Section */}
    <div className="order-section me-5">
      <h4 className="mb-2  detail-section-title mt-3">Order Information</h4>
      <ul className="order-item-row mt-3">
        <li>
          <span className="order-label">Prescription ID:</span>
          <span className="order-value">{selectedOrder?.order_info?.orderNumber || "-"}</span>
        </li>
        <li>
          <span className="order-label">Order Date:</span>
          <span className="order-value">{selectedOrder?.order_info?.orderDate || "-"}</span>
        </li>
        <li>
          <span className="order-label">Number of Duration:</span>
          <span className="order-value">
            {selectedOrder?.order_info?.durationNumber} {selectedOrder?.order_info?.durationType || "-"}
          </span>
        </li>
        <li>
          <span className="order-label">Medication Type:</span>
          <span className="order-value">{selectedOrder?.order_info?.medicationType || "-"}</span>
        </li>
        <li>
          <span className="order-label">Ordering Medication For:</span>
          <span className="order-value">{selectedOrder?.order_info?.orderingFor || "-"}</span>
        </li>
        <li>
          <span className="order-label">Special Instructions:</span>
          <span className="order-value">{selectedOrder?.order_info?.specialInstructions || "-"}</span>
        </li>
      </ul>
           <h5 className="mb-2 detail-section-title  mt-4">Referring Physician</h5>
              
                  <div className="order-item-row">
                  <li>
                     <span className="order-label"> Name:</span> <span  className="order-value">{selectedOrder?.referringPhysician || "-"}</span>
                  </li>
                  </div>
    </div>

    {/* Patient Information Section */}
    <div className="patient-section">
      <h4 className="mb-2  detail-section-title mt-3">Patient Information</h4>
      <ul className="patient-item-row mt-3">
        <li>
          <span className="patient-label">First Name:</span>
          <span className="patient-value">{selectedOrder?.firstName || "-"}</span>
        </li>
        <li>
          <span className="patient-label">Last Name:</span>
          <span className="patient-value">{selectedOrder?.lastName || "-"}</span>
        </li>
        <li>
          <span className="patient-label">Phone:</span>
          <span className="patient-value">{selectedOrder?.phone || "-"}</span>
        </li>
        <li>
          <span className="patient-label">City:</span>
          <span className="patient-value">{selectedOrder?.city || "-"}</span>
        </li>
        <li>
          <span className="patient-label">Province:</span>
          <span className="patient-value">{selectedOrder?.province || "-"}</span>
        </li>
        <li>
          <span className="patient-label">Delivery Address:</span>
          <span className="patient-value">{selectedOrder?.address || "-"}</span>
        </li>
         <li>
          <span className="patient-label" >Email:</span>
          <span className="patient-value">{selectedOrder?.email || "-"}</span>
        </li>
      </ul>
         <h5 className="mb-2 detail-section-title mt-3 mainhead">Patient Relationship Information</h5>
                  
                     
                <div className="order-item-row">
                     <li>
                       <span className="patient-label"> Patient's Name: </span>
                      <span className="patient-value">{selectedOrder?.patientName || "-"}</span>
                   </li>
                     <li>
                       <span className="patient-label">Relation to Patient:</span>
                        <span className="patient-value">  {selectedOrder?.relationToPatient || "-"}</span>
                     </li>
                </div>
    </div>

  </div>

  {/* Patient Relationship Info */}
  {selectedOrder?.order_info?.orderingFor?.toLowerCase() === "someoneelse" && (
    <>
      <h5 className="mb-3 detail-section-title mainhead">Patient Relationship Information</h5>
      <Card className="p-3 shadow-sm detail-card mb-4">
        <p>
          <strong>Patient's Name:</strong> {selectedOrder?.patientName || "-"}
        </p>
        <p>
          <strong>Relation to Patient:</strong> {selectedOrder?.relationToPatient || "-"}
        </p>
      </Card>
    </>
  )}

  {/* Non-Prescription Medicines */}
  {selectedOrder?.nonPrescriptionMedicine && selectedOrder.nonPrescriptionMedicine.trim() !== "" && (
    <>
      <h5 className="mb-3 detail-section-title">Non-Prescription Medicines</h5>
      <div className="p-3  mb-4">
        <h6>{selectedOrder.nonPrescriptionMedicine}</h6>
      </div>
    </>
  )}
   <h5 className="mb-3 detail-section-title mainhead">Uploaded Prescription Images</h5>
                <div className="d-flex flex-column gap-3 image-display-area">
                  {selectedOrder?.images?.length > 0 ? (
                    selectedOrder.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Prescription ${idx + 1}`}
                        crossOrigin="anonymous"
                
                        className="uploaded-prescription-image"
                        onClick={() => handleViewImage(imgUrl)}
                      />
                    ))
                  ) : (
                    <Card className="p-3 shadow-sm text-center">No images uploaded.</Card>
                  )}
                </div>

                <h5 className="mt-5 mb-3 detail-section-title ms-3">Prescription Items</h5>
                
                <div className="p-3 item-table-card">
                  <Table responsive className="items-table-modal">
                    <thead>
                      <tr>
                        <th>No</th>
                        {/* <th>Product ID</th> */}
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price PU</th>
                        <th>Total Price</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder?.order_detail?.length > 0 ? (
                        selectedOrder.order_detail.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            {/* <td>{item.product_id || "-"}</td> */}
                            <td>{item.product_name || item.product?.title || "-"}</td>
                            <td>{item.quantity}</td>
                            <td>{parseFloat(item.pricePerUnit || item.price_pu || 0).toFixed(2)}</td>
                            <td>{parseFloat(item.totalPrice || item.total_price || 0).toFixed(2)}</td>
                            {/* <td>-</td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No Prescription Items Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
     <div className="buttons">
                           <Button className="reorder" onClick={() => handleRenewOrder(selectedOrder?.order_info?.id)} 
              style={{
                            backgroundColor: "transparent",
                            borderColor: "#09C6B2",
                            width: "110px",
                            color: "#09C6B2",
                            fontWeight: "bold",
                            padding: "8px 15px",
                            borderRadius: "30px",
              marginRight:"10px"
                          }}>
            Re-Order
          </Button> 
                   <Button variant="secondary" onClick={() => setShowModal(false)} className="modal-close-btn"
                       style={{
                            backgroundColor: "transparent",
                            borderColor: "#000000ff",
                            width: "110px",
                            color: "#000000ff",
                            fontWeight: "bold",
                            padding: "8px 15px",
                            borderRadius: "30px",
                        
                          }}>
                            
            Close
          </Button>
     </div>

</div>


         
          
            
            </Row>
          )}
        </Modal.Body>

       
      </Modal>
    </>
  );
};

export default PrescriptionManagement;
