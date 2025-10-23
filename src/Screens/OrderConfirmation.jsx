import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { getCloudinaryUrl } from "../utils/cdnImage";

export default function OrderConfirmation() {
  const location = useLocation();
  const {
    orderId,
    cartItems,
    firstName,
    lastName,
    email,
    phone,
    address,
  } = location.state;

  const printRef = useRef();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };
  const orderDate = formatDate(new Date());

  // ✅ Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const grandTotal = subtotal;

  // useEffect(() => {
  //   const generatePDF = async () => {
  //     const element = printRef.current;

  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       useCORS: true,
  //       backgroundColor: "#ffffff",
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //    pdf.addImage(imgData, "PNG", 0, 5, pdfWidth, pdfHeight); 

  //     pdf.save("order-confirmation.pdf");
  //   };

  //   generatePDF();
  // }, [cartItems]);

  return (
    <Container className="mt-5" ref={printRef}>
      {/* Header */}
      <Row className="align-items-center">
        <Col xs={6}>
          <img
            src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1758095036/Frame_1686557505.png"
            alt="Smart Medics Logo"
            style={{ width: "240px", height: "55px" }}
          />
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <img
            src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1758096207/Rectangle_34624158.png"
            alt="Smart Medics Shape"
            style={{ width: "289px", height: "45px" }}
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="pt-3">
        <Col xs={12}>
          <div
            className="p-4 rounded shadow-sm"
            style={{ border: "1px solid #e0e0e0", borderRadius: "28px" }}
          >
            <Row>
              <Col xs={12} md={6}>
                <h6 className=" fw-bold mb-3">Customer Details</h6>
                <p>Name: {firstName} {lastName}</p>
                <p>Email: {email}</p>
                <p>Contact: {phone}</p>
                <p>Address: {address}</p>
              </Col>
              <Col xs={12} md={6} className="text-md-end mt-4 mt-md-0">
                <p>Invoice Number:{orderId}</p>
                <p>Order Date: {orderDate}</p>
                <p>Tracking ID: {orderId}</p>
              </Col>
            </Row>

            <div
              className="mt-4 mb-2 text-white px-3 py-2"
              style={{ background: "linear-gradient(90deg, #00B5B8, #00909D)" }}
            >
              Order Summary
            </div>

            {/* Order Summary Table */}
            <Table responsive className="align-middle" borderless>
              <thead>
                <tr style={{ borderBottom: "2px solid #E8E8E8" }}>
                  <th className="text-start">Product Name</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Price</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="text-start">{item.pname}</td>
                    <td className="text-center">
                      Qty {String(item.quantity).padStart(2, '0')}{(item.displayType || item.type) ? ` ${item.displayType || item.type}` : ''}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}

                <tr style={{ borderTop: "2px solid #E8E8E8" }}>
                  <td colSpan="2" className="text-start">Subtotal:</td>
                  <td className="text-end">{formatCurrency(subtotal)}</td>
                </tr>

                <tr>
                  <td colSpan="2" className="text-start">Delivery Charges:</td>
                  <td className="text-end">
                    <span style={{ textDecoration: 'line-through', color: '#999' }}>
                      Rs 150.00
                    </span>
                    <span className="ms-2 text-success fw-bold">Rs 0.00</span>
                  </td>
                </tr>

                <tr style={{ borderTop: "2px solid #E8E8E8" }}>
                  <td colSpan="2" className="fw-bold text-start">Grand Total:</td>
                  <td className="text-end fw-bold">{formatCurrency(grandTotal)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Card.Text className="mt-3 fs-6" style={{ color: "#00909D" }}>
        Thank you for your order.
      </Card.Text>

      {/* Footer */}
      <Row>
        <Col xs={12}>
          <img
            src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1758097417/Frame_1686557854.png"
            className="img-fluid w-100 mb-5"
            alt="Order Footer"
          />
        </Col>
      </Row>
    </Container>
  );
};