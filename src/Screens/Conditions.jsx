import React from "react";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import { IoMdMail } from "react-icons/io";
import { PiPhoneCallFill } from "react-icons/pi";
import { getCloudinaryUrl } from "../utils/cdnImage";
import useIsMobile from "../utils/useIsMobile";

function Conditions() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? getCloudinaryUrl('ConditionsMobile.png') : getCloudinaryUrl('Conditions.png', 1600)}
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-5">
        <h4>Terms and Conditions</h4>
        <p className="text-muted mb-4">
          These Terms and Conditions ("Terms") govern your use of Smart Medics'
          website, mobile application, and services. By accessing or using our
          services, you agree to be bound by these Terms. If you do not agree
          with any part of these Terms, please do not use our services.
        </p>
        <h4 className="fw-medium mb-3">Use of Services</h4>
        <ul className="list-unstyled mb-5">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Medical Service</p>
            <div className="text-muted">
              Smart Medics provides online pharmacy services for ordering
              medications and healthcare products.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Account Registration</p>
            <div className="text-muted">
              You may need to create an account to access certain features of
              our services. You agree to provide accurate and complete
              information during registration.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Ordering and Payment</p>
            <div className="text-muted">
              You agree to pay for all orders placed through our website/mobile
              app and cash on delivery. Prices for medications and products are
              subject to change without notice.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Delivery</p>
            <div className="text-muted">
              We aim to deliver orders promptly within the specified timeframe
              and to the delivery address provided. Delivery times may vary
              depending on availability and location.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Intellectual Property</p>
            <div className="text-muted">
              The content on our website and mobile app, including text,
              graphics, logos, and images, is the property of Smart Medics and
              protected by copyright laws.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Privacy</p>
            <div className="text-muted">
              Your use of our services is also governed by our Privacy Policy.
              By using our services, you consent to the collection, use, and
              sharing of your information as described in the Privacy Policy.
            </div>
          </li>
        </ul>
        <h4 className="fw-medium mb-3">Limitation of Liability</h4>
        <ul className="list-unstyled mb-5">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Disclaimer:</p>
            <div className="text-muted">
              Smart Medics provides its services on an "as-is" and
              "as-available" basis. We make no warranties or representations
              about the accuracy or completeness of the information provided.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Limitation of Liability:</p>
            <div className="text-muted">
              In no event shall Smart Medics be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              out of or related to your use of our services.
            </div>
          </li>
        </ul>
        <h4 className="fw-medium mb-3">Termination</h4>
        <ul className="list-unstyled mb-5">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Termination:</p>
            <div className="text-muted">
              Smart Medics reserves the right to terminate or suspend your
              access to our services at any time, without prior notice, for any
              reason or no reason.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Effect of Termination:</p>
            <div className="text-muted">
              Upon termination, you will no longer have access to your account
              and any outstanding orders may be canceled.
            </div>
          </li>
        </ul>
        <h4 className="fw-medium mb-3">Changes of Terms</h4>
        <ul className="list-unstyled mb-5">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Modification:</p>
            <div className="text-muted">
              Smart Medics reserves the right to modify these Terms at any time.
              We will notify you of any changes by posting the updated Terms on
              our website or mobile app.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Continued Use:</p>
            <div className="text-muted">
              Your continued use of our services after the posting of revised
              Terms constitutes your acceptance of the changes.
            </div>
          </li>
        </ul>
        <h4 className="fw-medium mb-3">Governing Law</h4>
        <ul className="list-unstyled mb-5">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Jurisdiction:</p>
            <div className="text-muted">
              These Terms shall be governed by and construed in accordance with
              the laws of Pakistan.
            </div>
          </li>
        </ul>
        <h4>Contact Us</h4>
        <p className="text-muted mb-4">
          If you have any questions about this Privacy Policy or our practices,
          please contact us at:
        </p>
        <div className="d-block d-md-flex align-items-center gap-3 py-3 mb-4">
          <div className="shadow py-3 privacy-bottom-card px-4 rounded-4 ">
            <p className="text-primary fs-6 mb-2 fw-medium">
              Customer Support Email
            </p>
            <p className="mb-0">
              <span className="text-primary ">
                <IoMdMail />
              </span>{" "}
              contact@smartmedics..pk
            </p>
          </div>
          <div className="shadow py-3 privacy-bottom-card px-4 rounded-4 mt-4 mt-md-0">
            <p className="text-primary fs-6 mb-2 fw-medium">
              Customer Support Phone
            </p>
            <p className="mb-0">
              <span className="text-primary ">
                <PiPhoneCallFill />
              </span>{" "}
             +923268352132
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Conditions;
