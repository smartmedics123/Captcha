import React, { useState } from "react";
import PrivacyPolicy from "../../assets/Images/ContactUs.png";
import SMNavbar from "../../Components/SMNavbar";
import Footer from "../../Components/Footer";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMdMail } from "react-icons/io";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import useIsMobile from "../../utils/useIsMobile";
import { submitContactForm } from "../../services/customerSupport";
import Swal from "sweetalert2";

function ContactUs() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const response = await submitContactForm(formData);
      console.log("Form submitted:", response);
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Thank you for your request! We will get back to you soon.",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error submitting your form. Please try again.",
      });
    }
  };

  //  WhatsApp number setup work
  const rawNumber = "+92 329 2252734"; // original
  const clean = rawNumber.replace(/\D/g, ""); // -> 923292252734
  const message = encodeURIComponent("Hello, I saw your number on the website.");
  const href = `https://wa.me/${clean}?text=${message}`;

  return (
    <div>
      <SMNavbar />
      <img
        src={
          isMobile
            ? getCloudinaryUrl("ContactUsMobile.png")
            : getCloudinaryUrl("ContactUs.png", 1600)
        }
        alt="PrivacyPolicy"
        className="img-fluid w-100 h-100"
      />

      <div className="container py-5 ">
        <h2 className="fw-medium mb-2">Contact Us – We're Here to Help!</h2>
        <p className="text-muted mb-4">
          At Smart Medics, your health and satisfaction are our top priority.
          Whether you have a question about your order, need assistance with our
          services, or want to provide feedback, we're just a message away!
        </p>

        <div className="px-2 px-md-0">
          <div className="row product-card-shadow rounded-4  overflow-hidden">
            {/* Form Section */}
            <div className="col-md-6 p-4">
              <h4 className="fw-semibold mb-2">Contact Form</h4>
              <p className="text-muted mb-3">
                Fill out the form below and we'll get back to you shortly.
              </p>

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
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Write a message here..."
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100">
                  Submit
                </button>
              </form>

              <small className="text-muted d-block mt-3">
                <strong>Privacy Notice:</strong> We value your privacy. Your
                information is kept confidential and is only used to assist with
                your inquiry.
              </small>
            </div>

            {/* Image Section */}
            <div className="col-md-6 d-flex align-items-center justify-content-center contact-us-illustration p-3">
              <img
                src={getCloudinaryUrl("contact-illustration.svg")}
                alt="Support illustration"
                className="img-fluid"
              />
            </div>
          </div>
        </div>

        <h2 className="fw-medium mb-2 mt-5">How Can We Assist You Today?</h2>

        <div className="row d-md-flex py-3 gap-3 mb-5">
          <div className="col-md-4">
            <div className=" product-card-shadow py-3 px-4 rounded-4 ">
              <p className="text-primary mb-2 fw-medium">1. Customer Support</p>
              <p className="mb-2 text-muted">
                For inquiries about your order status, prescription approval, or
                delivery, our support team is available to help.
              </p>

              <p className="mb-1">
                <span className="text-primary ">
                  <IoMdMail />
                </span>{" "}
                contact@smartmedics..pk
              </p>
              <p className="mb-1">
                <span className="text-primary ">
                  <PiPhoneCallFill />
                </span>{" "}
                +923268352132
              </p>
            <p className="small-text text-center mt-3 mb-0">
                (Available Monday to Saturday, 9 AM - 5 PM)
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className=" product-card-shadow py-3 px-4 rounded-4 ">
              <p className="text-primary mb-2 fw-medium">
                2. Pharmacy Consultation
              </p>
              <p className="mb-2 text-muted">
                Speak with one of our pharmacists for medication advice,
                prescription management, or any medical queries you may have.
              </p>

              <p className="mb-1">
                <span className="text-primary ">
                  <IoMdMail />
                </span>{" "}
                pharmacy@smartmedics.pk
              </p>

              {/*  WhatsApp clickable number Func Add */}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open WhatsApp chat"
              >
                <p className="mb-1" style={{ cursor: "pointer" }}>
                  <span className="text-primary">
                    <PiPhoneCallFill />
                  </span>{" "}
                  {rawNumber}
                </p>
              </a>
   <p className="small-text text-center mt-3 mb-0">
                (Available Monday to Saturday, 9 AM - 5 PM)
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className=" product-card-shadow py-3 privacy-bottom-card px-4 rounded-4 ">
              <p className="text-primary mb-2 fw-medium">
                3. Business Inquiries
              </p>
              <p className="mb-2 text-muted">
                Interested in partnering with Smart Medics or have a
                business-related inquiry? We'd love to connect!
              </p>

              <p className="mb-1">
                <span className="text-primary ">
                  <IoMdMail />
                </span>{" "}
                business@smartmedics.pk
              </p>
              <p className="mb-1">
                <span className="text-primary ">
                  <PiPhoneCallFill />
                </span>{" "}
                +923333063785
              </p>
   <p className="small-text text-center mt-3 mb-0">
                (Available Monday to Saturday, 9 AM - 5 PM)
              </p>
            </div>
          </div>
        </div>

        <h2 className="fw-medium mb-2 mt-3">Additional Contact Options</h2>
        <p className="text-muted mb-2">
          <span className="text-black fw-medium">• Live Chat:</span> Chat with
          our support team directly using the chat button located at the bottom
          right of this page.
        </p>
        <p className="text-muted mb-5">
          <span className="text-black fw-medium">• WhatsApp:</span> Send us a
          message on WhatsApp at 0329-2252734 or click the WhatsApp button at
          the bottom of this page.
        </p>

        <div className="d-md-flex gap-3 py-3 mb-5">
          <div className=" product-card-shadow py-3 privacy-bottom-card px-4 rounded-4 ">
            <p className="fs-5 mb-2 fw-medium">Social Media</p>
            <p className="mb-3 text-muted">
              Connect with us on our social media platforms for the latest
              updates and promotions!
            </p>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/share/16nhqcLuUk/?mibextid=wwXIfr" className="text-decoration-none text-dark" target="_blank" rel="noopener noreferrer">
                <img
                  src={getCloudinaryUrl("Facebook.svg")}
                  alt="icons"
                  style={{ width: "35px" }}
                  loading="lazy"
                  width="35"
                  height="35"
                />
              </a>
              {/* <a href="https://www.instagram.com/smartmedics.pk/?igsh=NXBvaG1wdzNybTZk#" className="text-decoration-none text-dark" target="_blank" rel="noopener noreferrer">
                <img
                  src={getCloudinaryUrl("Twitter.svg")}
                  alt="icons"
                  style={{ width: "35px" }}
                  loading="lazy"
                  width="35"
                  height="35"
                />
              </a> */}
              <a href="#" className="text-decoration-none text-dark">
                <img
                  src={getCloudinaryUrl("insta.svg")}
                  alt="icons"
                  style={{ width: "35px" }}
                  loading="lazy"
                  width="35"
                  height="35"
                />
              </a>
            </div>
          </div>
          <div className=" product-card-shadow py-3 privacy-bottom-card px-4 rounded-4 ">
            <p className="fs-5 mb-2 fw-medium">
              Our Address Smart Medics Headquarters
            </p>
            <p className="mb-2 text-muted">
              Office# 105, Balad Trade Center 2, Near Sialkot Milk Shop,
              Bahadurabad, Karachi.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;