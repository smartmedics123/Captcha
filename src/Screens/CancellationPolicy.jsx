import React from "react";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import PrivacyPolicy from "../assets/Images/CancellationPolicy.png";
import { IoMdMail } from "react-icons/io";
import { PiPhoneCallFill } from "react-icons/pi";
import { getCloudinaryUrl } from "../utils/cdnImage";
import useIsMobile from "../utils/useIsMobile";

function CancellationPolicy() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? getCloudinaryUrl('CancellationPolicyMobile.png') : getCloudinaryUrl('CancellationPolicy.png', 1600)}
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-5">
        <h4 className="mb-3">Cancellation Policy</h4>

        <ul className="list-unstyled">
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Cancellation Deadline:</p>
            <div className="text-muted">
              You must contact our customer service support within 2 hours after
              placing your order to request cancellation.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Dispatch Condition:</p>
            <div className="text-muted">
              Once the order is dispatched, it cannot be canceled.
            </div>
          </li>
          <li className="mb-3">
            <p className="ms-3 fs-5 fw-medium">• Cancellation Process:</p>
            <div className="text-muted">
              Contact our customer service support to initiate the cancellation
              process. Please provide your order details for verification.
            </div>
          </li>
        </ul>

        <h4 className="mt-3">Contact Information</h4>
        <p className="text-muted mb-4">
          For any inquiries or to initiate cancellation, please contact our
          customer support team at:
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

export default CancellationPolicy;
