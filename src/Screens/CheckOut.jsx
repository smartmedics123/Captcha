import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoMdArrowBack } from "react-icons/io";
import { getCloudinaryUrl } from "../utils/cdnImage";
import Footer from "../Components/Footer";
import CustomNavbar from "../Components/Navbar/CustomNavbar";
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import { submitOrder } from "../services/RegularOrder";
import SMNavbar from "../Components/SMNavbar";
import OrderConfirmationModal from "../Components/OrderConfirmationModal/OrderConfirmationModal";
import LocationIQAutocomplete from "../Components/LocationAutocomplete/LocationIQAutocomplete";

export default function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState("");

  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem("checkoutFormData");
      return savedData
        ? JSON.parse(savedData)
        : {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            city: "Karachi",
            state: "Sindh",
            saveAddress: false,
          };
    } catch (error) {
      console.error("Failed to load form data from localStorage", error);
      return {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        city: "Karachi",
        state: "Sindh",
        saveAddress: false,
      };
    }
  };

  const [formData, setFormData] = useState(loadFormData);
  const [formErrors, setFormErrors] = useState({});
  const { firstName, lastName, phone, email, address, city, state } = formData;

  // Helper function to format phone for backend (convert 03 to 923)
  const formatPhoneForBackend = (phone) => {
    if (!phone) return phone;
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('03')) {
      // Convert 03xxxxxxxxx to 923xxxxxxxxx
      return '923' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('92')) {
      // Ensure it starts with 923
      if (cleanPhone.startsWith('923')) {
        return cleanPhone;
      } else {
        return '923' + cleanPhone.substring(2);
      }
    } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
      // Convert 3xxxxxxxxx to 923xxxxxxxxx
      return '923' + cleanPhone;
    }
    
    return cleanPhone; // Return as is if format not recognized
  };

  // Advanced phone validation function
  const isValidPakistaniMobile = (phone) => {
    if (!phone || phone.length !== 11) return false;
    
    // Basic pattern check
    const phonePattern = /^03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}$/;
    if (!phonePattern.test(phone)) return false;
    
    // Additional checks for common invalid patterns
    const invalidPatterns = [
      /^03\d{2}0000000$/, // Ending with 7 zeros
      /^03\d{2}1111111$/, // Ending with 7 ones  
      /^03\d{2}2222222$/, // Ending with 7 twos
      /^03\d{2}3333333$/, // Ending with 7 threes
      /^03\d{2}4444444$/, // Ending with 7 fours
      /^03\d{2}5555555$/, // Ending with 7 fives
      /^03\d{2}6666666$/, // Ending with 7 sixes
      /^03\d{2}7777777$/, // Ending with 7 sevens
      /^03\d{2}8888888$/, // Ending with 7 eights
      /^03\d{2}9999999$/, // Ending with 7 nines
      /^03\d{2}(\d)\1{6}$/, // Any repeating digit 7 times
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(phone));
  };

  const handleInputChange = useCallback(
    (e) => {
      const { name, type, checked, value } = e.target;
      
      // Special handling for phone number - keep 03 format for display
      if (name === 'phone') {
        // Remove all non-digit characters
        const cleanPhone = value.replace(/\D/g, '');
        
        // Handle different input scenarios
        let displayPhone = '';
        
        if (cleanPhone === '') {
          // Empty input, allow it
          displayPhone = '';
        } else if (cleanPhone === '0') {
          // User typed just '0', keep it
          displayPhone = '0';
        } else if (cleanPhone.startsWith('03')) {
          // Already in correct 03 format
          displayPhone = cleanPhone;
          
          // Limit to 11 digits for 03 format (03xxxxxxxxx)
          if (displayPhone.length > 11) {
            displayPhone = displayPhone.substring(0, 11);
          }
        } else if (cleanPhone.startsWith('0') && cleanPhone.length >= 2) {
          // Starts with 0 but not 03, check if it can become 03
          if (cleanPhone.charAt(1) === '3') {
            displayPhone = cleanPhone; // 03xxx... format
          } else {
            // 0 followed by non-3, still allow but will show validation error
            displayPhone = cleanPhone;
          }
        } else if (cleanPhone.startsWith('3')) {
          // User typed 3, auto-add 0 to make 03
          displayPhone = '0' + cleanPhone;
        } else if (cleanPhone.startsWith('923')) {
          // Convert 923 back to 03 for display
          displayPhone = '0' + cleanPhone.substring(2);
        } else if (cleanPhone.startsWith('92')) {
          // Convert 92 to 03 for display
          displayPhone = '0' + cleanPhone.substring(2);
        } else {
          // For any other input, just show as is
          displayPhone = cleanPhone;
        }
        
        // Update form data with display format
        const updatedFormData = {
          ...formData,
          [name]: displayPhone,
        };
        setFormData(updatedFormData);
        localStorage.setItem("checkoutFormData", JSON.stringify(updatedFormData));
      } else {
        // Handle other inputs normally, but prevent editing city and state
        if (name === 'city' || name === 'state') {
          // Don't allow editing city and state
          return;
        }
        
        const updatedFormData = {
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        };
        setFormData(updatedFormData);
        localStorage.setItem("checkoutFormData", JSON.stringify(updatedFormData));
      }
    },
    [formData]
  );

  const handleAddressSelect = (addressDetails) => {
    const updatedFormData = {
      ...formData,
      address: addressDetails.address,
      city: "Karachi", // Always set to Karachi
      state: "Sindh", // Always set to Sindh
    };
    setFormData(updatedFormData);
    localStorage.setItem("checkoutFormData", JSON.stringify(updatedFormData));
  };

  const handleRemoveItem = useCallback(
    (id) => {
      dispatch(removeItem({ id }));
    },
    [dispatch]
  );

  const handleIncreaseQuantity = useCallback(
    (id) => {
      // Find the cart item to check max available
      const cartItem = cartItems.find(item => item.id === id);
      if (cartItem && cartItem.maxAvailable && cartItem.quantity >= cartItem.maxAvailable) {
        alert(`Only ${cartItem.maxAvailable} ${cartItem.type}(s) available in stock`);
        return;
      }
      dispatch(increaseQuantity({ id }));
    },
    [dispatch, cartItems]
  );

  const handleDecreaseQuantity = useCallback(
    (id) => {
      dispatch(decreaseQuantity({ id }));
    },
    [dispatch]
  );

  const handlePrescriptionUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // e.g., 2025-07-15T12-45-30-123Z
  const publicId = `prescriptions/prescription_${timestamp}`;

  const formData = new FormData(); // 🔥 you missed this line
  formData.append("file", file);
  formData.append("upload_preset", "prescriptions_upload"); // your upload preset
  formData.append("public_id", publicId); // custom filename

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dc5nqer3i/auto/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      setPrescriptionUrl(data.secure_url);
      Swal.fire("Success", "Prescription uploaded successfully!", "success");
    } else {
      throw new Error("No secure_url returned");
    }

  } catch (error) {
    console.error("Prescription upload failed:", error);
    Swal.fire("Upload Error", "Failed to upload prescription. Please try again.", "error");
  }
};

  const validateForm = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    // if (!email.trim()) errors.email = "Email is required";
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!isValidPakistaniMobile(phone)) {
      errors.phone = "Please enter a valid Pakistani mobile number. Avoid test numbers like 1234567, 1111111, etc.";
    }
    if (!address.trim()) errors.address = "Address is required";
    // City and state are fixed to Karachi and Sindh, no validation needed
    if (cartItems.length === 0) errors.cart = "Cart is empty";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({}); // clear errors if all is valid

    const prescripRequired = cartItems.some(item => item.isPrescrip === "Yes");
    if (prescripRequired && !prescriptionUrl) {
      Swal.fire({
        icon: "warning",
        title: "Prescription Required",
        text: "Please upload a prescription before placing this order.",
      });
      return;
    }

    if (
      !firstName ||
      !phone ||
      !address ||
      cartItems.length === 0
    ) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Please ensure that your cart is not empty and all details are filled out before placing the order.",
      //   footer: '<a href="/allproducts">Continue Shopping</a>',
      //   confirmButtonColor: "#00909D",
      // });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to place this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00909D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order!",
      cancelButtonText: "No, cancel",
    });

    if (confirmResult.isConfirmed) {
      const orderData = {
        firstName,
        lastName: lastName.trim() || 'NaN',
        email,
        phone: formatPhoneForBackend(phone),
        contact: formatPhoneForBackend(phone),
        address,
        state: "Sindh", // Always Sindh
        city: "Karachi", // Always Karachi
        saveAddress: formData.saveAddress,
        orderItems: cartItems
          .filter(item =>
            item.id &&
            !isNaN(Number(item.id.split('-')[0])) &&
            Number(item.id.split('-')[0]) > 0 &&
            item.price !== undefined &&
            !isNaN(Number(item.price))
          )
          .map(item => ({
            product_id: Number(item.id.split('-')[0]),
            quantity: Number(item.quantity),
            quantityType: item.type,
            price_pu: Number(item.price),
            total_price: Number(item.price) * Number(item.quantity),
            isPrescrip: item.isPrescrip || false,
          })),
        totalOrderAmount: totalAmount + 160, // Include delivery charges (150) + service fee (10)
        customerId: Number(sessionStorage.getItem("customerId")),
        prescriptionUrl: prescripRequired ? prescriptionUrl : null,
      };

      try {
        const response = await submitOrder(orderData);
        const orderId = response.data.orderNumber; // ✅ Fixed: access data.orderNumber

        setOrderDetails({
          orderId,
          cartItems,
          totalAmount: totalAmount + 160, // Include delivery charges + service fee
          firstName,
          lastName,
          email,
          phone: formatPhoneForBackend(phone),
          address,
          city: "Karachi",
          state: "Sindh",
        });

        setIsModalOpen(true);

        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          state: "",
        });
        localStorage.removeItem("checkoutFormData");
        dispatch(clearCart());
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "There was an issue submitting your order. Please try again later.",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleTrackOrder = () => {
    setIsModalOpen(false);
    navigate("/order-confirmation", {
      state: orderDetails,
    });
  };

  return (
    <>
      <SMNavbar />
      <div className="container my-5">
        <h2 className="d-flex align-content-center gap-2 text-black my-5">
          <Link to={"/cart"}>
            <IoMdArrowBack />
          </Link>
          Checkout
        </h2>
        <div className="row">
          {/* Left Section: Shipping and Payment Details */}
          <div className="col-lg-8 mb-4 shadow rounded p-4">
            <div className="row">
              <div>
                <h2 className="mb-4">Shipping Details</h2>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label fw-bold">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? "is-invalid" : ""}`}
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback">{formErrors.firstName}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label fw-bold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-bold">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number (e.g., 03123456789)"
                    value={phone}
                    maxLength={11}
                    pattern="03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}"
                    inputMode="numeric"
                    title="Enter a valid Pakistani mobile number starting with 03"
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.phone && (
                    <div className="invalid-feedback">{formErrors.phone}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label fw-bold">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value="Karachi"
                      readOnly
                      style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label fw-bold">
                      Province
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value="Sindh"
                      readOnly
                      style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label fw-bold">
                    Address
                  </label>
                  <LocationIQAutocomplete
                    value={address}
                    onChange={handleInputChange}
                    onSelect={handleAddressSelect}
                    isInvalid={!!formErrors.address}
                    placeholder="Enter your delivery address"
                  />
                  {formErrors.address && (
                    <div className="invalid-feedback d-block">{formErrors.address}</div>
                  )}
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="saveAddress"
                    name="saveAddress"
                    checked={formData.saveAddress || false}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="saveAddress">
                    Save this address in Address Book
                  </label>
                </div>

                  <div className="mt-3">
                    <p className="text-secondary ">
                      Some medications require a prescription. Please upload the prescription.
                    </p>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="form-control"
                      onChange={handlePrescriptionUpload}
                    />
                    {prescriptionUrl && (
                      <p className="mt-2 text-success">Prescription uploaded successfully.</p>
                    )}
                  </div>
                

                <hr className="my-4" />
              </div>

                <div>
                <h2 className="mb-4">Payment Method</h2>

                {/* Credit/Debit Card - Commented out */}
                {/*
                <div className="payment-section border rounded p-3 d-flex gap-3">
                  <div className="payment-option">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                    />
                  </div>
                  <div className="w-100">
                    <label className="payment-option">
                      <span className="option-label fw-semibold">
                        Credit or Debit Card{" "}
                        <img
                          src={getCloudinaryUrl('payment-cards.svg')}
                          alt="Mastercard"
                          width="50"
                          className="logo ms-2"
                        />
                      </span>
                    </label>

                    <div
                      className={`transition-wrapper ${
                        selectedPayment === "card" ? "show" : "hide"
                      }`}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Card Number</label>
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="form-control rounded"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Name</label>
                            <input
                              type="text"
                              placeholder="Name of the Card Holder"
                              className="form-control rounded"
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Expiration</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="form-control rounded"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="form-control rounded"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                */}

                {/* Bank Transfer Section */}
                {/* <div className="payment-section border rounded p-3 d-flex gap-3 mb-3">
                  <div className="payment-option">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={selectedPayment === "cod"}
                      onChange={() => setSelectedPayment("cod")}
                    />
                  </div>
                  <div className="w-100">
                    <label className="payment-option">
                      <span className="option-label fw-semibold">
                        Bank Transfer 
                      </span>
                    </label>

                    <div
                      className={`transition-wrapper ${
                        selectedPayment === "bank" ? "show" : "hide"
                      }`}
                    >
                      <div className="mt-3 p-3 rounded">
                        <h6 className="fw-bold text-primary mb-3">Payment Instructions</h6>
                        
                        <div className="mb-3">
                          <p className="mb-2"><strong>Payment Details:</strong></p>
                          <p className="mb-1"><strong>Account Title:</strong> Universal Retails (Private) Limited</p>
                          <p className="mb-1"><strong>Account Number:</strong> 0103-0105438800</p>
                          <p className="mb-1"><strong>IBAN:</strong> PK34MEZN0001030105438800</p>
                          <p className="mb-1"><strong>Bank:</strong> Meezan Bank</p>
                          <p className="mb-3"><strong>Branch:</strong> FTC Branch</p>
                          
                          <p className="mb-0">
                            Once you've made your payment, kindly share your deposit slip with your order number at 
                            <strong> +923199245206 (WhatsApp)</strong> for confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                Cash on Delivery Section */}
                <div className="payment-section payment-option border d-flex align-items-center gap-3 rounded p-3 mt-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="cod"
                    checked={selectedPayment === "cod"}
                    onChange={() => setSelectedPayment("cod")}
                  />
                  <span className="option-label fw-semibold">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="col-lg-4">
            <div
              className="shadow rounded p-4"
              style={{ backgroundColor: "#F8F9FA" }}
            >
              <h4 className="mb-4 text-black">Summary Details</h4>
              {cartItems.length === 0 ? (
                <p>
                  Your cart is empty{" "}
                  <Link
                    to={"/allproducts"}
                    style={{ color: "#00909D" }}
                    className="text-decoration-none"
                  >
                    Start Shopping
                  </Link>
                </p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div className="mb-4" key={item.id}>
                      <div
                        className="card mb-3 border rounded-3"
                        style={{ backgroundColor: "#fff", padding: "15px" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6
                            className="m-0"
                            style={{
                              color: "#2D2D2D",
                              fontSize: "13px",
                              fontWeight: "bold",
                            }}
                          >
                            {item.quantity}x {item.name}
                          </h6>
                          {/* {item.maxAvailable && (
                            <small className="text-muted">
                              Stock: {item.maxAvailable} available
                            </small>
                          )} */}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {item.img && (
                            <img
                              src={item.img}
                              alt=""
                              className="w-25 mb-0"
                              style={{ maxWidth: "60px", height: "auto" }} // optional: controls size
                            />
                          )}
                          <p
                            className="m-0"
                            style={{ color: "#757575", fontSize: "16px" }}
                          >
                            Rs. {item.price * item.quantity}
                          </p>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div className="d-flex align-items-center border rounded-5">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleDecreaseQuantity(item.id)}
                              style={{
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                marginRight: "10px",
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{ margin: "0 10px", color: "#2D2D2D" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleIncreaseQuantity(item.id)}
                              style={{
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                marginLeft: "10px",
                              }}
                              disabled={item.maxAvailable && item.quantity >= item.maxAvailable}
                              title={
                                item.maxAvailable && item.quantity >= item.maxAvailable 
                                  ? `Maximum ${item.maxAvailable} available`
                                  : "Increase quantity"
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn text-black border fw-semibold btn-sm"
                            onClick={() => handleRemoveItem(item.id)}
                            style={{
                              padding: "5px 15px",
                              borderRadius: "20px",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#757575" }}>
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span style={{ color: "#757575" }}>Rs. {Math.round(totalAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#757575" }}>Delivery Charges</span>
                    <del style={{ color: "#757575" }}>Rs. 150</del>
                  </div>
                  <span className="d-flex justify-content-end mb-3" style={{ color: "#757575" }}>FREE</span>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#757575" }}>Service fee</span>
                    <span style={{ color: "#757575" }}>Rs. 10</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span style={{ color: "#757575" }}>Total</span>
                    <span style={{ color: "#757575" }}>Rs. {Math.round(totalAmount)+10}</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="btn w-100 bg-black text-white rounded-pill py-2"
                  >
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <OrderConfirmationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        orderId={orderDetails?.orderId || "SM123456"}
        onTrackOrder={handleTrackOrder}
        onContinueShopping={handleModalClose}
      />
      <Footer />
    </>
  );
}
