import React, { useState } from "react";
import PrivacyPolicy from "../assets/Images/CustomerSupport.png";
import illustration from "../assets/Images/contact-illustration.svg";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMdMail } from "react-icons/io";
import Facebook from "../assets/Images/Facebook.svg";
import Twitter from "../assets/Images/Twitter.svg";
import insta from "../assets/Images/insta.svg";
import { getCloudinaryUrl } from "../utils/cdnImage";
import useIsMobile from "../utils/useIsMobile";
import { submitSupportForm } from "../services/customerSupport";
import Swal from "sweetalert2";
function CustomerSupport() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    order: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sirf service function ko call karein aur form ka data pass karein
      const response = await submitSupportForm(formData);
      
      console.log("Form submitted successfully:", response);
      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Thank you for your request! We will get back to you soon.',
        confirmButtonColor: '#3085d6', // Optional: button ka color
      });

      // Form clear karein
      setFormData({
        name: "",
        email: "",
        phone: "",
        order: "",
        message: "",
      });

    } catch (error) {
      // Service se throw kiya gaya error yahan catch hoga
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error submitting your form. Please try again.',
      });
    }
  };

  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? getCloudinaryUrl('CustomerSupportMobile.png') : getCloudinaryUrl('CustomerSupport.png', 1600)}
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-5 ">
        <h2 className="fw-medium mb-2">Need Help? We're Here for You!</h2>
        <p className="text-muted mb-4">
          Whether you have a question about your order, need help with a
          prescription, or just want to talk to our support team — we’re always
          ready to assist you.
        </p>

        <div className="px-2 px-md-0">
          <div className="row product-card-shadow rounded-4  overflow-hidden">
            {/* Form Section */}
            <div className="col-md-6 p-4">
              <h4 className="fw-semibold mb-2">Contact Support Form</h4>

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <label className="form-label">
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">
                      Email<span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone<span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Order ID (optional)</label>
                  <input
                    type="text"
                    name="order"
                    className="form-control"
                    placeholder="Enter your order ID"
                    value={formData.order}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Describe Your Issue</label>
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Write an issue here...(You can explain your problem or ask a question here)"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark rounded-5 fw-medium py-2  w-100"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Image Section */}
            <div className="col-md-6 d-flex align-items-center justify-content-center contact-us-illustration p-3">
              <img
                src={getCloudinaryUrl('contact-illustration.svg')}
                alt="Support illustration"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        <h2 className="fw-medium mb-2 mt-5">Other Ways to Reach Us</h2>

        <div className="d-md-flex py-3 gap-3 mb-5">
          <div className="flex-grow-1 d-flex">
            <div className="product-card-shadow py-3 px-4 rounded-4 w-100">
              <p className="text-primary mb-2 fw-medium">Contacts</p>

              <p className="mb-1">
                <span className="text-primary">
                  <IoMdMail />
                </span>{" "}
                contact@smartmedics.pk
              </p>
              <p className="mb-1">
                <span className="text-primary">
                  <PiPhoneCallFill />
                </span>{" "}
                +92 326 8352132{" "}
                <span className="small-text">(Mon–Sat, 9AM–5PM)</span>
              </p>
              <p className="mb-2">
                <span className="text-primary">
                  <PiPhoneCallFill />
                </span>{" "}
                +92 329 2252734{" "}
                <span className="small-text">(WhatsApp Support)</span>
              </p>

              <p className="text-primary mb-2 fw-medium">Order Tracking</p>
              <button className="btn btn-light rounded-5 border py-2 px-3 fw-medium">
                Track my order
              </button>
            </div>
          </div>

          <div className="flex-grow-1 d-flex mt-3 mt-md-0">
            <div className="product-card-shadow py-3 px-4 rounded-4 w-100">
              <p className="text-primary mb-2 fw-medium">Response Time</p>
              <p className="mb-1 text-muted">
                • Our team responds to most queries within 24 hours.
              </p>
              <p className="mb-1 text-muted">
                • For urgent issues, please call or message us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CustomerSupport;
