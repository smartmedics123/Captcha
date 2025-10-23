import React from "react";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import PrivacyPolicy from "../assets/Images/DeliveryPolicy.png";
import { IoMdMail } from "react-icons/io";
import { PiPhoneCallFill } from "react-icons/pi";
import { getCloudinaryUrl } from "../utils/cdnImage";
import useIsMobile from "../utils/useIsMobile";

function DeliveryPolicy() {
  const isMobile = useIsMobile();
  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? getCloudinaryUrl('DeliveryPolicyMobile.png') : getCloudinaryUrl('DeliveryPolicy.png', 1600)}
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-5">
        <h4>Delivery Policy</h4>
        <p className="text-muted mb-4">
          At Smart Medics, we are committed to providing timely and reliable
          delivery services to our customers. We offer two levels of delivery
          service to cater to your needs, whether you require pre-sorted
          medication or regular medication/non-sorted medication. Our goal is to
          ensure that your medications are delivered promptly and securely.
        </p>
        <h4 className="fw-medium mb-4">• Pre-Sorted Medication:</h4>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="fw-medium">• Delivery Time in Karachi: </span>
            <span className="text-muted"> Within 24 hours.</span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">
              • Delivery Time Outside the Karachi in 3-5 days business days.
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">• Service Description:  </span>
            <span className="text-muted">
              Regular medications are delivered promptly within 1-2 hours of
              placing your order. This service ensures that you receive your
              medications as quickly as possible.
            </span>
          </li>
        </ul>
        <h4 className="fw-medium mb-4">• Regular Medication (Non-Sorted):</h4>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="fw-medium">• Delivery Time in Karachi:  </span>
            <span className="text-muted">Within 1-2 hours.</span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">
              • Delivery Time Outside the Karachi in 3-5 days business days.
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">• Service Description:  </span>
            <span className="text-muted">
              Regular medications are delivered promptly within 1-2 hours of
              placing your order. This service ensures that you receive your
              medications as quickly as possible.
            </span>
          </li>
        </ul>
        <h3 className="fw-medium mb-4">Delivery Areas</h3>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="fw-medium">• Service Area:  </span>
            <span className="text-muted">
              Currently, our delivery service is available only within Karachi
            </span>
          </li>
        </ul>
        <h3 className="fw-medium mb-4">Delivery Fees</h3>
        <p className="mb-2 fw-medium">Orders within Karachi</p>
        <ul className="list-unstyled ps-2 mb-2">
          <li className="">
            <span className=" text-muted">
              • Order Value below Rs. 3000: Rs. 200 delivery fees.{" "}
            </span>
          </li>
          <li className="">
            <span className=" text-muted">
              • Order Value Rs. 3000 and above: Free delivery.{" "}
            </span>
          </li>
        </ul>
        <p className="mb-2 fw-medium">Orders outside Karachi</p>
        <ul className="list-unstyled ps-2 mb-4">
          <li className="">
            <span className=" text-muted">
              • Order Weight below 0.5 kg: Rs. 250 delivery fees.
            </span>
          </li>
          <li className="">
            <span className=" text-muted">
              • Order Weight 0.5 kg and above: Rs. 250 delivery fees plus Rs.
              270 for each additional kilogram over 0.5 kg.
            </span>
          </li>
        </ul>

        <h4>Unsuccessful Deliveries</h4>
        <p className="text-muted mb-4">
          If our delivery team is unable to deliver your order due to an
          incorrect address or unavailability, additional delivery charges may
          apply for redelivery.
        </p>
        <h3 className="fw-medium mb-3">Additional Information</h3>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="fw-medium">• Order Tracking:  </span>
            <span className="text-muted">
              Once your order is placed, you will receive a confirmation email
              with tracking details. You can monitor the status of your delivery
              in real-time
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">• Delivery Hours:  </span>
            <span className="text-muted">
              Our delivery services operate from 10 AM to 6 PM, seven days a
              week. Orders placed outside these hours will be processed the next
              business day.
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-medium">• Contactless Delivery: </span>
            <span className="text-muted">
               In light of health and safety concerns, we offer contactless
              delivery options. Our delivery personnel will leave your package
              at your doorstep and notify you upon arrival.
            </span>
          </li>
        </ul>

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

        <h3 className="fw-medium mb-3">Cancellation</h3>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="fw-medium">• Cancellation:  </span>
            <span className="text-muted">
              You must contact our customer service support within 2 hours after
              the order has been placed. Once the order is dispatched, you can’t
              cancel it.
            </span>
          </li>
        </ul>
        <h3 className="fw-medium mb-3">Terms and Conditions</h3>
        <ul className="list-unstyled mb-4">
          <li className="mb-3">
            <span className="text-muted">
              • Smart Medics reserves the right to modify delivery times and
              fees based on operational requirements and market conditions.{" "}
            </span>
          </li>
          <li className="mb-3">
            <span className="text-muted">
              • Delivery fees are non-refundable once the order has been
              dispatched.
            </span>
          </li>
          <li className="mb-3">
            <span className="text-muted">
              • Smart Medics is not responsible for any delays caused by
              unforeseen circumstances such as extreme weather conditions,
              natural disasters, or other events beyond our control.
            </span>
          </li>
          <li className="mb-3">
            <span className="text-muted">
              • By using Smart Medics' delivery services, you agree to adhere to
              the terms and conditions outlined in this policy. Thank you for
              choosing Smart Medics for your medication needs.
            </span>
          </li>
        </ul>
      </div>

      <Footer />
    </div>
  );
}

export default DeliveryPolicy;
