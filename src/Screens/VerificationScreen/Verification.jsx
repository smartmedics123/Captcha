import {useRef, useState } from "react";
// import {useEffect } from "react";

import "./Verification.css";
// Import Container, Row, and Col for responsive layout
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { generateOtp, verifyOtp, generateUchatOtp, verifyUchatOtp } from "../../services/generateOtp";
import LoadingSpinner from "../../Components/Spinner/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setEmail } from "../../features/email/emailSlice";
import { setMobile } from "../../features/mobile/mobileSlice";

// 🔍 Debug imports
console.log('🔍 Import Check:', { setEmail, setMobile });
import { getCloudinaryUrl } from "../../utils/cdnImage";

function Verification({ setIsOtpVerified }) {
  const navigation = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setemail] = useState("");
  const [error, setError] = useState("");
  const [message, setmessage] = useState("");
  const [otp, setOtp] = useState("");
  const [regenratebtn, setregenratebtn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [submitbtn, setsubmitbtn] = useState(false);
  const [useUchat, setUseUchat] = useState(false); // Track which OTP system to use
  const form = useRef();
  const enterOtp = useRef();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMobileChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setMobile(input.slice(0, 11));
    }
  };

  const handleOtpChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setOtp(input.slice(0, 6)); // Restrict OTP to 6 digits
    }
  };

  const otpvalidation = async (e) => {
    setsubmitbtn(false);
    setLoader(true);
    e.preventDefault();
    try {
      let response;
      if (useUchat && mobile) {
        // Use UCHat verification for mobile
        console.log('🔍 Verifying UCHat OTP:', { mobile, otp });
        response = await verifyUchatOtp(mobile, otp);
        console.log('📱 UCHat Response:', response);
        
        // ✅ Fixed: Check for both status and success fields to handle different response formats
        if (response.status === 'success' || response.success) {
          console.log('✅ UCHat verification successful', response);
          setsubmitbtn(true);
          setLoader(false);
          setError("");
          setmessage(response.message || "OTP Verified Successfully via WhatsApp");
          
          // Store customer information
          const customerData = response.customer || response.data?.customer || {};
          const customerNumber = response.customerNumber || customerData.customerNumber;
          const customerId = response.customerId || customerData.id;
          
          console.log('� Storing customer data:', { customerNumber, customerId, customerData });
          
          // Store in sessionStorage
          if (customerNumber) sessionStorage.setItem('customerNumber', customerNumber);
          if (customerId) sessionStorage.setItem('customerId', customerId.toString());
          if (mobile) sessionStorage.setItem('userMobile', mobile);
          
          // Store customer object
          sessionStorage.setItem('customerData', JSON.stringify(customerData));
          
          try {
            // Try Redux dispatch for mobile
            if (mobile) {
              const result = dispatch(setMobile(mobile));
              console.log('✅ Redux dispatch result:', result);
            }
          } catch (dispatchError) {
            console.error('❌ setMobile dispatch failed:', dispatchError);
          }
          
          setIsOtpVerified(true);
          console.log('🚀 Navigating to /preSorted-order');
          navigation("/preSorted-order");
        } else {
          console.log('❌ UCHat verification failed:', response);
          setError("OTP verification failed. Please try again.");
          setsubmitbtn(true);
          setLoader(false);
        }
      } else {
        // Use email verification
        console.log('📧 Verifying email OTP:', { email, otp });
        response = await verifyOtp(email, otp);
        console.log('📧 Email Response:', response);
        
        // ✅ Fixed: Check for both success field values and status
        if (response.success === "OTP verified" || response.success || response.status === 'success') {
          console.log('✅ Email verification successful', response);
          setsubmitbtn(true);
          setLoader(false);
          setError("");
          setmessage(response.message || "OTP Verified Successfully via Email");
          
          // Store customer information from email response
          const customerData = response.customer || response.data?.customer || {};
          const customerNumber = response.customerNumber || customerData.customerNumber;
          const customerId = response.customerId || customerData.id;
          
          console.log('💾 Storing email customer data:', { customerNumber, customerId, customerData });
          
          // Store in sessionStorage
          if (customerNumber) sessionStorage.setItem('customerNumber', customerNumber);
          if (customerId) sessionStorage.setItem('customerId', customerId.toString());
          if (email) sessionStorage.setItem('userEmail', email);
          
          // Store customer object
          sessionStorage.setItem('customerData', JSON.stringify(customerData));
          
          try {
            // Try Redux dispatch for email
            if (email) {
              const result = dispatch(setEmail(email));
              console.log('✅ Email Redux dispatch result:', result);
            }
          } catch (dispatchError) {
            console.error('❌ setEmail dispatch failed:', dispatchError);
          }
          
          setIsOtpVerified(true);
          console.log('🚀 Navigating to /preSorted-order from email verification');
          navigation("/preSorted-order");
        } else {
          console.log('❌ Email verification failed:', response);
          setError("OTP verification failed. Please try again.");
          setsubmitbtn(true);
          setLoader(false);
        }
      }
    } catch (error) {
      console.error('🚨 OTP Validation Error:', error);
      setsubmitbtn(true);
      setLoader(false);
      setmessage("");
      setError(error.response?.data?.error || "OTP verification failed");
      setregenratebtn(true);
      setOtp("");
      if (
        error.response?.data?.error ===
        "OTP has expired. Please request a new OTP."
      ) {
        setregenratebtn(true);
      }
    }
  };

  const showOtp = async (e) => {
    setregenratebtn(false);
    setLoader(true);
    setmessage("");
    e.preventDefault();
    if (!mobile && !email) {
      setError("Please fill in either your mobile number or email address.");
      setLoader(false);
      return;
    }
    if (mobile && mobile.length < 11) {
      setError("Please enter a valid mobile number.");
      setLoader(false);
      return;
    }
    if (email && !validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoader(false);
      return;
    }
    if (mobile && email) {
      setError("Please fill in either your mobile number or email address.");
      setLoader(false);
      return;
    }
    setError("");
    try {
      let response;
      if (mobile) {
        // Use UCHat for mobile OTP
        setUseUchat(true);
        response = await generateUchatOtp(mobile);
        // ✅ Fixed: Check for status instead of success
        if (response.status === 'success') {
          setLoader(false);
          form.current.className = "d-none";
          enterOtp.current.className = "d-block";
          setmessage(
            `A 6 digit OTP has been sent to your WhatsApp: ${mobile}.<br/>Please check your WhatsApp messages.`
          );
          setsubmitbtn(true);
          setregenratebtn(false);
        }
      } else {
        // Use email OTP
        setUseUchat(false);
        response = await generateOtp(email);
        if (response.success) {
          setLoader(false);
          form.current.className = "d-none";
          enterOtp.current.className = "d-block";
          setmessage(
            `A 6 digit OTP has been sent to your email.<br/>If you do not receive it, please check your spam/junks folder.`
          );
          setsubmitbtn(true);
          setregenratebtn(false);
        }
      }
    } catch (error) {
      setmessage("Failed to send OTP. Please try again.");
      setLoader(false);
      setregenratebtn(true);
    }
  };
// useEffect (() => {
//   BsGoogle.account.id.initialize({
//     client_id: "356167563807-dhsid729cdv0f9if483ugl7kd5g9btrn.apps.googleusercontent.com",
//     callback: handleCredentialLogin
//   });
//   google.accounts.id.renderButton(
//     document.getElementById("googleSignInDiv"),
//     { theme:'outline', size: "large" }  // customization attributes
//   );
// }, []);
// const handleCredentialLogin = (response) => {
//   console.log("Encoded JWT ID token: " + response.credential);
// };
  return (
    <>
      <div className="gradient-background d-flex align-items-center">
        {/* Use a Container to create a responsive, centered layout */}
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs="auto">
              <img
                style={{ width: 150 }}
                src={getCloudinaryUrl("SmartMedicslogo.png")}
                alt="logo"
                loading="lazy"
                width="150"
                height="150"
              />
            </Col>
          </Row>

          <Row className="justify-content-center text-center mt-4">
            <Col>
              <h1 className="fs-2 fw-bold">
                <span>Step into the future of </span>
                <span>convenient healthcare today.</span>
              </h1>
            </Col>
          </Row>

          {loader && <LoadingSpinner />}

          {/* Wrap forms in a responsive column */}
          <Row className="justify-content-center mt-4">
            <Col md={7} lg={5} xl={4}>
              {/* ------------ EMAIL/MOBILE FORM ----------- */}
              <div ref={form}>
                <Form onSubmit={showOtp}>
                  <p className="text-danger text-center">{message}</p>
<Form.Group className="mb-3" controlId="formMobile">
  <p className="text-white text-center">
    Please enter your 11-digit mobile Number <br />
  </p>

  <Form.Control
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
   placeholder="Enter phone number (e.g : 03123456789)"
    value={mobile}
    onChange={handleMobileChange}
    className="bg-transparent border-2 border-white textbox"
  />
</Form.Group>


                  <div className="text-center my-3">OR</div>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <p className="text-white text-center">
                      Please enter your Email Address
                    </p>
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className="bg-transparent border-2 border-white textbox"
                    />
                  </Form.Group>

                  {error && (
                    <div className="error-message text-danger text-center mt-2">
                      {error}
                    </div>
                  )}

                  <Button variant="" type="submit" className="button mt-3">
                    Generate Pin
                  </Button>
                </Form>
              </div>

              {/* ----------------- OTP FORM ----------------- */}
              <div className="d-none" ref={enterOtp}>
                <Form onSubmit={otpvalidation}>
                  <p
                    className="text-white text-center"
                    dangerouslySetInnerHTML={{ __html: message }}
                  ></p>
                  <Form.Group className="mt-1" controlId="formOtp">
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="OTP Number"
                      required
                      className="bg-transparent border-2 border-white textbox"
                    />
                  </Form.Group>

                  {error && (
                    <div className="error-message text-danger text-center mt-2">
                       {error}
                    </div>
                  )}

                  <div className="text-center mt-3">
                    {regenratebtn && (
                      <Button
                        onClick={showOtp}
                        className="button bg-transparent"
                        style={{ color: "#074868" }}
                      >
                        Regenerate Otp
                      </Button>
                    )}
                  </div>

                  <Button
                    disabled={!submitbtn}
                    variant=""
                    type="submit"
                    className="button mt-3"
                  >
                    Submit
                  </Button>
                     {/* <div
                 id="googleSignInDiv"
                  >
                    Googele Sign In
                  </div> */}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Verification;