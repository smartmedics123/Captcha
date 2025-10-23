import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Dropdown, Form, Modal } from 'react-bootstrap';

import {   FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaCalendarAlt} from 'react-icons/fa';
import './Default.css';
import { fetchDashboardCounts, fetchRecentOrders } from '../../../../../services/CustomerDashboard/dashboard';
import { fetchCustomerProfile } from '../../../../../services/CustomerDashboard/profile';
import { useNavigate } from 'react-router-dom';

const Default = () => {
    const navigate = useNavigate();
    const [activeOrders, setActiveOrders] = useState(0);
    const [uploadedPrescriptions, setUploadedPrescriptions] = useState(0);
    const [recipientsLinked, setRecipientsLinked] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [userName, setUserName] = useState('');
    const ordersPerPage = 4;
const [originalOrders, setOriginalOrders] = useState([]); 
const [sortOption, setSortOption] = useState("");
const [dateFilter, setDateFilter] = useState("");
const [showDateModal, setShowDateModal] = useState(false);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [tempFromDate, setTempFromDate] = useState("");
const [tempToDate, setTempToDate] = useState("");


const handleSort = (option) => {
  setSortOption(option);
  let sortedOrders = [...recentOrders];

  if (option === "Order Number") {
    sortedOrders.sort((a, b) => {
      const aNum = a.orderNumber || "";
      const bNum = b.orderNumber || "";
      return aNum.localeCompare(bNum);
    });
  } else if (option === "Order Date") {
    sortedOrders.sort((a, b) => {
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        
        if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
          return new Date(dateStr);
        } else if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        } else if (dateStr.includes("-")) {
          const [day, month, year] = dateStr.split("-");
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
        return new Date(dateStr);
      };
      
      const dateA = parseDate(a.orderDate);
      const dateB = parseDate(b.orderDate);
      return dateB - dateA; // Latest first
    });
  } else if (option === "Address") {
    sortedOrders.sort((a, b) => {
      const aAddr = a.address || "";
      const bAddr = b.address || "";
      return aAddr.localeCompare(bAddr);
    });
  } else if (option === "Medication Type") {
    sortedOrders.sort((a, b) => {
      const aType = a.medicationType || "";
      const bType = b.medicationType || "";
      return aType.localeCompare(bType);
    });
  }

  setRecentOrders(sortedOrders);
};
const handleDateFilter = (option) => {
  setDateFilter(option);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of today
  
  if (option === "Custom Range") {
    setShowDateModal(true);
    return;
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    // Try different date formats
    let date;
    
    // Check if it's already in YYYY-MM-DD format
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
      date = new Date(dateStr);
    } 
    // Check if it's in DD/MM/YYYY format
    else if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }
    // Check if it's in DD-MM-YYYY format
    else if (dateStr.includes("-")) {
      const [day, month, year] = dateStr.split("-");
      date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }
    else {
      date = new Date(dateStr);
    }
    
    return isNaN(date.getTime()) ? null : date;
  };

  let filteredOrders = [...originalOrders];

  if (option === "Today") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = parseDate(order.orderDate);
      if (!orderDate) return false;
      return orderDate >= startOfToday && orderDate <= today;
    });
  } else if (option === "Last 7 Days") {
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);
    
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = parseDate(order.orderDate);
      if (!orderDate) return false;
      return orderDate >= last7Days && orderDate <= today;
    });
  } else if (option === "Last 30 Days") {
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);
    last30Days.setHours(0, 0, 0, 0);
    
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = parseDate(order.orderDate);
      if (!orderDate) return false;
      return orderDate >= last30Days && orderDate <= today;
    });
  } else if (option === "All") {
    filteredOrders = [...originalOrders];
  }

  setCurrentPage(1);
  setRecentOrders(filteredOrders);
};

const handleCustomDateFilter = () => {
  if (!tempFromDate || !tempToDate) {
    alert("Please select both from and to dates");
    return;
  }

  const fromDateObj = new Date(tempFromDate);
  const toDateObj = new Date(tempToDate);
  toDateObj.setHours(23, 59, 59, 999); // Set to end of selected date
  
  if (fromDateObj > toDateObj) {
    alert("From date cannot be later than to date");
    return;
  }

  setFromDate(tempFromDate);
  setToDate(tempToDate);
  setDateFilter(`${tempFromDate} to ${tempToDate}`);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    let date;
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
      date = new Date(dateStr);
    } else if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    } else if (dateStr.includes("-")) {
      const [day, month, year] = dateStr.split("-");
      date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    } else {
      date = new Date(dateStr);
    }
    
    return isNaN(date.getTime()) ? null : date;
  };

  let filteredOrders = originalOrders.filter((order) => {
    const orderDate = parseDate(order.orderDate);
    if (!orderDate) return false;
    return orderDate >= fromDateObj && orderDate <= toDateObj;
  });

  setCurrentPage(1);
  setRecentOrders(filteredOrders);
  setShowDateModal(false);
};

