// Footer.js

import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import useIsMobile from "../utils/useIsMobile";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { getCloudinaryUrl } from "../utils/cdnImage";
import { IoMdMail } from "react-icons/io";
import { PiPhoneCallFill } from "react-icons/pi";
const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <footer className="p-3 p-md-4">
        <div
          className="p-3 pt-5 p-md-5"
          style={{
            background: `url(${getCloudinaryUrl('footer-bg.png')}), 
            linear-gradient(0deg, rgba(10, 102, 107, 0.3) 0%, rgba(133, 232, 222, 0.3) 100%), 
            linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "15px",
            position: "relative",
            overflow: "hidden",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          <div className="row">
            {/* Smart Medics Section */}
            <div className="col-md-3 mb-4">
              <img
                src={getCloudinaryUrl('logo3.png', 150)}
                alt="Smart Medics Logo"
                style={{ width: "150px", marginBottom: "15px" }}
              />
              <p>Smart Medics: Where Pharmacy <br /> Meets Your Every Needs</p>
              <h5 style={{ color: "#000", fontWeight: "600" }} className="mt-5">
                Contact
              </h5>
              <p className="mt-1" style={{ color: "#000" }}>
                Office# 105  Balad Trade Center 2<br />
                Near Sialkot Milk Shop Bahadurabad Karachi.
              </p>
              <p className="mb-1">
                              <span className="text-primary">
                                <IoMdMail/>
                              </span>{" "}
                              contact@smartmedics.pk
                            </p>
                            <p className="mb-1">
                              <span className="text-primary">
                                <PiPhoneCallFill />
                              </span>{" "}
                              +92 326 8352132{" "}
                              <span className="small-text">(Mon–Sun, 24/7)</span>
                            </p>
                            <p className="mb-2">
                              <span className="text-primary">
                                <PiPhoneCallFill />
                              </span>{" "}
                              +92 329 2252734{" "}
                              <span className="small-text">(WhatsApp Support)</span>
                            </p>
              <div className="d-flex gap-3">
             <a 
  href="https://www.facebook.com/share/16nhqcLuUk/?mibextid=wwXIfr" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaFacebook style={{ color: "#171717CC", fontSize: "20px" }} />
</a>

             <a 
  href="https://www.instagram.com/smartmedics.pk/?igsh=NXBvaG1wdzNybTZk#" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaInstagram style={{ color: "#171717CC", fontSize: "20px" }} />
</a>

                <a 
  href="https://www.linkedin.com/company/smartmedicspk" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaLinkedin style={{ color: "#171717CC", fontSize: "20px" }} />
</a>

               <a 
  href="https://www.youtube.com/@SmartMedicspk" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaYoutube style={{ color: "#171717CC", fontSize: "20px" }} />
</a>

              </div>
            </div>

            {/* Services Section */}
            <div className="col-6 col-md-3 mb-4">
              <h5 style={{ color: "#000", fontWeight: "600" }} className="mb-4">
                Services
              </h5>
              <ul className="list-unstyled">
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/how-it-works"} className="footer-link">
                    How It Works
                  </Link>
                </li>
                {/* <li style={{ marginBottom: "20px" }}>
                  <a href="#" className="footer-link">
                    Pharmacy Locations
                  </a>
                </li> */}
                {/* <li style={{ marginBottom: "20px" }}>
                  <a href="#" className="footer-link">
                    Online Consultation with Pharmacists
                  </a>
                </li> */}
              </ul>
            </div>

            {/* About Section */}
            <div className="col-6 col-md-3 mb-4 p-0">
              <h5 style={{ color: "#000", fontWeight: "600" }} className="mb-4">
                About
              </h5>
              <ul className="list-unstyled">
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/customer-support"} className="footer-link">
                    Customer Support
                  </Link>
                </li>
                {/* <li style={{ marginBottom: "20px" }}>
                  <a href="#" className="footer-link">
                    Medication Management
                  </a>
                </li> */}
                {/* <li style={{ marginBottom: "20px" }}>
                  <a href="#" className="footer-link">
                    Convenient Refill Options
                  </a>
                </li> */}
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/about-us"} className="footer-link">
                    About Company
                  </Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/contact-us"} className="footer-link">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Helpful Links Section */}
            <div className="col-md-3 mb-4">
              <h5 style={{ color: "#000", fontWeight: "600" }} className="mb-4">
                Helpful Links
              </h5>
              <ul className="list-unstyled">
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/careers"} className="footer-link">
                    Careers
                  </Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/terms-conditions"} className="footer-link">
                    Terms & Conditions
                  </Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/privacy-policy"} className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/cancellation-policy"} className="footer-link">
                    Cancellation Policy
                  </Link>
                </li>
                <li style={{ marginBottom: "20px" }}>
                  <Link to={"/delivery-policy"} className="footer-link">
                    Delivery Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="text-center mt-4"
            style={{ fontSize: isMobile ? "10px" : "12px" }}
          >
            <p style={{ color: "#000" }}>
              © 2025 by Smart Medics. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;