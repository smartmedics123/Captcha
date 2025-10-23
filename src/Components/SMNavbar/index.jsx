import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEmail } from "../../features/email/emailSlice";
import { clearMobile } from "../../features/mobile/mobileSlice";

import { BsSearch, BsPersonFill, BsCart3 } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import { FaLightbulb, FaTimes } from "react-icons/fa";
import logo from "../../assets/Images/logo3.png";
import nonsortedImg from "../../assets/Images/presorted.svg";
import presortedImg from "../../assets/Images/nonsorted.svg";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdMenu,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import useIsMobile from "../../utils/useIsMobile.js";
import MenuBar from "../MenuBar/MenuBar.jsx";
import MobileSearchBar from "../MobileSearchBar/MobileSearchBar.jsx";
import { getCloudinaryUrl } from "../../utils/cdnImage.js";

import SearchModal from "../SearchModal/SearchModal"; // Import SearchModal // Import SearchModal
import { clearCart } from "../../features/cart/cartSlice.js";
import { clearProfileData } from "../../features/profile/profileSlice.js";
import { persistor } from "../../app/store.js";

const SMNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper function to convert full label to category name for API (for Medicine categories)
  const getCategoryNameFromLabel = (label) => {
    const categoryMap = {
      "Cardiovascular Health (Heart)": "Heart",
      "Respiratory Health (Lungs)": "Respiratory", 
      "Dermatological Health (Skin)": "Skin",
      "Reproductive Health (Men's and Women's Health)": "Reproductive",
      "Gastrointestinal Health (Stomach)": "Gastro",
      "Endocrine Health (Harmonal)": 'Endo',
      "Infectious Diseases (Antibiotics and Antivirals)": 'Antibiotic',
      "Mental Health (Psychiatric Medications)": "Mental",
      "Ophthalmic Health (Optic)": "Eye",
      "Immunology (Allergy and Immune Support)": 'Antiallergy', 
      "Neurological Health (Brain)": "Neuro",
      "Musculoskeletal Health (Bones and Muscles)": 'Ortho',
      "Urological Health (Urinary System)": "Uro"
    };
    
    return categoryMap[label] || label;
  };

  const otpEmail = useSelector((state) => state.email.email);
  const otpMobile = useSelector((state) => state.mobile.mobile);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const lastName = useSelector((state) => state.profile.lastName);

  // 🔍 Debug Redux state and fallback to sessionStorage
  const sessionMobile = sessionStorage.getItem('userMobile');
  const effectiveMobile = otpMobile || sessionMobile;
  
  console.log('🔍 Navbar State:', { 
    otpEmail, 
    otpMobile, 
    sessionMobile, 
    effectiveMobile 
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Track active menu level (main, subMenu, or subMenus)
  const [hoveredOption, setHoveredOption] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // User menu ke liye state

  const isMobile = useIsMobile();
  const tips = {
    presorted:
      "Pre-sorted medication organizes your pills into daily packets, making it easy to take the right dose at the right time.",
    nonsorted:
      "Non-sorted medication comes in its original packaging, allowing you to manage and organize your doses as you prefer, just like a traditional pharmacy.",
  };
  const [visibleTip, setVisibleTip] = useState(null); // null, "pre", or "non"

  const mainMenuItems = [
    { label: "About", href: "/about-us" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Track Order", href: "/track-order" },
    {
      label: "Medicines",
      href: "/medicines",
      subMenu: [
        "Cardiovascular Health (Heart)",
        "Respiratory Health (Lungs)",
        "Dermatological Health (Skin)",
        "Reproductive Health (Men's and Women's Health)",
        "Gastrointestinal Health (Stomach)",
        "Endocrine Health (Harmonal)",
        "Infectious Diseases (Antibiotics and Antivirals)",
        "Mental Health (Psychiatric Medications)",
        "Ophthalmic Health (Optic)",
        "Immunology (Allergy and Immune Support)",
        "Neurological Health (Brain)",
        "Musculoskeletal Health (Bones and Muscles)",
        "Urological Health (Urinary System)",
      ],
    },
    {
      label: "Nutritions & Supplements",
      href: "/nutrition-supplements",
      subMenu: [
        "Vitamins and Minerals",
        "Probiotics",
        "Dietary Supplements",
        "Nutraceuticals",
      ],
    },
    {
      label: "Medical Supplies",
      href: "/medical-supplies",
      subMenu: [
        "Incontinence Products",
        "Surgical Supplies",
        "Respiratory Supplies",
        "Drips and Cannuals",
      ],
    },
    {
      label: "Self Medication",
      href: "/self-medication",
      subMenu: [
        "Fever",
        "Pain Relief",
        "Cold Cough",
        "Heartburn/Indigestion",
        "Muscle & Joint Pain",
        "Constipation/Diarrhea",
        'Antiallergy',
        "Children's Health",
      ],
    },
  ];


  const handleLogout = () => {
        dispatch(clearEmail());
        dispatch(clearMobile()); // ✅ Clear mobile state too
        sessionStorage.removeItem('userMobile'); // ✅ Clear mobile from sessionStorage
        sessionStorage.clear();
        persistor.purge(); // Clear persisted state in Redux Persist
        window.location.href = "/"; // Redirect and reload the page
    };

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setActiveMenu({ type: "subMenu", label: item.label, data: item.subMenu });
    } else if (item.href) {
      navigate(item.href);
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setActiveMenu(null);
  };
  const openSidebar = () => {
    setAnimationClass("sidebar-slide-in");
    setShowSidebar(true);
  };
  const handleClose = () => {
    setAnimationClass("sidebar-slide-out");
    setActiveMenu(null);
    setTimeout(() => setShowSidebar(false), 600); // match animation duration
  };
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
            setShowUserMenu(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setHoveredOption(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setShowMobileModal((prev) => !prev);
      console.log(showMobileModal);
    } else {
      e.preventDefault();
      setShowDropdown((prev) => !prev); // toggle dropdown
    }
  };

  useEffect(() => {
    if (!showDropdown) {
      setVisibleTip(null);
    }
  }, [showDropdown]);

  return (
    <>
      <nav className="border-bottom border-secondary-subtle  position-relative">
        <Link
          to={"/"}
          className="d-flex d-md-none align-items-center justify-content-center pt-3"
        >
          <img src={getCloudinaryUrl('logo3.png', 142)} alt="logo" width={142} height={40} className="img-fluid" loading="lazy" />
        </Link>
        <div className="d-flex container p-3 gap-3">
          {/* Left Section */}
          <div className="d-flex align-items-center gap-3">
            <Link to={"/"} className="navbar-brand" href="#">
              <img
                src={getCloudinaryUrl("logo3.png", 180)}
                alt="Smart Medics Logo"
                className="d-none d-md-block"
                loading="lazy"
              />
              <IoMdMenu
                className="d-md-none"
                onClick={openSidebar}
                style={{ cursor: "pointer", fontSize: "34px" }}
              />
            </Link>
            <Link to={"/about-us"} className="nav-link d-none d-xl-block">
              About
             </Link>
            <Link to={"/how-it-works"} className="nav-link d-none d-xl-block">
              How it works
            </Link>
          </div>

          {/* Search */}
          {/* Search Trigger */}
<div className="position-relative flex-grow-1 d-none d-lg-flex search-container">
    {/* Form tag ko as a wrapper use karein takay pura area clickable ho */}
    <form
        className="input-group"
        onClick={() => setShowSearchModal(true)}
        style={{ cursor: 'pointer' }}
    >
        <input
            type="text"
            className="form-control"
            placeholder="Search for Medicines & more..."
            readOnly // Isse navbar ke input mein typing nahi hogi
            // Input aur button ke beech ka border hatane ke liye
            style={{ borderRight: 'none', boxShadow: 'none', zIndex: 0 }}
        />
        <button
            className="btn"
            type="button"
            // Button ka color design ke mutabiq set karein
            style={{ backgroundColor: '#00A99D', color: 'white' }}
        >
            <BsSearch />
        </button>
    </form>
</div>

          {/* Right Section */}
          <div className="d-flex align-items-center ms-auto gap-3 position-relative">
            {/* Order Now Button */}
            <div
              onClick={handleClick}
              className="position-relative"
              ref={dropdownRef}
            >
              <a
                href="#"
                className="btn fw-medium rounded-pill d-flex align-items-center gap-2 gap-md-2 gap-1 px-3 py-2 order-now-btn nav-link order-now-btn-responsive"
              >
                Order Now
                <IoIosArrowDown />
              </a>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="position-absolute d-flex z-5 mt-2"
                  style={{
                    top: "100%",
                    left: 0,
                    width: "350px",
                    zIndex: "10000",
                  }}
                >
                  {/* Options Box */}
                  <div className="bg-white rounded-4 shadow p-3 d-flex flex-column gap-2">
                    {/* Pre-sorted */}
                    <div className="d-flex flex-column gap-1 position-relative">
                      {visibleTip === "pre" && (
                        <div className="tip-box tip-box2">
                          <FaTimes
                            className="position-absolute top-0 end-0 m-2 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVisibleTip(null);
                            }}
                          />
                          Pre-sorted medication organizes your pills into daily
                          packets, making it easy to take the right dose at the
                          right time.
                        </div>
                      )}
                      <Link
                        to={"/verification"}
                        className="d-flex align-items-center gap-2 p-2 rounded-3 btn btn-medication"
                        style={{ cursor: "pointer" }}
                      >
                        <img src={getCloudinaryUrl('nonsorted.svg')} alt="Pre-sorted" width="62" height="62" loading="lazy" />
                        <span className="">Pre-sorted Medication</span>
                        <FaLightbulb
                          className="text-warning ms-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVisibleTip((prev) =>
                              prev === "pre" ? null : "pre"
                            );
                          }}
                        />
                      </Link>
                    </div>

                    {/* Non-sorted */}
                    <div className="d-flex flex-column gap-1 position-relative">
                      {visibleTip === "non" && (
                        <div className="tip-box">
                          <FaTimes
                            className="position-absolute top-0 end-0 m-2 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVisibleTip(null);
                            }}
                          />
                          Non-sorted medication comes in its original packaging,
                          allowing you to manage and organize your doses as you
                          prefer, just like a traditional pharmacy.
                        </div>
                      )}
                      <Link
                        to={"/medicines"}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={tips.nonsorted}
                        className="d-flex align-items-center gap-2 p-2 rounded-3 btn btn-medication"
                        style={{ cursor: "pointer" }}
                      >
                        <img src={getCloudinaryUrl('presorted.svg')} alt="Non-sorted" width="62" height="62" loading="lazy" />
                        <span className="">Non-sorted Medication</span>
                        <FaLightbulb
                          className="text-warning ms-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVisibleTip((prev) =>
                              prev === "non" ? null : "non"
                            );
                          }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Nav Links */}
            <Link
              to={"/track-order"}
              className="nav-link fw-bolder d-none d-md-block"
            >
              Track Order
            </Link>
            <div className="position-relative" ref={userMenuRef}>
                {(otpEmail || effectiveMobile) ? (
                    // --- Logged-in View with Dropdown ---
                    <button
                        onClick={() => setShowUserMenu(prev => !prev)}
                        className="btn fw-medium border border-grey-subtle d-flex align-items-center gap-2 rounded-pill px-3 text-black nav-link py-2"
                    >
                        <BsPersonFill size={20} />
                        <span style={{ fontSize: '14px' }}>
                            Welcome
                        </span>
                        <IoIosArrowDown className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                ) : (
                    // --- Logged-out View ---
                    <Link to="/verification" className="btn fw-medium border border-grey-subtle d-flex align-items-center gap-2 rounded-pill px-3 text-black nav-link order-now-btn-responsive-py"
                    >
                        <BsPersonFill size={18} />
                        <span>Signin</span>
                    </Link>
                )}

                {/* --- User Dropdown Menu --- */}
                {showUserMenu && (
                    <div className="position-absolute bg-white border rounded-3 shadow-sm mt-2" style={{ top: '100%', right: 0, width: '150px', zIndex: 1000 }}>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <Link 
                                    to="/dashboard" 
                                    className="dropdown-item px-3 py-2" 
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        // Force page refresh when navigating to dashboard
                                        setTimeout(() => {
                                            window.location.href = "/dashboard";
                                        }, 100);
                                    }}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider my-0" />
                            </li>
                            <li>
                                <button onClick={handleLogout} className="dropdown-item px-3 py-2 text-danger w-100 text-start">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <Link
              to={"/cart"}
              className="cart-btn me-2 me-lg-0 fs-4 position-relative"
            >
              <BsCart3 />
              <span className="cart-badge badge rounded-pill">
                {totalItems > 0 && totalItems}
              </span>
            </Link>
          </div>
        </div>
        {/* Sidebar for Mobile */}
        {showSidebar && (
          <div
            className={`position-fixed top-0 start-0 w-100 h-100 bg-white shadow-lg d-md-none  ${animationClass}`}
            style={{ width: "250px", zIndex: 100000, padding: "20px" }}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              {!activeMenu && (
                <img src={getCloudinaryUrl('logo3.png', 200)} alt="Mobile Logo" width={165} height={50} className="img-fluid" loading="lazy" />
              )}
              {activeMenu && (
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleBack}
                  className="d-flex align-items-center gap-1"
                >
                  <IoIosArrowBack size={20} /> Back
                </div>
              )}
              <RxCross2
                onClick={handleClose}
                style={{ cursor: "pointer", fontSize: "24px" }}
              />
            </div>
            {activeMenu ? (
              <>
                <h5 className="mb-3">{activeMenu.label}</h5>
                <ul className="list-unstyled menu-fade-slide">
                  {activeMenu.type === "subMenu" &&
                    activeMenu.data.map((subItem, index) => (
                      <li
                        key={index}
                        className="py-2 text-start rounded-5 my-2 btn-sub-menu  d-block"
                      >
                        {activeMenu.label === "Self Medication" ? (
                          <a 
                            href={`/self-medication?${new URLSearchParams({ category: subItem }).toString()}`}
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/self-medication?${new URLSearchParams({ category: subItem }).toString()}`);
                              setShowSidebar(false);
                            }}
                          >
                            {subItem}
                          </a>
                        ) : activeMenu.label === "Nutritions & Supplements" ? (
                          <a 
                            href={`/nutrition-supplements?${new URLSearchParams({ category: subItem }).toString()}`}
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/nutrition-supplements?${new URLSearchParams({ category: subItem }).toString()}`);
                              setShowSidebar(false);
                            }}
                          >
                            {subItem}
                          </a>
                        ) : activeMenu.label === "Medical Supplies" ? (
                          <a 
                            href={`/medical-supplies?${new URLSearchParams({ category: subItem }).toString()}`}
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/medical-supplies?${new URLSearchParams({ category: subItem }).toString()}`);
                              setShowSidebar(false);
                            }}
                          >
                            {subItem}
                          </a>
                        ) : activeMenu.label === "Medicines" ? (
                          <a 
                            href={`/medicines?${new URLSearchParams({ category: getCategoryNameFromLabel(subItem) }).toString()}`}
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/medicines?${new URLSearchParams({ category: getCategoryNameFromLabel(subItem) }).toString()}`);
                              setShowSidebar(false);
                            }}
                          >
                            {subItem}
                          </a>
                        ) : (
                          <a href="#" className="text-decoration-none">
                            {subItem}
                          </a>
                        )}
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <ul className="list-unstyled menu-fade-slide">
                {mainMenuItems.map((item, index) => {
                  const isTrackOrder = item.label === "Track Order";
                  const isHover =
                    item.label === "Track Order" ||
                    item.label === "About" ||
                    item.label === "How it works";

                  return (
                    <li
                      key={index}
                      className={`py-2 d-flex justify-content-between align-items-center  ${
                        isTrackOrder
                          ? "pb-4 mb-4 border-bottom fw-semibold rounded-0"
                          : ""
                      } ${isHover && "nav-mobile-link"}`}
                      onClick={() => handleMenuClick(item)}
                      style={{
                        cursor:
                          item.subMenu ? "pointer" : "default",
                        fontSize: isTrackOrder ? "1.1rem" : undefined, // adjust size if needed
                      }}
                    >
                      <Link to={item.href}>{item.label}</Link>
                      {item.subMenu && <IoIosArrowForward />}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {/* Overlay to close sidebar when clicking outside */}
        {showSidebar && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 overlay-fade-in"
            style={{ zIndex: 1049 }}
            onClick={handleClose}
          />
        )}
        <AnimatePresence>
          {showMobileModal && (
            <div
              className="modal-backdrop"
              onClick={() => setShowMobileModal(false)}
            >
              <motion.div
                key="mobileModal"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mobile-modal-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="offcanvas-header d-flex justify-content-center align-items-center">
                  <h3 className="offcanvas-title text-center py-3">
                    Order Now
                  </h3>
                </div>

                <div className="offcanvas-body d-flex flex-column gap-3">
                  <Link to={"/verification"}>
                    <div className="d-flex flex-column gap-1 position-relative">
                      {visibleTip === "pre" && (
                        <div className="tip-box tip-box2">
                          <FaTimes
                            className="position-absolute top-0 end-0 m-2 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVisibleTip(null);
                            }}
                          />
                          Pre-sorted medication organizes your pills into daily
                          packets, making it easy to take the right dose at the
                          right time.
                        </div>
                      )}
                      <div
                        className="d-flex align-items-center gap-2 justify-content-between p-3 rounded-2 btn btn-medication"
                        style={{ cursor: "pointer" }}
                      >
                        <img src={getCloudinaryUrl('nonsorted.svg')} alt="Pre-sorted" width="65" height="65" loading="lazy" />
                        <span className="fw-semibold">
                          Pre-sorted Medication
                        </span>
                        <FaLightbulb
                          className="text-warning"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVisibleTip((prev) =>
                              prev === "pre" ? null : "pre"
                            );
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                  {/* Non-sorted */}
                  <Link to={"/medicines"}>
                    <div className="d-flex flex-column gap-1">
                      {visibleTip === "non" && (
                        <div className="tip-box ">
                          <FaTimes
                            className="position-absolute top-0 end-0 m-2 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVisibleTip(null);
                            }}
                          />
                          Non-sorted medication comes in its original packaging,
                          allowing you to manage and organize your doses as you
                          prefer, just like a traditional pharmacy.
                        </div>
                      )}
                      <div
                        className="d-flex align-items-center gap-2 justify-content-between p-3 rounded-2 btn btn-medication"
                        style={{ cursor: "pointer" }}
                      >
                        <img src={getCloudinaryUrl('presorted.svg')} alt="Non-sorted" width="65" height="65" loading="lazy" />
                        <span className="fw-semibold">
                          Non-sorted Medication
                        </span>
                        <FaLightbulb
                          className="text-warning"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVisibleTip((prev) =>
                              prev === "non" ? null : "non"
                            );
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>

              <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 10000000;
        }

        .mobile-modal-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35vh;
          background-color: #fff;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          padding: 1rem;
          z-index: 1050;
          overflow-y: auto;
        }

        .tip-box {
          position: absolute;
          bottom: -10%;
          right: 15%;
          background-color: #fff8c4;
          border-radius: 10px;
          padding: 10px;
          font-size: 0.9rem;
          color: #444;
          border: 1px solid #e0d08b;
          margin-bottom: 8px;
          width: max-content;
          max-width: 250px;
          z-index: 100;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding-top: 1.4rem;
        }
           .tip-box2 {
          position: absolute;
          bottom: -60%;
          right: 15%;
        }
      `}</style>
            </div>
          )}
        </AnimatePresence>
      </nav>
      {/* Search Modal (Conditionally Rendered) */}
      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}
      <MenuBar />
      <MobileSearchBar />
    </>
  );
};

export default SMNavbar;
