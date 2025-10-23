import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { address } from '../../../services/CustomerDashboard/address';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RenewOrder = () => {
  const { orderId } = useParams();
  const [addresses, setAddresses] = useState([

  ]);
  const [selectedAddress, setSelectedAddress] = useState(''); // Added for dropdown
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(''); // State to handle selected duration
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await address();
        if (Array.isArray(response.data)) {
          setAddresses(response.data);
          setSelectedAddress(response.data[0]?.address); // Automatically select the first address
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        Swal.fire('Error', 'Failed to load addresses', 'error');
      }
    };

    fetchAddress();
  }, []);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/view/${orderId}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
        const data = response.data.data; // Updated to access nested data
        console.log("unified orders response:",response.data);
        
        const baseImageUrl = API_BASE_URL.replace("/api", "");
               
        data.images = data.images?.map((img) => {
          if (!img.filePath) return null;
          return img.filePath.startsWith("http")
            ? img.filePath
            : `${baseImageUrl}/${img.filePath.replace("storage/storage", "storage")}`;
        }).filter(Boolean);

        setOrderDetails(data);
        setSelectedDuration(data.durationNumber); // Set initial duration
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch order details', 'error');
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleOrderUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/orders/edit`, { orderNumber: orderId, ...orderDetails });
      Swal.fire('Success', 'Order has been updated', 'success');
      navigate('/order-history');
    } catch (error) {
      Swal.fire('Error', 'Failed to update the order', 'error');
    }
  };

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Card className='border-0'>
      <h1 className='text-center mainhead fw-bold '>RenewOrder Form</h1>

        <Card.Body>
          <Form onSubmit={handleOrderUpdate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{backgroundColor:"#E8E8E8"}}
                    readOnly
                    defaultValue={orderDetails.firstName}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.lastName}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    readOnly
                    style={{backgroundColor:"#E8E8E8"}}

                    defaultValue={orderDetails.email}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.phone}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>OrderingFor</Form.Label>
                  <Form.Control
                    type="text"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.orderingFor}
                  />
                </Form.Group>
              </Col>
             
              <Col md={6}>
                <Form.Group className="mb-3">
               <Form.Label>Number of Duration</Form.Label>
               <Form.Select
                    value={selectedDuration}
                    className='border  border-0'
                    style={{backgroundColor:"#F4F3D5"}}

                    onChange={(e) => setSelectedDuration(e.target.value)}
                    required
                  >
                    {[...Array(60).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Select
                    className='border  border-0'
                   style={{backgroundColor:"#F4F3D5"}}
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {addresses.map((addr, index) => (
                      <option key={index} value={addr.address}>
                        {addr.address}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
            <Col md={12}>
                <Form.Group className="mb-3  ">
                  <Form.Label>Non Prescription Medicine</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className='border  border-0'
                    style={{backgroundColor:"#F4F3D5"}}
                    defaultValue={orderDetails.nonPrescriptionMedicine || 'N/A'}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3  ">
                  <Form.Label>Special Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className='border  border-0'
                    style={{backgroundColor:"#F4F3D5"}}
                    defaultValue={orderDetails.specialInstructions || 'N/A'}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
          <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.orders?.[0]?.price_pu || 'N/A'} // Access price correctly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.orders?.[0]?.quantity || 'N/A'} // Access price correctly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Price</Form.Label>
                  <Form.Control
                    type="number"
                    style={{backgroundColor:"#E8E8E8"}}

                    readOnly
                    defaultValue={orderDetails.orders?.[0]?.total_price || 'N/A'} // Access price correctly
                  />
                </Form.Group>
              </Col>
          </Row> 
            {/* Images display */}
             {orderDetails.images && orderDetails.images.length > 0 && (
          <Row>

          <Form.Label>Prescriptions</Form.Label>

            {orderDetails.images.map((imgUrl, index) => (
              <Col key={index} xs={6} md={4} lg={4}>
                <Image src={imgUrl} className="w-100" fluid rounded />
              </Col>
            ))}
          </Row>

          
        )}
        
            <Button variant="primary"  className="btn btn-primary placeNewbtn  mt-2" type="submit">Submit Order</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RenewOrder;
