import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHome,
  FaShoppingCart,
  FaFileMedical,
  FaCreditCard,
  FaIdCard,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaQuestionCircle
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearEmail } from "../../../../features/email/emailSlice";
import { persistor } from "../../../../app/store";
import { getCloudinaryUrl } from "../../../../utils/cdnImage";
import { useNotifications } from "../../../../context/NotificationContext_optimized";
import './Dashboard.css';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCount, markNotificationsAsRead, checkForNewNotifications, isConnected } = useNotifications();

  const toggleSidebar = () => {
    // For mobile: toggle open/close
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } 
    // For desktop: toggle collapse/expand
    else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (e) => {
    // Close sidebar when an item is clicked on mobile
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    // No need to refresh the page - React routing will handle navigation
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  };

  const handleNotificationClick = () => {
    // Refresh notifications before marking as read
    checkForNewNotifications();
    // Mark all notifications as read when user clicks notification icon
    setTimeout(() => {
      markNotificationsAsRead();
    }, 1000);
    // Navigate to notifications page
    navigate("/dashboard/notifications");
  };

  const logout = () => {
    dispatch(clearEmail());
    sessionStorage.clear();
    persistor.purge();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page-container">
      {/* Top Bar (Integrated) */}
      <div className="topbar">
        {/* Left section: Logo and Hamburger Menu */}
        <div className="topbar-left">
          {/* Logo in Top Bar */}
          <Link to={"/"}>
            <img
              src={getCloudinaryUrl("logo.png")}
              alt="Smart Medics Logo"
              loading="lazy"
              className="logo-image"
            />
          </Link>
          {/* Hamburger button in Top Bar - Always visible on mobile */}
          <button
            className="toggle-btn"
            onClick={toggleSidebar}
          >
            <FaBars  />
          </button>
        </div>

        {/* Right section: Icons and Profile Picture */}
        <div className="topbar-right">
          {/* Question mark icon */}
          {/* <Link to={"/"}>
            <img
              src={getCloudinaryUrl("help.png")}
              alt="Smart Medics Logo"
              loading="lazy"
              className="help-image"
            />
          </Link> */}
          {/* Notifications Icon with SSE Status */}
          <div className="position-relative d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleNotificationClick}>
            {/* <img
              src={getCloudinaryUrl("Vector.png")}
              alt="Notifications"
              loading="lazy"
              className="vactor-image"
            /> */}
            {unreadCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '10px', minWidth: '18px', height: '18px' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            {/* SSE Connection Status Indicator */}
            {/* <div 
              className={`ms-1 rounded-circle ${isConnected ? 'bg-success' : 'bg-secondary'}`}
              style={{ width: '8px', height: '8px' }}
              title={isConnected ? 'Real-time notifications active' : 'Real-time notifications disconnected'}
            /> */}
          </div>

          {/* Profile Picture */}
          <div className="">
       
      <Link to="/dashboard/profile-managment">
        <FaUserCircle size={35} color="#919191ff" />
      </Link>

          </div>
        </div>
      </div>

      {/* Main Layout Area: Sidebar and Content */}
      <div className="main-layout-area">
        {/* Sidebar - Hidden by default on mobile, shown when toggled */}
        <div 
          className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarOpen ? "mobile-open" : ""}`}
        >
          <ul className="sidebar-list">
            <li>
              <NavLink
                to="customer-dashboard"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaTachometerAlt className="sidebar-icon" />
                {!isCollapsed && <span className="sidebar-text">Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="order-management"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaShoppingCart className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Order Management</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="prescription-management"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaFileMedical className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Prescription <br />Management</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="recipient-profile"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaIdCard className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Recipient Profile</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="address-book"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaHome className="sidebar-icon" />
                {!isCollapsed && <span className="sidebar-text">Address Book</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="payment-method"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaCreditCard className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Payment Method</span>
                )}
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="notifications"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaBell className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Notification</span>
                )}
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="profile-managment"
                className="sidebar-item"
                onClick={handleItemClick}
              >
                <FaUserCircle className="sidebar-icon" />
                {!isCollapsed && (
                  <span className="sidebar-text">Profile Management</span>
                )}
              </NavLink>
            </li>
          </ul>
          <ul className="sidebar-list2">
            <li>
              <NavLink to="sign-out" className="sidebar-item" onClick={logout}>
                <FaSignOutAlt className="sidebar-icon" />
                {!isCollapsed && <span className="sidebar-text">Logout</span>}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="content">
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;