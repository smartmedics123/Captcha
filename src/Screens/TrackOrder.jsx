import React, { useRef, useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import Lottie from "lottie-react";
import { BiCheck, BiSearch } from "react-icons/bi";


function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [stages, setStages] = useState([
    {
      id: "pending",
      label: "Pending",
      labelDetails: "Prescription Under Review",
      completed: false,
      animationPath: () => import("../assets/lottie/botwithbox.json"),
    },
    {
      id: "in progress",
      label: "In Progress",
      labelDetails: "We are working on your order",
      completed: false,
      animationPath: () => import("../assets/lottie/1st.json"), // ✅ Optimize target
    },
    {
      id: "shipped",
      label: "Shipped",
      labelDetails: "Your order on way",
      completed: false,
      animationPath: () => import("../assets/lottie/box.json"),
    },
    {
      id: "delivered",
      label: "Delivered",
      labelDetails: "Enjoy your order",
      completed: false,
      animationPath: () => import("../assets/lottie/enjoyYourorder.json"),
    },
  ]);

  // Normalize API status to match our stage ids
  const normalizeStatus = (status) => {
    if (!status) return '';
    const raw = String(status).trim().toLowerCase();
    // Replace hyphens/underscores with spaces and collapse multiple spaces
    let normalized = raw.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
    // Handle concatenated variants e.g., "inprogress"
    const collapsed = raw.replace(/[-_\s]+/g, '');
    if (collapsed === 'inprogress') normalized = 'in progress';
    if (collapsed === 'orderplaced') normalized = 'pending';
    return normalized;
  };

  // const dummyOrders = [
  //   { _id: "ORD001", status: "pending", estimatedTime: "20:00 - 30:00" },
  //   { _id: "ORD002", status: "in progress", estimatedTime: "15:00 - 25:00" },
  //   { _id: "ORD003", status: "shipped", estimatedTime: "10:00 - 15:00" },
  //   { _id: "ORD004", status: "delivered", estimatedTime: "Delivered" },
  // ];

  const updateStages = async (status) => {
    const normalizedStatus = normalizeStatus(status);
    const currentStageIndex = stages.findIndex((s) => s.id === normalizedStatus);

    if (currentStageIndex !== -1) {
      const updatedStages = stages.map((stage, index) => ({
        ...stage,
        completed: index <= currentStageIndex,
      }));
      setStages(updatedStages);

      // Dynamically import the current animation
      const animationModule = await stages[currentStageIndex].animationPath();
      setCurrentAnimation(animationModule.default);
    }
  };

  const fetchOrderStatus = async () => {
  setLoading(true);
  setError("");

  try {
    // ✅ Updated to use unified order status endpoint
    const response = await fetch(`${API_BASE_URL}/orders/order-status/${orderId.trim()}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    });
    if (!response.ok) throw new Error("Order not found");

    const apiResponse = await response.json();
    
    // ✅ Access the data field from the response
    if (apiResponse.status === 'success' && apiResponse.data) {
      const orderData = {
        _id: apiResponse.data.orderNumber, // Use orderNumber as _id for compatibility
        status: apiResponse.data.status,
        estimatedTime: apiResponse.data.estimatedTime,
        orderNumber: apiResponse.data.orderNumber,
        orderType: apiResponse.data.orderType
      };
      
      setOrderDetails(orderData);
      await updateStages(orderData.status);
    } else {
      throw new Error("Invalid response format");
    }
    
    setLoading(false);

    setTimeout(() => {
      trackingRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (err) {
    setLoading(false);
    setError("Order not found. Please try again.");
  }
};

  const handleTrackOrder = (e) => {
    e?.preventDefault();
    if (orderId.trim()) {
      fetchOrderStatus();
    } else {
      setError("Please enter a valid order number.");
    }
  };

  const currentStageIndex = orderDetails
    ? stages.findIndex((stage) => stage.id === normalizeStatus(orderDetails.status || ''))
    : -1;
  const completedStages = stages.filter((stage) => stage.completed).length;
  const progressPercentage = (completedStages / stages.length) * 100;
  const trackingRef = useRef(null);

  return (
    <>
      <SMNavbar />
      <section className="container m-auto py-3 p-2">
        <h1 className="text-center text-primary">Track Your Order</h1>

        <div className="track-bar d-flex justify-content-center align-items-center gap-3 p-3">
          <form className="position-relative d-flex search-container" onSubmit={handleTrackOrder}>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Enter your order number"
            />
            <button type="submit" disabled={loading} className="btn">
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                <BiSearch />
              )}
            </button>
          </form>
          <Button
            onClick={handleTrackOrder}
            disabled={loading}
            className="search-btn fw-medium rounded-pill order-now-btn"
          >
            Track Now
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        )}

        <div ref={trackingRef} className="track-status my-5">
          <div className="p-5 shadow-sm">
            <h2 className="text-primary fs-5">
              {orderDetails ? `Tracking Order: #${orderDetails.orderNumber || orderDetails._id}` : "Enter an order number to track"}
            </h2>
            <div className="steps">
              {stages.map((stage, index) => {
                const isCurrent = index === currentStageIndex;
                return (
                <div key={stage.id} className={`step ${(stage.completed || isCurrent) ? "active" : ""}`}>
                  {index > 0 && (
                    <div
                      className={`step-connector ${
                        (stages[index - 1].completed || (index - 1) === currentStageIndex) && (stage.completed || isCurrent) ? "active" : ""
                      }`}
                    ></div>
                  )}
                  <div className="step-indicator">
                    {(stage.completed || isCurrent) ? <BiCheck className="icon-status" /> : <i className="bi bi-circle" />}
                  </div>
                  <div className="step-content">
                    <h3>{stage.label}</h3>
                    <p>{stage.labelDetails}</p>
                  </div>
                </div>
                );
              })}
            </div>

            <style jsx>{`
              .steps {
                display: flex;
                flex-direction: column;
                position: relative;
              }
              .step {
                display: flex;
                align-items: flex-start;
                position: relative;
                padding-bottom: 30px;
              }
              .step-indicator {
                margin-right: 15px;
                font-size: 24px;
              }
              .step-content {
                flex: 1;
              }
              .step.active .step-content h3 {
                color: #45b8ac;
                font-weight: bold;
              }
            `}</style>
          </div>

          <div className="p-5 shadow-sm">
            <h4 className="fs-6 text-gray text-center">Estimated Time</h4>
            <h3 className="fs-4 text-center">
              {orderDetails ? orderDetails.estimatedTime : "Not available yet"}
            </h3>

            <div className="d-flex justify-content-between align-items-center gap-3 mt-4">
              <p className="fs-6 text-center">
                {orderDetails ? `Order: #${orderDetails.orderNumber || orderDetails._id}` : "Enter your order number"}
              </p>
              <p className="fs-6 text-gray text-center">
                Step {currentStageIndex + 1}/{stages.length}
              </p>
            </div>

            {currentStageIndex >= 0 && currentAnimation && (
              <div
                className="d-inline-block justify-content-center p-5"
                style={{
                  background: "#e6f6f6",
                  borderRadius: "100%",
                }}
              >
                <Lottie
                  className="img-fluid"
                  animationData={currentAnimation}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

            <p className="fs-6 text-primary text-center mt-1">
              {progressPercentage > 0 ? `${progressPercentage}% Completed` : "0% Completed"}
            </p>
            <div className="d-flex gap-3 completed-bar my-3">
              {stages.map((_, index) => (
                <div key={index} className={index <= currentStageIndex ? "active" : ""} />
              ))}
            </div>

            {currentStageIndex >= 0 && (
              <>
                <h3 className="fs-4 text-center">{stages[currentStageIndex].label}</h3>
                <h4 className="fs-5 text-gray text-center">
                  {stages[currentStageIndex].labelDetails}
                </h4>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TrackOrder;
