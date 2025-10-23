import React from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Footer from "../Components/Footer";
import vector from "../assets/Vector.png";
import SMNavbar from "../Components/SMNavbar";
import images from "../assets/Images";
import useIsMobile from "../utils/useIsMobile";
import { getCloudinaryUrl } from "../utils/cdnImage";

export default function PrivacyPolicy() {
  const isMobile = useIsMobile();

  return (
    <>
      <SMNavbar />
      {/* PRIVACY POLICY-------------------------------- */}
      <Container fluid className="position-relative p-0 align-content-center">
        {/* Image Section */}
        <Row className="m-0">
          <Col xs={12} className="p-0">
            <Image
              src={isMobile ? images.PrivacyPolicyMobile : images.PrivacyPolicy}
              alt="PrivacyPolicy"
              fluid
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </Col>
        </Row>

        {/* Text Section */}
        <Row
          className="position-absolute start-0 ms-1 mt-5 "
          style={{ top: "20%" }}
        >
          {/* <Col xs={12} md={6}>
            <div
              style={{
                color: " white",
                borderLeft: "5px solid #00909D",
                // paddingLeft: '15px',
              }}
              className="text-center text-md-start ps-2 "
            >
              <h1
                style={{
                  lineHeight: '1.2',
                  // fontSize: '2.5rem',
                }}
                className="display-4 fs-1"
              >
                Privacy <br /> Policy
              </h1>
            </div>
          </Col> */}
        </Row>
      </Container>
      {/* ---------------------------------------- */}
      <Container fluid>
        <Row className=" mt-1 d-md-flex justify-content-md-center'">
          <Col xs={12}>
            <Row className="p-4">
              <p className="fs-3">
                Smart Medics is committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy outlines how we collect, use, disclose, and protect your
                information when you use our services.
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
      {/* Information We Collect-------------------------- */}
      <Container fluid>
        <Row className="px-3 px-md-5">
          <h2 style={{ color: "#00909D" }}>Information We Collect</h2>
          <p className="pt-2">
            We may collect the following types of information
          </p>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={getCloudinaryUrl('Vector.png')} className="img-fluid" />
              <h5 className="px-3 fw-bold">Personal Information:</h5>
            </div>
            <p className="px-3">
              Name, contact information (address, email address, phone number),
              date of birth, and any other information you provide when placing
              an order or contacting customer support.
            </p>
          </Col>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={getCloudinaryUrl('Vector.png')} className="img-fluid" />
              <h5 className="px-3 fw-bold">Medical Information:</h5>
            </div>
            <p className="px-3">
              Information related to your prescriptions, medical conditions, and
              health history, as necessary for fulfilling orders and providing
              pharmacy services.
            </p>
          </Col>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={getCloudinaryUrl('Vector.png')} className="img-fluid" />
              <h5 className="px-3 fw-bold">Usage Information:</h5>
            </div>
            <p className="px-3">
              Information about how you use our website or mobile app, including
              IP address, browser type, and device information.
            </p>
          </Col>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={getCloudinaryUrl('Vector.png')} className="img-fluid" />
              <h5 className="px-3 fw-bold">Payment Information:</h5>
            </div>
            <p className="px-3">
              Credit card details or other payment information used for
              transactions.
            </p>
          </Col>
        </Row>
      </Container>
      {/* Information Sharing-------------------------- */}
      <Container fluid className="pt-4">
        <Row className="px-3 px-md-5">
          <h2 style={{ color: "#00909D" }}>Information Sharing</h2>
          <p className="pt-2">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described below:
          </p>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={getCloudinaryUrl('Vector.png')} className="img-fluid" />
              <h5 className="px-3 fw-bold">Service Providers:</h5>
            </div>
            <p className="px-3">
              We may share your information with trusted service providers who
              assist us in operating our website, conducting our business, or
              servicing you.
            </p>
          </Col>
        </Row>
        <Row xs={12} className="px-3 px-md-5">
          <Col className="px-0">
            <div className="d-flex align-items-start p-2">
              <img alt="img" src={vector} className="img-fluid" />
              <h5 className="px-3 fw-bold">Medical Information:</h5>
            </div>
            <p className="px-3">
              We may disclose your information when required by law, to enforce
              our site policies, or to protect our rights, property, or safety
              or that of others.
            </p>
          </Col>
        </Row>
      </Container>
      {/* Additional Sections */}
      <Container fluid className="pt-4">
        <Row className="px-3 px-md-5">
          <h3 style={{ color: "#00909D" }}>Data Security</h3>
          <p className="pt-2">
            We implement a variety of security measures to maintain the safety
            of your personal information when you place an order or enter,
            submit, or access your personal information.
          </p>
        </Row>
        <Row className="px-3 px-md-5">
          <h3 style={{ color: "#00909D" }}>Your Choices</h3>
          <p className="pt-2">
            You can update your personal information and communication
            preferences by contacting us using the information provided below.
          </p>
        </Row>
        <Row className="px-3 px-md-5">
          <h3 style={{ color: "#00909D" }}>Changes to the Privacy Policy</h3>
          <p className="pt-2">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on our website.
          </p>
        </Row>
        <Row className="px-3 px-md-5">
          <h3 style={{ color: "#00909D" }}>Contact Us</h3>
          <p className="pt-2">
            If you have any questions about this Privacy Policy or our
            practices, please contact us at
          </p>
          <h4 className="pt-1">Customer Support Email:</h4>
          <p>contact@smartmedics..pk</p>
          <h4 className="pt-1">Customer Support Phone:</h4>
          <p>123-456-789</p>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
