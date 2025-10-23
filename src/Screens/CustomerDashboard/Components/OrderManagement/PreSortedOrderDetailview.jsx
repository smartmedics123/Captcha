import React from "react";
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";
import { FaDownload, FaCheck } from "react-icons/fa";
import './PreSortedOrderDetailView.css';



// Utility function to trigger a download for a given URL
const downloadImage = (url, filename) => {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(e => console.error("Could not download the image.", e));
};

const PreSortedOrderDetailview = ({ order, isLoading, onClose, breadcrumbLabel }) => {
    console.log('🔥 PreSortedOrderDetailView loaded with order:', order);
    
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" style={{ color: '#00A9A5' }} />
                <p className="ms-3 mb-0">Loading Order Details...</p>
            </Container>
        );
    }

    const orderInfo = order?.order_info || order || {};
    const recipientFirstName = order?.customer?.name?.split(' ')[0] || order?.firstName || 'N/A';
    const recipientLastName = order?.customer?.name?.split(' ')[1] || order?.lastName || '';
    const recipientAddress = order?.address || 'N/A';
    
    // Support both old and new data structures
    const prescriptionItems = order?.order_detail || order?.items || [];
    const prescriptionImages = order?.prescription_image_url || order?.presortedDetails?.prescriptionImages || [];
    
    // Debug: Log the full order object to see its structure
    console.log('Debug order object structure:', {
        fullOrder: order,
        orderInfo: orderInfo,
        prescriptionItems: prescriptionItems,
        firstItem: prescriptionItems[0]
    });
    const prescriptionImageUrl = Array.isArray(prescriptionImages) ? prescriptionImages[0] : prescriptionImages;
    const hasItems = prescriptionItems && prescriptionItems.length > 0;
    const isNonsortedOrder = order?.orderType?.toLowerCase() === 'nonsorted';

    // Debug logging
    console.log('DEBUG - Order data:', order);
    console.log('DEBUG - Prescription items:', prescriptionItems);
    console.log('DEBUG - First item:', prescriptionItems[0]);

    // --- Progress Tracker Logic ---
    const progressSteps = [
        { name: "Pending", description: "Prescription Under Review", statusKey: "pending" },
        { name: "In Progress", description: "We are working on your order", statusKey: "in-progress" },
        { name: "Shipped", description: "Your Order is on its Way", statusKey: "shipped" },
        { name: "Delivered", description: "Enjoy your order", statusKey: "delivered" },
    ];
    const statusMap = {
        'pending': 'pending', 'new': 'pending', 'approved': 'in-progress', 'in progress': 'in-progress', 'in_progress': 'in-progress',
        'shipped': 'shipped', 'delivered': 'delivered'
    };
    
    // Debug status mapping
    const rawStatus = order?.status?.toLowerCase() || orderInfo?.status?.toLowerCase();
    console.log('🐛 Status Debug:', {
        rawStatus,
        orderStatus: order?.status,
        orderInfoStatus: orderInfo?.status,
        fullOrder: order
    });
    
    const currentStatusKey = statusMap[rawStatus] || 'pending';
    const statusOrder = ['pending', 'in-progress', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(currentStatusKey);
    
    console.log('🐛 Status Mapping Result:', {
        currentStatusKey,
        currentStatusIndex,
        statusOrder
    });
    // Calculate the width of the progress bar
    const progressPercentage = currentStatusIndex > 0 ? (currentStatusIndex / (progressSteps.length - 1)) * 100 : 0;


    const getMedicationType = (type) => {
        const orderType = type || order?.orderType || orderInfo?.orderType;
        if (orderType?.toLowerCase() === 'presorted' || orderType?.toLowerCase() === 'pre-sorted') {
            return 'Pre-Sorted';
        } else if (orderType?.toLowerCase() === 'nonsorted' || orderType?.toLowerCase() === 'non-sorted') {
            return 'Non-Sorted';
        }
        return orderType || 'N/A';
    };

    // Helper function to extract dosage/strength
    const extractDosage = (item) => {
        // Try formula field first
        if (item.product?.formula) {
            // If formula contains dosage info, extract it
            const formulaMatch = item.product.formula.match(/(\d+\.?\d*\s?(mg|g|ml|mcg))/i);
            if (formulaMatch) {
                return formulaMatch[0];
            }
        }
        
        // Try to extract dosage from title
        const title = item.product?.title || '';
        console.log('Extracting dosage from title:', title);
        
        // More specific regex to match dosage at the end of product names
        const dosageMatch = title.match(/(\d+\.?\d*)\s?(mg|g|ml|mcg)\b/i);
        if (dosageMatch) {
            console.log('Dosage match found:', dosageMatch[0]);
            return dosageMatch[0];
        }
        
        // Try other possible fields
        if (item.strength) {
            return item.strength;
        }
        if (item.dosage) {
            return item.dosage;
        }
        
        // Default fallback
        return '4mg';
    };

    // --- Financial Summary Logic ---
    console.log('Debug pricing calculations:', {
        prescriptionItems,
        totalPriceFromOrder: orderInfo?.totalPrice,
        totalAmountFromOrder: order?.totalAmount,
        itemsCount: prescriptionItems.length
    });
    
    // Try multiple pricing fields - check order level total first, then calculate from items
    const orderTotal = parseFloat(order?.totalAmount || orderInfo?.totalPrice || orderInfo?.total_price || 0);
    const itemsSubtotal = prescriptionItems.reduce((sum, item) => {
        // Use the correct field names from API response
        const itemPrice = parseFloat(item.totalPrice || item.total_price || item.pricePerUnit || item.price_pu || 0);
        console.log('Item price calculation:', { 
            item: item.product?.title, 
            totalPrice: item.totalPrice,
            pricePerUnit: item.pricePerUnit,
            quantity: item.quantity,
            calculatedTotal: itemPrice,
            rawItem: item 
        });
        return sum + itemPrice;
    }, 0);
    
    const subtotal = orderTotal > 0 ? orderTotal : itemsSubtotal;
    const taxRate = 0.05; // 5%
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;
    
    console.log('Final pricing:', { orderTotal, itemsSubtotal, subtotal, tax, grandTotal });

    return (
        <Container fluid className="order-detail-container">
            {/* Header */}
            <div className="order-detail-header">
                <h2 className="order-detail-title">
                    <span className="breadcrumb-separator" onClick={onClose}>
                        {breadcrumbLabel || 'Active Orders'}
                    </span>
                    <span className="breadcrumb-separator">&gt; </span>
                    <span className="breadcrumb-separator">
                        ID-{order?.orderNumber || order?.id || orderInfo?.id || 'N/A'}
                    </span>
                  
                </h2>
               
            </div>

            {/* Main Content */}
            <Row>
                {/* Left Column */}
               
                
                    {/* Progress Tracker */}
                 <div className="card-title">
                           <h4 >Progress Tracker</h4>
                    <div className="detail-card track-order mb-4">
                        <p className="text-primary track">Tracking Order: #{order?.orderNumber || orderInfo?.order_id || 'N/A'}</p>
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
        {/* Order Summary */}
                    {hasItems && (
                        <>

                   <div className="order-summary-section mb-4 mt-5">
  <h4 className="order-summary-title ms-3 mb-4">Order Summary</h4>
  <div className="row">
    {/* Left Side: Summary - 8 columns for presorted, 12 for nonsorted */}
   <div className={isNonsortedOrder ? "col-12" : "col-lg-8"}>
  <ul className="summary-list mt-3">
    <li className="d-flex">
      <span className="label fw-normal">Invoice ID:</span>
      <span className="value fw-normal">{order?.orderNumber || order?.order_id || orderInfo?.order_id || `INV-${orderInfo?.id || 'N/A'}`}</span>
    </li>
    <li className="d-flex">
      <span className="label fw-normal fw-normal">Recipient:</span>
      <span className="value fw-normal">{`${recipientFirstName} ${recipientLastName}`.trim()}</span>
    </li>
    <li className="d-flex">
      <span className="label fw-normal">Medication Type:</span>
      <span className="value fw-normal">{getMedicationType()}</span>
    </li>
    <li className="d-flex">
      <span className="label fw-normal">Order Date:</span>
      <span className="value fw-normal">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : orderInfo?.created_at || 'N/A'}</span>
    </li>
    <li className="d-flex">
      <span className="label fw-normal">Address:</span>
      <span className="value fw-normal">{recipientAddress}</span>
    </li>
    <li className="d-flex">
      <span className="label fw-normal">Payment Method:</span>
      <span className="value fw-normal">{order?.payment_method || 'Cash on delivery'}</span>
    </li>
  </ul>
</div>


    {/* Right Side: Image - 4 columns (only for presorted orders) */}
    {!isNonsortedOrder && (
    <div className="col-lg-4 col-md-12">
      <div >
        {prescriptionImageUrl ? (
          <div className="prescription-image-wrapper">
            <img
              src={prescriptionImageUrl}
              alt="Prescription"
              className="prescription-image1"
              onClick={() => window.open(prescriptionImageUrl, '_blank')}
              crossOrigin="anonymous"
            />
           
              {/* <Button
                variant="primary"
                className="download-btn1 mt-2"
                onClick={() => downloadImage(prescriptionImageUrl, `prescription_${orderInfo?.id}.png`)}
              >
                <FaDownload className="me-2" /> Download
              </Button> */}
        
          </div>
        ) : (
          <p className="text-muted">No prescription image available.</p>
        )}
      </div>
    </div>
    )}
  </div>
</div>


                    {/* Items Table & Financials */}
             
                       <h4 className="order-sum items ms-3">Items</h4>
<div className="ms-3">
    <Table borderless responsive className="items-table">
<tbody className="mb-5">
{prescriptionItems.length > 0 ? (
  prescriptionItems.map((item, index) => (
    // Add <React.Fragment> here
    <React.Fragment key={index}>
      <tr>
        <td>
          {item.product?.title || 'Medicine Name'} ({item.product?.manufacturer || 'Brand-X'})
        </td>
        <td className="text-end">
          {item.quantityType || 'Tab'} | {extractDosage(item)} | {parseFloat(item.totalPrice || item.pricePerUnit || 0).toFixed(2)}
        </td>
      </tr>
      
      {/* This is the second element that needs the wrapper */}
      <tr>
        <td colSpan="2" style={{ padding: 0, border: 0 }}>
          <hr style={{ margin: 0 }} />
        </td>
      </tr>
    </React.Fragment> // Close the fragment
  ))
) : (
   <tr>
      <td className="text-center text-muted">No items found for this order.</td>
    </tr>
)}

  <tr className="summary-row">
  <td style={{ color: '#414143' }}>Subtotal:</td>
    <td className="text-end fw-normal" style={{ color: '#414143' }}>{subtotal.toFixed(2)}</td>
  </tr>
  <tr>
    <td style={{ color: '#414143' }}>Tax (5%):</td>
    <td className="text-end fw-normal " style={{ color: '#414143' }}>{tax.toFixed(2)}</td>
  </tr>
    <tr>
    {/* <td colSpan="2" style={{ padding: '0' }}>
      <hr style={{ marginTop: '1rem', marginBottom: '0' }} />
    </td> */}
  </tr>
  <tr className="">
    <td className="fw-bold "style={{ color: '#000000ff', fontSize: '18px' }}>Grand Total:</td>
    <td className="text-end fw-bold" style={{ color: '#000000ff', fontSize: '18px' }}>{grandTotal.toFixed(2)}</td>
  </tr>
</tbody>

</Table>
<div className="button-container">
  <Button onClick={onClose} className="last mt-3">
    Close
  </Button>
</div>
</div>


                    </>
                    )}
                    {!hasItems && (
                               <div className="text-center py-5">
                                <img
                                    src="https://res.cloudinary.com/dc5nqer3i/image/upload/v1753978260/_Layer_.png"
                                    alt="No items found"
                                    className="img-fluid"
                                    style={{ maxWidth: '100%', marginBottom: '1.5rem' }}
                                />
                                
                                <h5 className="text-muted">Prescription Under Review</h5>
                            <div className="button-container">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
                            </div>

                            
                    )}
                 </div>
            

                    {/* Prescription Image */}
                

                {/* Right Column */}
               {/* {!hasItems && (
  <Col lg={4}>
    <div className="detail-card mt-5">
      <h4 className="mb-2">Prescription Image</h4>
      {prescriptionImageUrl ? (
        <div className="prescription-image-wrapper">
          <img
            src={prescriptionImageUrl}
            alt="Prescription"
            className="prescription-image"
            onClick={() => window.open(prescriptionImageUrl, '_blank')}
            crossOrigin="anonymous"
          />
          <div className="image-actions mt-3">
            <Button
              variant="primary"
              className="download-btn"
              onClick={() => downloadImage(prescriptionImageUrl, `prescription_${orderInfo?.id}.png`)}
            >
              <FaDownload className="me-2" /> Download
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
          <p>No prescription image available.</p>
        </div>
      )}
    </div>
  <div className="button-container">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
  </Col>
)} */}
            </Row>
        </Container>
    );
};

export default PreSortedOrderDetailview;