const resetFilters = () => {
  setDateFilter("");
  setSortOption("");
  setFromDate("");
  setToDate("");
  setTempFromDate("");
  setTempToDate("");
  setRecentOrders([...originalOrders]);
  setCurrentPage(1);
};




    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('🏠 Dashboard: Starting to fetch data...');
                const [counts, profile, orders] = await Promise.all([
                  fetchDashboardCounts(),
                  fetchCustomerProfile(),
                  fetchRecentOrders()
                ]);
                console.log('🏠 Dashboard: Counts received:', counts);
                console.log('🏠 Dashboard: Profile received:', profile);
                console.log('🏠 Dashboard: Recent orders received:', orders);
                
                setActiveOrders(counts.activeOrders);
                setUploadedPrescriptions(counts.uploadedPrescriptions);
                setRecipientsLinked(counts.recipientsLinked);
                setRecentOrders(orders);
                setOriginalOrders(orders); // Store original orders
                setUserName(
                  (profile.firstName || '') + (profile.lastName ? ' ' + profile.lastName : '')
                );
            } catch (err) {
                console.error('❌ Dashboard: Error fetching data:', err);
                // Set empty arrays to prevent undefined errors
                setRecentOrders([]);
                setOriginalOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = recentOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(recentOrders.length / ordersPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
 const getVisiblePages = () => {
    if (window.innerWidth <= 576) {
      let start = currentPage;
      let end = start + 1;

      // Prevent going out of bounds
      if (end > totalPages) {
        start = totalPages - 1;
        end = totalPages;
      }
      if (start < 1) start = 1;

      return Array.from(
        { length: Math.min(2, totalPages) },
        (_, i) => start + i
      );
    } else {
      // Show all on desktop
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  };
  
    return (
        <Container fluid className="container-fluid">
      <div className="welcome-section d-flex flex-md-row justify-content-between align-items-center mb-4">
  <h2 className="welcome-text d-flex">
    Welcome <span className='name'>{userName ? `, ${userName}` : ''}!</span>
  </h2>
  <p className="current-date mb-0 fs-md-1">Today's Date: June 12, 2025</p>
</div>

<Row className="dashboard-summary-cards mb-3">
  {/* Active Orders Card */}
  {/* Mobile par 6, Tablet par 6, Desktop par 4 columns lega */}
  <Col lg={4} md={6} sm={6} className="mb-3 ">
    <Card className="summary-card active-orders-card ">
      <Card.Body>
        <div className="d-flex align-items-center cube-box">
          <img src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1754663677/Active_Order.png" alt="Cube Icon" className="cube-icon" />
          <h4 className="cube-text responsive-heading">Active Orders</h4>
        </div>
        <h4 className="card-number mt-3">{activeOrders < 10 ? `0${activeOrders}` : activeOrders}</h4>
      </Card.Body>
    </Card>
  </Col>

  {/* Prescription Card */}
  {/* Mobile par 6, Tablet par 6, Desktop par 4 columns lega */}
  <Col lg={4} md={6} sm={6} className="mb-3">
    <Card className="summary-card prescription-card">
      <Card.Body>
        <div className="d-flex align-items-center mt-2">
          <img 
            src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1754664030/Prescription_order.png" 
            alt="Prescription Icon" 
            className="prescription-icon me-4" 
          />
          <h4 className="cube-text d-inline-flex align-items-baseline m-0">
            <span className="nowrap smalltext">Upload</span>
            <span className="nowrap ms-md-1 smalltext">Prescription</span>
          </h4>
        </div>
        <p className="card-number  mt-md-3 mb-0 ms-3 ms-md-1 number-prescription">
          {uploadedPrescriptions < 10 ? `0${uploadedPrescriptions}` : uploadedPrescriptions}
        </p>
      </Card.Body>
    </Card>
  </Col>

  {/* Recipients Linked Card */}
  {/* Mobile par 12, Tablet par 12, aur Desktop par 4 columns lega */}
  
  <Col lg={4} md={6} sm={6} className="mb-3">
    <Card className="summary-card recipients-linked-card ">
        <Card.Body>
            <div className="d-flex align-items-center cube-box">
                <img
                    src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1754664779/Recipient_Profile.png"
                    alt="Recipient Icon"
                    className="recipient-icon"
                />
                <h4 className="cube-text">Recipients Linked</h4>
            </div>
            <h4 className="card-number mt-4">
                {recipientsLinked < 10 ? `0${recipientsLinked}` : recipientsLinked}
            </h4>
        </Card.Body>
    </Card>
</Col>

</Row>


            <div className="RecentOrder">
             <Card.Header className="header bg-white">
                <div className="d-flex flex-column sort flex-md-row justify-content-between align-items-start align-items-md-center">
                    <h3 className="mb-3 mb-md-0 reOrder" style={{
                        fontWeight: 600,
                        fontSize: '24px',
                        color: '#000000'
                    }}>
                        Recent Orders
                    </h3>
                    <div className="sort-buttons-container d-flex gap-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" className="btnDateSort d-flex align-items-center">
                          
                          <span>{dateFilter || "Date Filter"}</span>
                          
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleDateFilter("Today")}>Today</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDateFilter("Last 7 Days")}>Last 7 Days</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDateFilter("Last 30 Days")}>Last 30 Days</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDateFilter("Custom Range")}>Custom Range</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDateFilter("All")}>All</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" className="btnDateSort d-flex align-items-center">
                          <span>{sortOption || "Sort By"}</span>
                          
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleSort("Order Number")}>Order Number</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSort("Order Date")}>Order Date (Latest First)</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSort("Address")}>Address</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSort("Medication Type")}>Medication Type</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      {(dateFilter || sortOption) && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={resetFilters}
                          className="reset-btn"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                </div>
            </Card.Header>
                <Card.Body className="p-0">
                    <hr />
                    <div className="table-responsive">
                        <Table hover className="recent-orders-table mb-0 order-table">
                            <thead>
                                <tr >
                                    <th className='col-id'>ID</th>
                                    <th  className='recent-order '>Order Number</th>
                                    <th className='col-order-date'>Order Date</th>
                                    {/* <th className='col-address'>Address</th> */}
                                    <th className=''>Medication Type</th>
                             <th className='text-center action-header col-action'>Action</th>


                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Loading orders...</td>
                                    </tr>
                                ) : currentOrders && currentOrders.length > 0 ? (
                                    currentOrders.map((order , index) => (
                                        <tr key={order.id} >
                                            <td className='col-id'>{index + 1 }</td>
                                            <td className=''>{order.orderNumber}</td>
                                            <td className='col-order-date'>{order.orderDate}</td>
                                            {/* <td className='col-address'>{order.address}</td> */}
                                            <td className='presorted-text'>{order.medicationType}</td>
                                            <td className='col-action'>
                                                 
                                                 <Button size="sm"
                                                  className="custom-view-button1 me-3"
                                                  onClick={() => {
                                                    navigate('/dashboard/order-management');
                                                    window.location.reload();
                                                  }}>

              View
            </Button>
                                                {/* <Button size="sm" className="delete-btn">Cancel</Button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No recent orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <hr />
                    </div>
                  <div className="pagination-container d-flex flex-nowrap justify-content-between align-items-center pb-2 mb-3">
<Button
  variant="light"
  onClick={handlePrevious}
  disabled={currentPage === 1}
  className="custom-pagination-btn"
     style={{ marginLeft: '20px', padding: "10px", }}
>
  <FaChevronLeft style={{ marginRight: '8px' }} /> Previous
</Button>

    <div className="d-flex justify-content-center align-items-center pagination-container">
      {getVisiblePages().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "primary" : "light"}
          onClick={() => setCurrentPage(page)}
          className={`mx-1 ${currentPage === page ? "active-page-btn" : "page-btn"}`}
     style={{overflow:"hidden"}}
        >
          {page}
        </Button>
      ))}
    </div>

    <Button
        variant="light"
        onClick={handleNext}
        disabled={currentPage === totalPages}
       className="custom-pagination-btn"
        style={{ marginRight: '20px', padding: "10px", }}
    >
        Next <FaChevronRight style={{ marginLeft: '14px' }} />
    </Button>
</div>

                </Card.Body>
            </div>

            {/* Date Range Picker Modal */}
            <Modal show={showDateModal} onHide={() => setShowDateModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Select Date Range</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>From Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={tempFromDate}
                          onChange={(e) => setTempFromDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>To Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={tempToDate}
                          onChange={(e) => setTempToDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCustomDateFilter}>
                  Apply Filter
                </Button>
              </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Default;