import React from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import './ThankYouScreen.css';
import { useNavigate } from 'react-router-dom';
import Images from '../../assets/Images';
const ThankYouScreen = () => {
  const navigation=useNavigate();
  const orderNumber = localStorage.getItem("orderNumber");
 
  return (
    <Container className="text-center mt-5">
      <h2 className="text-primary pt-5">Thank You for Choosing Smart Medics!</h2>
      
      <div className="  d-flex justify-content-center">
        <Image className=' thankyouicon' src={Images.thankyou} fluid/>
      </div>

      <p className='pt-3'>Your prescription has been successfully uploaded.</p>
      <p>
        Once your prescription is approved by our pharmacist, you will receive a checkout notification. Please keep an eye on your text, email, or WhatsApp for further instructions.
      </p>

      <h5 className='pt-3 fs-5'>Your Order Number is</h5>
      <h2 className="text-primary fw-bold">{orderNumber}</h2>

      <p className='pt-2'>If you have any questions or need assistance, feel free to contact our support team.</p>

      <div className="d-md-flex justify-content-center mt-4 flex-sm-column flex-md-row col-md-12 ">
        <Button className="custom-outline-button me-3 mt-md-5 col-6 col-md-auto"  onClick={()=>navigation('/track-order')}>Check Order Status</Button>
        <Button className="custom-filled-button mt-md-5 me-3 mt-2 col-6 col-md-auto" onClick={()=>navigation('/allproducts')} >Continue Shopping</Button>
      </div>
    </Container>
  );
};

export default ThankYouScreen;
