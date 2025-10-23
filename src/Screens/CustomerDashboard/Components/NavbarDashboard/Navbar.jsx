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
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import Images from "../../../../assets/Images";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import CustomModal from "../../../../Components/CustomModal/CustomModal";
import "./style.css";

const NavbarDashboard = () => {
  const otpEmail = useSelector((state) => state.email.email);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const lastName = useSelector((state) => state.profile.lastName);
  const [navBackground, setNavBackground] = useState("transparent");
  const [boxShadow, setBoxShadow] = useState("none");
  const [isModalVisible, setModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-nav")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className="border-bottom border-secondary-subtle">
        <div className="d-flex container p-3 gap-3">
          <div className="d-flex align-items-center gap-3">
            <Nav.Link className="nav-link d-none d-md-block">
              <Link to={"/about-us"} className="nav-link d-none d-md-block">
                About
              </Link>
            </Nav.Link>
            <Nav.Link className="nav-link d-none d-md-block">
              <Link to={"/how-it-works"} className="nav-link d-none d-md-block">
                How it works
              </Link>
            </Nav.Link>
          </div>
          <form className="position-relative flex-grow-1 d-none d-xxl-flex search-container">
            <input
              type="text"
              className="form-control"
              placeholder="Search for Medicines & more..."
            />
            <button className="btn">
              <i className="bi bi-search" />
            </button>
          </form>
          <div className="d-flex align-items-center ms-auto gap-3">
            <Button
              href="#"
              className=" btn fw-medium rounded-pill px-3 py-2 order-now-btn nav-link d-none d-md-block"
              style={{
                cursor: "pointer",
              }}
              onClick={toggleModal}
            >
              Order Now
            </Button>
            <div
              style={{
                position: "relative",
                right: 100,
                top: 30,
                zIndex: 1000000,
              }}
            >
              <CustomModal
                items={items}
                show={isModalVisible}
                onClose={() => setModalVisible(false)}
              />
            </div>
            <Link
              to={"/track-order"}
              className="nav-link fw-bolder nav-link  d-none d-md-block"
            >
              Track Order
            </Link>
            <Nav.Link className="me-5">
              <Button
                href="#"
                className="btn fw-medium border border-grey-subtle rounded-pill px-3 nav-link py-2 w-auto"
              >
                <FaUserCircle
                  style={{ fontSize: "24px", marginRight: "4px" }}
                />
                {otpEmail ? (
                  <>
                    <span style={{ fontSize: "12px" }}>
                      <Link
                        to={"/dashboard"}
                        style={{ textDecoration: "none" }}
                      >
                        Welcome 
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <Link
                        to={"/verification"}
                        className="text-decoration-none hover-bg-[#49AEB3] text-dark hover-text-light"
                      >
                        Signin
                      </Link>
                    </span>
                  </>
                )}
              </Button>
            </Nav.Link>
            <Nav.Link>
              <Link to={"/checkout"} style={{ textDecoration: "none" }}>
                <div className=" checkout-btn cart-btn me-2 me-lg-0 fs-4 nav-link ">
                  <i className="bi bi-cart3" />
                  {totalItems > 0 && (
                    <span
                      className="bag-quantity"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        backgroundColor: "#49AEB3",
                        borderRadius: "50%",
                        padding: "0px 6px",
                        fontSize: "12px",
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
                </div>
              </Link>
            </Nav.Link>
          </div>
        </div>
      </nav>
      {/* Menu bar */}

      {/* Search Bar - Mobile */}
      <div className="d-flex justify-content-center align-items-center gap-3 p-3 d-lg-none ">
        <form className="position-relative flex-grow-1 d-flex search-container">
          <input
            type="text"
            className="form-control"
            placeholder="Search for Medicines & more..."
          />
          <button className="btn">
            <i className="bi bi-search" />
          </button>
        </form>
      </div>
    </>
  );
};

export default NavbarDashboard;
