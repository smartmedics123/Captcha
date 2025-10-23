import { useEffect, useState } from 'react';
import { FaChevronRight, FaChevronLeft, FaBoxOpen, FaCheckCircle, FaShippingFast, FaTimesCircle, FaDollarSign, FaBell, FaInfoCircle } from "react-icons/fa";
import { Container, Form, Button } from 'react-bootstrap';
import './Notifications.css';
import { emailNotifications, fetchNotificaitions, NotificationToggle, smsNotifications } from '../../../../services/CustomerDashboard/NotificationsToggle';
import LoadingSpinner from '../../../../Components/Spinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNotifications } from '../../../../context/NotificationContext_optimized';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loader, setLoader] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const itemsPerPage = 10;
  const { updateUnreadCount, markNotificationsAsRead } = useNotifications();

  // Mark all notifications as read when page is visited
  useEffect(() => {
    const timer = setTimeout(() => {
      markNotificationsAsRead();
    }, 1000);

    return () => clearTimeout(timer);
  }, [markNotificationsAsRead]);

  // --- Helper function for dynamic icons ---
  const getNotificationIcon = (item) => {
    const title = (item.title || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const fullText = `${title} ${description}`;

    let icon;
    let color;

    if (fullText.includes('delivered')) {
      icon = <FaCheckCircle />;
      color = '#28a745'; // Green
    } else if (fullText.includes('shipped') || fullText.includes('on its way')) {
      icon = <FaShippingFast />;
      color = '#17a2b8'; // Info Blue
    } else if (fullText.includes('order placed') || fullText.includes('new order')) {
      icon = <FaBoxOpen />;
      color = '#007bff'; // Primary Blue
    } else if (fullText.includes('cancelled')) {
      icon = <FaTimesCircle />;
      color = '#dc3545'; // Red
    } else if (fullText.includes('payment') || fullText.includes('paid')) {
      icon = <FaDollarSign />;
      color = '#ffc107'; // Yellow
    } else if (fullText.includes('reminder')) {
      icon = <FaBell />;
      color = '#6f42c1'; // Purple
    } else {
      icon = <FaInfoCircle />;
      color = '#6c757d'; // Gray
    }

    return (
      <div
        className="notification-icon-container"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
    );
  };

  // --- FIXED Toggle Handlers ---
  const handleEmailToggle = async () => {
    const originalValue = emailEnabled;
    const newValue = !originalValue;
    try {
      await emailNotifications(newValue);
      setEmailEnabled(newValue);
      toast.success(
        `Email notifications ${newValue ? "enabled" : "disabled"}`,
        { position: "bottom-left", autoClose: 1500, hideProgressBar: true }
      );
    } catch (error) {
      toast.error("Failed to update settings. Please try again.", { position: "bottom-left" });
      console.error('Failed to update email notifications:', error);
      // Revert state on failure
      setEmailEnabled(originalValue);
    }
  };

  const handlesmsToggle = async () => {
    const originalValue = smsEnabled;
    const newValue = !originalValue;
    try {
      await smsNotifications(newValue);
      setSmsEnabled(newValue);
      toast.success(
        `SMS notifications ${newValue ? "enabled" : "disabled"}`,
        { position: "bottom-left", autoClose: 1500, hideProgressBar: true }
      );
    } catch (error) {
      toast.error("Failed to update settings. Please try again.", { position: "bottom-left" });
      console.error('Failed to update sms notifications:', error);
      // Revert state on failure
      setSmsEnabled(originalValue);
    }
  };

  // Fetch toggle settings on mount
  useEffect(() => {
    const fetchToggleSettings = async () => {
      try {
        const data = await NotificationToggle();
        setSmsEnabled(data.sms_notif === 1);
        setEmailEnabled(data.email_notif === 1);
      } catch (error) {
        console.error('Error fetching notification toggle settings:', error.message);
      }
    };
    fetchToggleSettings();
  }, []);

  // Fetch notifications based on page
  useEffect(() => {
    const fetchNotificationsData = async (page) => {
      setLoader(true);
      try {
        const response = await fetchNotificaitions(page, itemsPerPage);
        const { data, last_page, total } = response;
        
        // Transform notifications to ensure proper read status
        const transformedNotifications = (data || []).map(notification => ({
          ...notification,
          // Use database field as source of truth
          isRead: notification.notification_read || false,
          is_read: notification.notification_read || false,
          // Ensure title exists
          title: notification.title || notification.description?.split('.')[0] || 'Notification'
        }));
        
        setNotifications(transformedNotifications);
        setTotalPages(last_page || 1);
        setTotalNotifications(total || data?.length || 0);
        
        console.log('📄 Notifications fetched:', {
          page,
          total: transformedNotifications.length,
          totalPages: last_page
        });
      } catch (error) {
        setNotifications([]);
        setTotalPages(1);
        setTotalNotifications(0);
        console.error('Error fetching notifications:', error.message);
        toast.error('Failed to load notifications');
      } finally {
        setLoader(false);
      }
    };
    fetchNotificationsData(currentPage);
  }, [currentPage]);

  // Pagination helpers
  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return { startPage, endPage, pageNumbers };
  };

  const { startPage, endPage, pageNumbers } = getPaginationNumbers();

  return (
    <>
      <div className='mb-5'>
        <h2 className='fw-bold ms-5 notification-heading'>Notifications</h2>
      </div>

      <Container className='mt-2 notification-container'>
        <div
          style={{
            background: "linear-gradient(to right, #00969E, #00969E)",
            color: "#fff",
            padding: "10px 15px",
            fontWeight: "bold",
            borderRadius: "5px 5px 0 0",
            fontSize: "1.1rem",
            width: "100%"
          }}
        >
          All Notifications ({totalNotifications.toString().padStart(2, "0")})
        </div>

        {loader ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="list-group">
              {notifications.length > 0 ? (
                notifications.map((item, index) => {
                  let timeAgo = '';
                  let formattedDate = '';
                  if (item.created_at) {
                    const createdDate = new Date(item.created_at);
                    formattedDate = createdDate.toLocaleDateString();
                    const diffMs = Date.now() - createdDate.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    if (diffMins < 1) timeAgo = "Just now";
                    else if (diffMins < 60) timeAgo = `${diffMins} minutes ago`;
                    else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)} hours ago`;
                    else timeAgo = `${Math.floor(diffMins / 1440)} days ago`;
                  }

                  return (
                    <div
                      key={item.id || index}
                      className="list-group-item d-flex align-items-center border-0 border-bottom"
                      style={{ backgroundColor: '#fff' }}
                    >
                      {/* DYNAMIC ICON */}
                      <div className="me-3">
                        {getNotificationIcon(item)}
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="fw-bold" style={{ fontSize: "1rem", color: "#333" }}>
                          {item.title || 'Notification'}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                          {item.description}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                          {timeAgo}
                        </div>
                      </div>

                      {/* Date */}
                      <small className="text-muted align-self-start mt-1" style={{ fontSize: "0.8rem" }}>
                        {formattedDate}
                      </small>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted py-4">
                  No New Notifications
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <Button
                  className="pagination-arrow"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                  <span className="d-none d-sm-inline ms-2">Previous</span>
                </Button>

                <div className="pagination-numbers">
                  {startPage > 1 && (
                    <>
                      <Button className="pagination-number" onClick={() => paginate(1)}>1</Button>
                      {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                    </>
                  )}
                  {pageNumbers.map((number) => (
                    <Button
                      key={number}
                      className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Button>
                  ))}
                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                      <Button className="pagination-number" onClick={() => paginate(totalPages)}>
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  className="pagination-arrow"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="d-none d-sm-inline me-2">Next</span>
                  <FaChevronRight />
                </Button>
              </div>
            )}

            {/* Toggles */}
            <div className="notification-toggles mt-5">
              <Form>
                <Form.Check
                  type="switch"
                  id="sms-notification-switch"
                  label="Enable SMS notifications"
                  checked={smsEnabled}
                  onChange={handlesmsToggle}
                />
                <Form.Check
                  type="switch"
                  id="email-notification-switch"
                  label="Enable Email notifications"
                  checked={emailEnabled}
                  onChange={handleEmailToggle}
                />
              </Form>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Notifications;