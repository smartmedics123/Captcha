import { useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import Images from "../../../../assets/Images";
import './PaymentMethod.css';

const PaymentMethod = () => {
  // Data mein 'enabled' property add ki gayi hai
  const [paymentMethods] = useState([
    { id: 1, name: "Easypaisa", image: Images.easypaisa, enabled: false },
    { id: 2, name: "Jazzcash", image: Images.jazzcash, enabled: false },
    { id: 3, name: "Cash on Delivery", image: null, enabled: true },
  ]);

  // Cash on Delivery ko by default select rakha hai (ID: 3)
  const [selectedMethod, setSelectedMethod] = useState(3);

  return (
    <Container className="mt-4 payment-page-container">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Choose Payment Method</h2>
        <p className="text-muted">Select a payment option to complete your order.</p>
      </div>
      
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <div className="payment-options-wrapper">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                // Card ko clickable banaya gaya hai
                onClick={() => method.enabled && setSelectedMethod(method.id)}
                className={`payment-card 
                  ${selectedMethod === method.id ? 'active' : ''}
                  ${!method.enabled ? 'disabled' : ''}`
                }
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {/* Icon ya Image display karne ka logic */}
                    <div className="payment-icon-container">
                      {method.image ? (
                        <img src={method.image} alt={method.name} className="payment-image" />
                      ) : (
                        <FaMoneyBillWave className="payment-icon" />
                      )}
                    </div>
                    <span className="payment-name">{method.name}</span>
                  </div>
                  
                  {/* Selected method par checkmark dikhaye */}
                  {selectedMethod === method.id && (
                    <FaCheckCircle className="selected-checkmark" />
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button 
              className="confirm-payment-btn"
              disabled={!selectedMethod} // Agar kuch select na ho to button disable rahe
            >
              Confirm Payment
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentMethod;