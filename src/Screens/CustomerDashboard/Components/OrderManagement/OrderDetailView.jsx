//OrderDetailView.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import { FaCheck } from "react-icons/fa";

import './OrderDetailView.css';
import { getCloudinaryUrl } from "../../../../utils/cdnImage";

const OrderDetailView = ({ order, isLoading, onClose, breadcrumbLabel }) => {
const navigate = useNavigate();

const orderInfo = order?.order_info;
const recipientFirstName = order?.firstName;
const recipientLastName = order?.lastName;
const recipientAddress = order?.address;
const prescriptionItems = order?.order_detail || [];

const currentStatus = orderInfo?.status?.toLowerCase().replace(' ', '-') || 'pending';
const progressSteps = [
 { name: "Pending", description: "Prescription Under Review", statusKey: "pending" },
{ name: "In Progress", description: "We are working on your order", statusKey: "in-progress" },
 { name: "Shipped", description: "Your Order on Way", statusKey: "shipped" },
{ name: "Delivered", description: "Enjoy your order", statusKey: "delivered" },
];

 const statusOrder = ["pending", "in-progress", "shipped", "delivered"];
const currentStatusIndex = statusOrder.indexOf(currentStatus);
const isStepCurrent = (stepStatusKey) => stepStatusKey === currentStatus;
const isStepCompleted = (stepStatusKey) => {
return statusOrder.indexOf(stepStatusKey) < currentStatusIndex;
 };
const isStepActiveOrCompleted = (stepStatusKey) => {
const stepIndex = statusOrder.indexOf(stepStatusKey);
 return stepIndex <= currentStatusIndex && currentStatusIndex !== -1;
 };

// Calculate the width of the progress bar
const progressPercentage = currentStatusIndex > 0 ? (currentStatusIndex / (progressSteps.length - 1)) * 100 : 0;

 const getMedicationType = (type) => {
if (type?.toLowerCase() === 'pre-sorted') return 'Pre-Sorted';
 if (type?.toLowerCase() === 'non-sorted') return 'Non-Sorted';
return 'N/A';  };

 const calculateSubtotal = () => {
 return prescriptionItems.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
 };

 const subtotal = calculateSubtotal();
const taxRate = 0.05;  const tax = subtotal * taxRate;
 const grandTotal = subtotal + tax;
 
  // --- INLINE STYLES FOR ORDER SUMMARY ---
  const summaryItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0.7rem 0',
    fontSize: '0.95rem'
  };

  const lastSummaryItemStyle = { ...summaryItemStyle, borderBottom: 'none' };

  const labelStyle = {
    flexBasis: '160px', // Fixed width for labels
    flexShrink: 0,
    color: '#555',
    paddingRight: '1rem'
  };

  const valueStyle = {
    flexGrow: 1, // Takes up remaining space
    color: '#222',
    fontWeight: '500',
    textAlign: 'left',
    wordBreak: 'break-word'
  };
  // --- END OF STYLES ---
if (isLoading) {
return (
<Container className="py-5 text-center order-detail-page-container">
<Spinner animation="border" role="status">
<span className="visually-hidden">Loading details...</span>
 </Spinner>
<p className="mt-2">Loading Order Details...</p>
 </Container>
); }

if (!orderInfo) {
return (
<Container className="py-5 text-center order-detail-page-container">
 <div className="alert alert-info" role="alert">
Order details not available or not found.
</div>
<Button onClick={onClose}>Go Back to List</Button>
</Container>
 );}
 
 
return (
<>
<Container>
 <div className="order-detail-header">
<h2 className="order-detail-title">
<span className="breadcrumb-separator" onClick={onClose}>
 {breadcrumbLabel || 'Active Orders'}
</span>
<span className="breadcrumb-separator"> &gt; </span>
<span className="breadcrumb-separator">ID-{orderInfo?.id || 'N/A'}</span>
</h2>
 </div>

<Container >
 {/* Progress Tracker Section */}
 <div className="card-title">
  <h4>Progress Tracker</h4>
  <div className="detail-card track-order mb-4">
    <p className="text-primary track">Tracking Order: #{orderInfo?.order_id || 'N/A'}</p>
    
    {/* Progress Tracker */}
    <div className="progress-tracker-wrapper">
      <div className="progress-bar-background d-none d-sm-flex"></div>
      <div 
        className="progress-bar-foreground d-none d-sm-flex" 
        style={{ width: `${progressPercentage}%` }}
      ></div>
      
      {/* Steps Container */}
      <div className="steps-container">
        {progressSteps.map((step, index) => {
          const stepStatusIndex = statusOrder.indexOf(step.statusKey);
          let statusClass = '';
          if (stepStatusIndex < currentStatusIndex) {
            statusClass = 'completed';
          } else if (stepStatusIndex === currentStatusIndex) {
            statusClass = 'active';
          }
          return (
            <div key={step.name} className={`progress-step ${statusClass}`}>
              <div className="step-indicator">
                {statusClass === 'completed' && <FaCheck/>}
              </div>
              <div className="step-label">
                <p className="step-name">{step.name}</p>
                <p className="step-descriptions">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
 </div>
     
        <div className="mb-4 mt-5">
          <h4 className="">Order Summary</h4>
          <div className="row">
            <div className="col-lg-8">
              <div style={{ marginTop: '1rem' }}>
                <div style={summaryItemStyle}>
                  <span style={labelStyle}>Invoice ID:</span>
                  <span style={valueStyle}>{order?.invoice_id || 'INV-00014'}</span>
                </div>
                <div style={summaryItemStyle}>
                  <span style={labelStyle}>Recipient:</span>
                  <span style={valueStyle}>{`${recipientFirstName || 'Amna'} ${recipientLastName || 'Khan'}`}</span>
                </div>
                <div style={summaryItemStyle}>
                  <span style={labelStyle}>Medication Type:</span>
                  <span style={valueStyle}>{getMedicationType(orderInfo?.medicationType) || 'Non-Sorted'}</span>
                </div>
                <div style={summaryItemStyle}>
                  <span style={labelStyle}>Order Date:</span>
                  <span style={valueStyle}>{orderInfo?.created_at || '14/08/2025'}</span>
                </div>
                <div style={summaryItemStyle}>
                  <span style={labelStyle}>Address:</span>
                  <span style={valueStyle}>{recipientAddress || 'Orangi Town, Karachi'}</span>
                </div>
                <div style={lastSummaryItemStyle}>
                  <span style={labelStyle}>Payment Method:</span>
                  <span style={valueStyle}>{order?.payment_method || 'Cash on Delivery'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* === END: Order Summary Section === */}

{/* Items Section */}
 <div className="items-card ">
<Table responsive borderless className="items-table">
 <thead className="items-header">
<tr>
 <th style={{ width: '50%' }}>Product Name</th>
<th style={{ width: '30%' }}>Quantity</th>
<th style={{ width: '20%' }} className="text-end">Price</th>
 </tr>
</thead>
 <tbody>


{prescriptionItems.length > 0 ? (
 prescriptionItems.map((item, index) => (
 <tr key={index}>
<td className="fw-normal">
{item.product?.title || 'Medicine Name'} ({item.product?.manufacturer || 'Brand-X'})
 </td>
 <td className="fw-normal">
 Qty {item.quantity || '01'} | {item.quantityType || 'Tab'} | {item.product?.strength || '500mg'}
</td>
<td className="text-end fw-normal">
 {parseFloat(item.price_pu || 0).toFixed(2)}
 </td>
</tr>
))
 ) : (
 <tr>
<td colSpan="3" className="text-center py-3 text-muted">
No items found for this order.
</td>
</tr>
 )}

 <tr className="blank-row"><td colSpan="3"></td></tr>
 <tr>
<td className="fw-normal">Subtotal:</td>
 <td colSpan="2" className="text-end fw-normal">{subtotal.toFixed(2)}</td>
 </tr>
 <tr>
 <td className="fw-normal">Tax (5%):</td>
<td colSpan="2" className="text-end fw-normal">{tax.toFixed(2)}</td>
 </tr>
<tr className="border-top-strong">
 <td className="fw-bold">Grand Total:</td>
<td colSpan="2" className="text-end fw-bold">{grandTotal.toFixed(2)}</td>
</tr>
</tbody>
</Table>
          <div className="button-container">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
</div>
</Container>
 </Container>
</>
);
};

export default OrderDetailView;