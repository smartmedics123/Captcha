import { Modal, Button, Row, Col, Card } from "react-bootstrap";
// Neeche di gayi CSS file ka naam aap apne project ke hisab se change kar sakte hain
import './NonSortedModal.css'; 

const NonSortedModal = ({
  showModal,
  setShowModal,
  selectedOrder,
  handleRenewOrder,
  isLoadingOrder,
}) => {
  const isDelivered =
    selectedOrder?.order_info?.nonsorted_status?.toLowerCase() === "delivered";

  // Calculate totals
  const subtotal = selectedOrder?.order_detail?.reduce(
    (sum, item) => sum + parseFloat(item.total_price || 0), 0
  ) || 0;
  const tax = subtotal * 0.05; // 5% Tax
  const grandTotal = subtotal + tax;

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      className="non-sorted-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-custom">
          Order Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoadingOrder ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {selectedOrder?.order_detail?.map((item, idx) => (
                <Col md={4} key={idx}>
                  <Card className="product-card h-100">
                    <Card.Img
                      variant="top"
                      src={
                        item.image ||
                        "https://placehold.co/300x200?text=No+Image"
                      }
                      className="product-card-image"
                    />
                    <Card.Body>
                      <Card.Title className="product-title">{item.product_name}</Card.Title>
                      <Card.Text className="product-details">
                        <span>Price: <strong>${parseFloat(item.price_pu).toFixed(2)}</strong></span>
                        <span>Quantity: <strong>{item.quantity}</strong></span>
                      </Card.Text>
                      <Button variant="primary" className="add-to-cart-btn w-100">
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <hr className="summary-divider" />

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row grand-total">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="footer-close-btn" onClick={() => setShowModal(false)}>
          Close
        </Button>
        {isDelivered && (
          <Button
            variant="primary"
            className="footer-reorder-btn"
            onClick={() => handleRenewOrder(selectedOrder?.order_info?.order_id)}
          >
            Re-Order
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NonSortedModal;