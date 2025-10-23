import { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import '../../App.css';
import "./CustomNavbar.css";

import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

import CustomModal from "../CustomModal/CustomModal";
import Images from "../../assets/Images";
import SearchBar from "../SearchBar/SearchBar";
import DropDown from "../CustomDropDown/DropDown";
const CustomNavbar = () => {
  const otpEmail = useSelector((state) => state.email.email);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const lastName = useSelector((state) => state.profile.lastName);

  const [navBackground, setNavBackground] = useState("transparent");
  const [boxShadow, setBoxShadow] = useState("none");
  const [showModal, setShowModal] = useState(false);

  const items = [
    {
      image: Images.presorted,
      label: "Pre-sorted Medication",
      iconColor: "orange",
      link: "/verification",
      imageWidth: "90px",
      message:
        "Pre-sorted medication organizes your pills into daily packets, making it easy to take the right dose at the right time",
    },
    {
      image: Images.nonsorted,
      label: "Non-sorted Medication",
      iconColor: "orange",
      link: "/allproducts",
      imageWidth: "100px",
      message:
        "Non-sorted medication comes in its original packaging, allowing you to manage and organize your doses as you prefer, just like a traditional pharmacy",
    },
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  // Handle Navbar background and shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBackground("white");
        setBoxShadow("0 4px 2px rgba(46, 46, 46, 0.74)");
      } else {
        setNavBackground("transparent");
        setBoxShadow("none");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // State to control the offcanvas visibility
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <>
      <div
        className="row sticky-top"
        style={{
          backgroundColor: navBackground,
          boxShadow: boxShadow,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div>
          <Navbar expand="lg" className=" ">
            <Container
              fluid
              className="d-flex align-content-center justify-content-between ps-md-5"
            >
              {/* Toggle button on the left side for mobile */}
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={handleShow}
                className="d-lg-none"
              />

              {/* Centered logo on mobile */}
              <Nav.Link className="ms-2">
                <Link className="text-decoration-none w-25 d-lg-none">
                  <Button
                    onClick={toggleModal}
                    style={{
                      background:
                        "linear-gradient(135deg, #008F9D, #00B5A3, #0ED0BA)", // Gradient color from the image
                      borderRadius: "25px", // Rounded corners for a pill-shaped button
                      color: "white", // Text color
                      border: "none", // No border
                      fontSize: "14px", // Adjust font size
                      fontWeight: "bold", // Make the text bold
                      textTransform: "uppercase", // Capitalize text to match the "ORDER NOW" look
                      cursor: "pointer", // Change cursor to pointer
                    }}
                  >
                    ORDER NOW
                  </Button>
                  {/* CustomModal displayed as a dropdown */}
                  <div style={{ position: "relative" }}>
                    <CustomModal
                      items={items}
                      show={isModalVisible}
                      onClose={() => setModalVisible(false)}
                    />
                  </div>
                </Link>
              </Nav.Link>
              <Navbar.Brand className="mx-auto d-lg-none">
                <Link to={"/"}>
                  <img style={{ width: 50 }} src={logo} alt="logo" />
                </Link>
              </Navbar.Brand>

              {/* Desktop logo and menu */}
              <Navbar.Brand className="d-none d-lg-block">
                <Link to={"/"}>
                  <img
                    style={{ width: 65, marginLeft: "20px" }}
                    src={logo}
                    alt="logo"
                  />
                </Link>
              </Navbar.Brand>

              <Navbar.Collapse
                id="basic-navbar-nav"
                className="d-none d-lg-flex justify-content-between ms-md-5"
              >
                <Nav className="ms-3" style={{ fontSize: "16px" }}>
                  <Nav.Link className="ms-2 ">
                    <Link
                      className="text-decoration-none hover-bg"
                      to={"/about-us"}
                    >
                      About
                    </Link>
                  </Nav.Link>
                  <Nav.Link className="ms-5 ">
                    <Link
                      to={"/how-it-works"}
                      className="text-decoration-none hover-bg"
                    >
                      How It Works
                    </Link>
                  </Nav.Link>
                </Nav>
                <div className="searchbar d-none d-md-block">
                  <SearchBar />
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  {/* Order Now Button */}
                  <Nav.Link className="">
                    <Link className="text-decoration-none">
                      <Button onClick={toggleModal} className="ordernow">
                        ORDER NOW
                      </Button>
                      {/* CustomModal displayed as a dropdown */}
                      <div style={{ position: "relative" }}>
                        <CustomModal
                          items={items}
                          show={isModalVisible}
                          onClose={() => setModalVisible(false)}
                        />
                      </div>
                    </Link>
                  </Nav.Link>

                  {/* Track Order Link */}
                  <Nav.Link className="ps-5 pe-5">
                    <Link
                      to={"/track-order"}
                      className="text-decoration-none hover-bg"
                    >
                      Track Order
                    </Link>
                  </Nav.Link>
                  {/* Sign In Button */}
                  <Nav.Link className="me-5">
                    <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
                      <Button
                        style={{
                          backgroundColor: "transparent", // Making background transparent
                          // Ensuring text and icon color is black
                          display: "flex", // Flexbox for horizontal alignment
                          alignItems: "center", // Vertically center align the items
                          justifyContent: "center",
                          border: "none", // Removing border
                          padding: "0", // Removing padding around the button
                        }}
                        variant="outline-secondary"
                        className="icon-button hover-bg"
                      >
                        <FaUserCircle
                          style={{ fontSize: "24px", marginRight: "4px" }}
                        />

                        {otpEmail ? (
                          <>
                            <span style={{ fontSize: "12px" }}>
                              Welcome
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              <Link
                                to={"/verification"}
                                className="text-decoration-none hover-bg"
                              >
                                Sign In
                              </Link>
                            </span>
                          </>
                        )}
                      </Button>
                    </Link>
                  </Nav.Link>

                  {/* Cart Button */}
                  <Nav.Link className="me-5">
                    <Link to={"/checkout"} style={{ textDecoration: "none" }}>
                      <Button
                        style={{
                          backgroundColor: "#008F9D",
                          color: "white",
                          width: "42px", // Set a fixed width for the button
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative", // Ensures the badge is positioned correctly
                        }}
                        variant="outline-secondary"
                        className="icon-button"
                      >
                        <FaShoppingCart style={{ position: "relative" }} />
                        {totalItems > 0 && (
                          <span
                            className="bag-quantity"
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-5px",
                              backgroundColor: "#49AEB3",
                              borderRadius: "50%",
                              padding: "0px 6px",
                              fontSize: "10px",
                              color: "white",
                              transform: "translate(10%, -10%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {totalItems}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </Nav.Link>
                </div>
              </Navbar.Collapse>
              {/* Mobile cart icon on the right */}
              <div className="d-lg-none">
                <Link to={"/dashboard"}>
                  <Button
                    style={{
                      backgroundColor: "transparent", // Making background transparent
                      color: "black", // Ensuring text and icon color is black
                      display: "flex", // Flexbox for horizontal alignment
                      alignItems: "center", // Vertically center align the items
                      justifyContent: "center",
                      border: "none", // Removing border
                      padding: "0", // Removing padding around the button
                    }}
                    variant="outline-secondary"
                    className="icon-button"
                  >
                    {/* Icon from the image */}
                    <FaUserCircle
                      style={{ fontSize: "24px", marginRight: "8px" }}
                    />
                  </Button>
                </Link>
              </div>
              <div className="d-lg-none">
                <Link to={"/checkout"} style={{ textDecoration: "none" }}>
                  <Button
                    style={{
                      backgroundColor: "#008F9D",
                      color: "white",
                      width: "42px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                    variant="outline-secondary"
                    className="icon-button"
                  >
                    <FaShoppingCart />
                    {totalItems > 0 && (
                      <span
                        className="bag-quantity"
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          backgroundColor: "red",
                          borderRadius: "50%",
                          padding: "0px 6px",
                          fontSize: "12px",
                          color: "white",
                        }}
                      >
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </Container>
          </Navbar>
        </div>

        <div className="w-100  justify-content-center d-none d-md-flex">
          <DropDown />
        </div>
      </div>

      {/* Offcanvas for Mobile Screens */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="d-lg-none"
        style={{ width: "100%" }}
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Offcanvas.Title className="text-dark mx-3">MENU</Offcanvas.Title>
            <Nav.Link onClick={handleClose} className="">
              <Link
                className="text-decoration-none"
                style={{ color: "black" }}
                to={"/about-us"}
              >
                About
              </Link>
            </Nav.Link>
            <Nav.Link onClick={handleClose} className="">
              <Link
                to={"/how-it-works"}
                className="text-decoration-none"
                style={{ color: "black" }}
              >
                How It Works
              </Link>
            </Nav.Link>
            <Nav.Link onClick={handleClose} className="">
              <Link className="text-decoration-none" style={{ color: "black" }}>
                Track Order
              </Link>
            </Nav.Link>
          </Nav>

          <Row className=" pt-4">
            <hr className="w-100" />
            <Col className="text-center pt-2">
              <img style={{ width: 70 }} src={logo} alt="logo" />
              <ul className="list-unstyled">
                <li style={{ fontSize: "12px", color: "black" }}>
                  Smart Medics <br />
                  Where Pharmacy Meets Your Everyday Needs
                </li>
              </ul>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomNavbar;
