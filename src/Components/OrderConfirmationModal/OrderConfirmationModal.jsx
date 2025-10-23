import { getCloudinaryUrl } from "../../utils/cdnImage";
import { useNavigate } from "react-router-dom";

const OrderConfirmationModal = ({
  isOpen,
  setIsOpen,
  orderId,
  onTrackOrder,
  onContinueShopping,
}) => {
  // const estimatedDelivery = new Date();
  // estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
  // const formattedDate = estimatedDelivery.toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  const navigate = useNavigate();
  const TrackOrder = () => {
    setIsOpen(false);
    navigate("/track-order");
  };


  const formattedDate = "45 to 60 minutes";

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content text-center align-items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getCloudinaryUrl('checkmark.svg')}
          alt="Checkmark"
          className="modal-checkmark img-fluid text-center"
        />
        <h2 className="modal-title">Thank You for Your Order!</h2>
        <p className="modal-text">
          Order ID: #{orderId} | Estimated Delivery: {formattedDate}
        </p>
        <div className="modal-buttons d-flex flex-column gap-3">

 <div className="d-flex gap-3">
    <button className="modal-btn track-btn" onClick={onTrackOrder}>
      Preview Invoice
    </button>

  <button className="modal-btn track-btn" onClick={TrackOrder}>
    Track Order
  </button>
</div>

    <div className="d-flex justify-content-center">
  <button className="modal-btn continue-btn" onClick={onContinueShopping}>
    Continue Shopping
  </button>
  </div>
</div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .modal-checkmark {
          width: 60px;
          margin-bottom: 20px;
        }

        .modal-title {
          color: #2d2d2d;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 24px;
        }

        .modal-text {
          color: #757575;
          margin-bottom: 20px;
          font-size: 16px;
        }

        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .modal-btn {
          padding: 8px 20px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .track-btn {
          background-color: #ffffffff;
          color: #000;
          border: 1px solid #ced4da;
        }

        .continue-btn {
          color: #ffffffff;
         background-color: #000000ff;
          border: 1px solid #ced4da;
        }

        .track-btn:hover {
          background: linear-gradient(
            107.85deg,
            #00969e 1.08%,
            #09c6b2 144.46%
          );
          color: #fff;
        }

        .continue-btn:hover {
          background: linear-gradient(
            107.85deg,
            #00969e 1.08%,
            #09c6b2 144.46%
          );
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmationModal;