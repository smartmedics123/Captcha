import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import phone from "../assets/phone.png";
import mail from "../assets/mail.png";
import CustomNavbar from "../Components/Navbar/CustomNavbar";

import images from "../assets/Images";
import SMNavbar from "../Components/SMNavbar";
import { getCloudinaryUrl } from "../utils/cdnImage";

export default function CancelationPolicy() {
  return (
    <>
      <SMNavbar />
      {/* CANCELLATION POLICY HEADER -------------------------------- */}
      <Container fluid className="position-relative p-0 align-content-center">
        {/* Image Section */}
        <Row className="m-0">
          <Col xs={12} className="p-0">
            <Image
              src={images.cancel}
              alt="Terms and Conditions"
              fluid
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </Col>
        </Row>

        {/* Text Section */}
        <Row
          className="position-absolute start-0 ms-1 mt-5"
          style={{ top: "20%" }}
        >
          <Col xs={12} md={6}>
            <div
              style={{
                color: "white",
                borderLeft: "5px solid #00909D",
                // paddingLeft: '15px',
              }}
              className="text-center text-md-start ps-2 mt-5 "
            ></div>
          </Col>
        </Row>
      </Container>

      {/* CONTACT INFORMATION -------------------------------- */}
      <Container fluid className="overflow-hidden">
        <Row>
          <Col
            xs={12}
            md={5}
            style={{ backgroundColor: "#F3F8FE" }}
            className="pt-5 ms-5"
          >
            <Row className="">
              <h1 style={{ color: "#00909D" }}>Contact Information</h1>
              <p>
                For any inquiries or to initiate cancellation, please contact
                our customer support team at:
              </p>
            </Row>
            <Row className=" pt-3">
              <Col xs={12}>
                <h5 style={{ color: "#00909D" }}>Customer Support Number:</h5>
                <div
                  className="d-flex align-items-center p-2"
                  style={{ overflow: "hidden" }}
                >
                  <img
                    src={getCloudinaryUrl('phone.png')}
                    alt="Phone"
                    className="img-fluid me-2"
                    style={{ maxWidth: "24px" }}
                  />
                  <span className="">123-456-788</span>
                </div>
              </Col>
            </Row>
            <Row className=" pt-3">
              <Col xs={12}>
                <h5 style={{ color: "#00909D" }}>Customer Support Email:</h5>
                <div
                  className="d-flex align-items-center p-2"
                  style={{ overflow: "hidden" }}
                >
                  <img
                    src={getCloudinaryUrl('mail.png')}
                    alt="Email"
                    className="img-fluid me-2"
                    style={{ maxWidth: "24px" }}
                  />
                  <span className="">contact@smartmedics..pk</span>
                </div>
              </Col>
            </Row>
          </Col>

          {/* CANCELLATION POLICY DETAILS -------------------------------- */}
          <Col xs={10} md={6} className="pt-5 ms-5 over">
            <Row className="">
              <h1 style={{ color: "#00909D" }}>Cancellation Policy</h1>
            </Row>
            <Row className="">
              <Col xs={12}>
                <div className="mb-4">
                  <h5 className="fw-bold">Cancellation Deadline:</h5>
                  <p>
                    You must contact our customer service support within 2 hours
                    after placing your order to request cancellation.
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="">
              <Col xs={12}>
                <div className="mb-4">
                  <h5 className="fw-bold">Dispatch Condition:</h5>
                  <p>Once the order is dispatched, it cannot be canceled.</p>
                </div>
              </Col>
            </Row>
            <Row className="">
              <Col xs={12}>
                <div className="mb-4">
                  <h5 className="fw-bold">Cancellation Process:</h5>
                  <p>
                    Contact our customer service support to initiate the
                    cancellation process. Please provide your order details for
                    verification.
                  </p>
                </div>
              </Col>
            </Row>

            {/* ACTION BUTTONS -------------------------------- */}
            <Row className="text-center mb-5">
              <Col xs={12} className="mb-3">
                <Button
                  className="btn rounded-5 w-100"
                  style={{ backgroundColor: "#00909D" }}
                >
                  Cancel Plan
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  className="btn rounded-5 w-100"
                  style={{
                    backgroundColor: "white",
                    color: "#00909D",
                    borderColor: "#00909D",
                  }}
                >
                  Go Back
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}
