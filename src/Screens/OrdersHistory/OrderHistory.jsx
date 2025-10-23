import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { sendOrderEmail, cancelOrder } from "../../services/HistoryOrder";
import Swal from "sweetalert2";
import "./OrderHistory.css";

import Images from "../../assets/Images";
import Footer from "../../Components/Footer";

import { useSelector } from "react-redux";
import SMNavbar from "../../Components/SMNavbar";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  // const otpEmail = localStorage.getItem("otpEmail");
  const navigate = useNavigate();
  const otpEmail = useSelector((state) => state.email.email); // Access email state
  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await sendOrderEmail(otpEmail);
        setOrders(response);

        // Filter orders by their status
        setNewOrders(response.filter((order) => order.status === "New"));
        setCancelledOrders(
          response.filter((order) => order.status === "cancelled")
        );
        setApprovedOrders(
          response.filter((order) => order.status === "Approved")
        );
      } catch (error) {
        // console.error('Error fetching orders:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch orders. Please try again later.",
        });
      }
    };

    fetchOrders();
  }, []);

  // Handle cancel
  const handleCancelOrder = async (orderId) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#00909D",
        confirmButtonText: "Yes, cancel it!",
      });

      if (confirm.isConfirmed) {
        const response = await cancelOrder(order.orderNumber || orderId); // Updated to use orderNumber if available
        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

        // Update the lists after cancellation
        setNewOrders(newOrders.filter((order) => (order.orderNumber || order.id) !== (orderId))); // Updated to use orderNumber if available

        const updatedOrder = {
          ...response,
          id: orderId,
          orderNumber: order.orderNumber || orderId, // Ensure orderNumber is preserved
          updated_at: response.updated_at || new Date().toISOString(), // Handle missing updated_at
          cancelledBy: "Customer",
        };

        setCancelledOrders((prev) => [...prev, updatedOrder]);
      }
    } catch (error) {
      if (error.response?.data?.message === "Order is already cancelled.") {
        Swal.fire({
          icon: "info",
          title: "Already Cancelled",
          text: "This order has already been cancelled.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to cancel the order. Please try again later.",
        });
      }
    }
  };

  // Handle the back button functionality
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate("/preSorted-order");
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return (
    <>
      <SMNavbar />
      <div className="row overflow-hidden">
        <img className="h-25" src={Images.NonSortedBg} alt="logo" loading="lazy" width="400" height="200" />
      </div>
      <div className="gradient-background">
        <Container className="order-history-container">
          <div className="d-flex mt-5 flex-column justify-content-center text-center">
            <div>
              <h1 className="fs-2 pt-2 fw-bold">Order History</h1>
            </div>
          </div>

          {/* New Orders Table */}
          <h5 className="mt-5 fs-6">NEW ORDERS</h5>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>S#</th>
                <th>Order No.</th>
                <th>Placed On</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {newOrders.length > 0 ? (
                newOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{order.created_at}</td>
                    <td>{order.address}</td>
                    <td>
                      <Button
                        className="Cancelbtn"
                        onClick={() => handleCancelOrder(order.orderNumber || order.id)} // Updated to use orderNumber if available
                      >
                        Cancel Order
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No New orders
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Approved Orders Table */}
          <h5 className="mt-4 fs-6">APPROVED ORDERS</h5>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>S#</th>
                <th>Order No.</th>
                <th>Placed On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedOrders.length > 0 ? (
                approvedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{order.created_at}</td>
                    <td>{order.status || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Approved orders
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Cancelled Orders Table */}
          <h5 className="mt-4 fs-6">CANCELLED ORDERS</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S#</th>
                <th>Order No.</th>
                <th>Cancelled On</th>
                <th>Cancelled By</th>
              </tr>
            </thead>
            <tbody>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{order.updated_at || "N/A"}</td>
                    <td>{order.cancelledBy || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No cancelled orders
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
        <Footer />
      </div>
    </>
  );
}
