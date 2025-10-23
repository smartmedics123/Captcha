import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Dropdown } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipientOrders } from "../../../services/CustomerDashboard/receiptProfile";
import Swal from "sweetalert2";
import { reOrder } from "../../../services/HistoryOrder";
import { getCustomerId } from "../../../utils/CustomerId";

import LoadingSpinner from "../../../Components/Spinner/LoadingSpinner";

function RecipientOrders() {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [recipientName, setRecipientName] = useState("");
  const [loader, setLoader] = useState(false);
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
          // Construct minimal payload for reOrder API (recipient orders table has limited info)
          const customerId = getCustomerId();
          const dataToReorder = {
            order_info: { customer_id: customerId },
            presorted: {
              address: order.address,
              // Add more fields if available in 'order' object
            },
            prescriptionItems: [], // No items in this context
            images: []
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

  useEffect(() => {
    const loadOrders = async () => {
      setLoader(true);
      try {
        const { orders, recipientName, totalPages } = await fetchRecipientOrders(recipientId, page);
        setOrders(orders);
        setRecipientName(recipientName);
        setTotalPages(totalPages);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoader(false);
      }
    };
    loadOrders();
  }, [recipientId, page]);

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" style={{cursor:'pointer'}} onClick={() => navigate(-1)}>Recipient Profile</li>
              <li className="breadcrumb-item active" aria-current="page">{recipientName}</li>
            </ol>
          </nav>
          <h3 className="fw-bold mb-3">{recipientName} Recipient Orders</h3>
        </Col>
        <Col xs="auto">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary">Date</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Newest</Dropdown.Item>
              <Dropdown.Item>Oldest</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">Sort By</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Order Number</Dropdown.Item>
              <Dropdown.Item>Medication Type</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      {loader ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="bg-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Address</th>
                <th>Medication Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No orders found.</td></tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{(page-1)*10 + idx + 1}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.address}</td>
                    <td>{order.medicationType}</td>
                    <td>
                      <Button variant="info" className="me-2" style={{background:'#16b1b1', border:'none', color:'#fff'}}>View</Button>
                      <Button
                        variant="outline-info"
                        disabled={reorderingId === order.id}
                        onClick={() => handleReOrder(order)}
                      >
                        {reorderingId === order.id ? 'Re-Ordering...' : 'Re-Order'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button disabled={page === 1} onClick={() => setPage(page-1)}>&lt; Previous</Button>
        <div>
          {Array.from({length: totalPages}, (_, i) => i+1).slice(Math.max(0, page-3), page+2).map(num => (
            <Button key={num} variant={num===page ? 'primary' : 'outline-primary'} className="mx-1" onClick={() => setPage(num)}>{num}</Button>
          ))}
        </div>
        <Button disabled={page === totalPages} onClick={() => setPage(page+1)}>Next &gt;</Button>
      </div>
    </Container>
  );
}

export default RecipientOrders;
