import React from "react";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import PrivacyPolicy from "../assets/Images/PrivacyPolicy.png";
import { IoMdMail } from "react-icons/io";
import { PiPhoneCallFill } from "react-icons/pi";
import useIsMobile from "../utils/useIsMobile";
import images from "../assets/Images";
import { getCloudinaryUrl } from "../utils/cdnImage";

function PrivacyPolicy2() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? images.PrivacyPolicyMobile : images.PrivacyPolicy}
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-5">
        <h4>Privacy Policy</h4>
        <p className="text-muted mb-4">
          Smart Medics is committed to protecting your privacy and ensuring the
          security of your personal information. This Privacy Policy outlines
          how we collect, use, disclose, and protect your information when you
          use our services.
        </p>
        <h4>Information We Collect</h4>
        <p className="text-muted mb-4">
          We may collect the following types of information
        </p>
        <ul className="list-unstyled">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Personal Information:</p>
            <div className="text-muted">
              Name, contact information (address, email address, phone number),
              date of birth, and any other information you provide when placing
              an order or contacting customer support.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Medical Information:</p>
            <div className="text-muted">
              Information related to your prescriptions, medical conditions, and
              health history, as necessary for fulfilling orders and providing
              pharmacy services.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Usage Information:</p>
            <div className="text-muted">
              Information about how you use our website or mobile app, including
              IP address, browser type, and device information.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Payment Information:</p>
            <div className="text-muted">
              Credit card details or other payment information used for
              transactions.
            </div>
          </li>
        </ul>
        <h4 className="mt-5">Information Sharing</h4>
        <p className="text-muted mb-4">
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described below:
        </p>
        <ul className="list-unstyled">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Service Providers:</p>
            <div className="text-muted">
              We may share your information with trusted service providers who
              assist us in operating our website, conducting our business, or
              servicing you.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Medical Information:</p>
            <div className="text-muted">
              We may disclose your information when required by law, to enforce
              our site policies, or to protect our rights, property, or safety
              or that of others.
            </div>
          </li>
        </ul>
        <h4 className="mt-5">Data Security</h4>
        <p className="text-muted mb-4">
          We implement a variety of security measures to maintain the safety of
          your personal information when you place an order or enter, submit, or
          access your personal information.
        </p>
        <h4 className="mt-3">Your Choices</h4>
        <p className="text-muted mb-4">
          You can update your personal information and communication preferences
          by contacting us using the information provided below.
        </p>
        <h4 className="mt-3">Changes to the Privacy Policy</h4>
        <p className="text-muted mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on our website.
        </p>
        <h4 className="mt-3">Contact Us</h4>
        <p className="text-muted mb-4">
          If you have any questions about this Privacy Policy or our practices,
          please contact us at
        </p>

        <div className="d-block d-md-flex align-items-center gap-3 py-3">
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
                <PiPhoneCallFill  />
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

export default PrivacyPolicy2;
