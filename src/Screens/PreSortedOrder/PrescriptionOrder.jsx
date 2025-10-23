import React, { useState, useRef, useEffect } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import CustomNavbar from "../../Components/Navbar/CustomNavbar";
import Footer from "../../Components/Footer";
import "./PrescriptionOrder.css";
import { submitOrderForm } from "../../services/PreSortedOrder";
import { fetchProductList } from "../../services/ProductService";
import CreatableSelect from 'react-select/creatable';
import ReCAPTCHA from "react-google-recaptcha";

import Swal from "sweetalert2";
import images from "../../assets/Images";
import { Dropzone } from "../../Components/Dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { editPreSorted } from "../../services/HistoryOrder";
import ThankYouScreen from "../ThankYouScreen/ThankYouScreen";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../Components/Spinner/LoadingSpinner";
import { getCustomerData } from "../../services/CustomerDashboard/profileManagement";
import { setProfileData } from "../../features/profile/profileSlice";
import SMNavbar from "../../Components/SMNavbar";
import LocationIQAutocomplete from "../../Components/LocationAutocomplete/LocationIQAutocomplete";


export default function PrescriptionOrder({ route }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state || {};

  const [preSortedOrderData, setPreSortedOrderData] = useState(null);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [files, setFiles] = useState([]);
  const [submitbtn, setsubmitbtn] = useState(true);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialOrderItems, setInitialOrderItems] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const otpEmail = useSelector((state) => state.email.email);
  const otpMobile = useSelector((state) => state.mobile.mobile);
  const profileData = useSelector((state) => state.profile); // ✅ Get customer profile data
  const thankyou = useRef();
  const prescription = useRef();
  const [isForSomeoneElse, setIsForSomeoneElse] = useState(false);
  const recaptchaRef = useRef();

  const [formData, setFormData] = useState({
    firstName: data?.data?.firstName || "",
    lastName: data?.data?.lastName || "",
    phone: data?.data?.phone || "",
    email: data?.data?.email || "",
    address: data?.data?.address || "",
    durationType: data?.data?.durationType || "",
    durationNumber: data?.data?.durationNumber || "",
    orderingFor: data?.data?.orderingFor || "",
    referringPhysician: data?.data?.referringPhysician || "",
    patientName: data?.data?.patientName || "",
    relationToPatient: data?.data?.relationToPatient || "",
    images: data?.data?.images || [],
    state: "Sindh", // Always Sindh
    city: "Karachi", // Always Karachi
    nonPrescriptionMedicine: data?.data?.nonPrescriptionMedicine
      ? data.data.nonPrescriptionMedicine.split(',').map((v) => {
          // Try to parse "Name (2 Stripe)" or "Name (1 Box)"
          const match = v.match(/^(.+?) \((\d+) (Stripe|Box)\)$/);
          if (match) {
            return {
              label: match[1].trim(),
              value: match[1].trim(),
              quantity: match[2],
              quantityType: match[3],
            };
          }
          return { label: v, value: v, quantity: '', quantityType: 'Stripe' };
        })
      : [],
    specialInstructions: data?.data?.specialInstructions || "",
    recipientName: data?.data?.recipientProfileName || "",
  });

  // State for live phone validation
  const [phoneValidationMessage, setPhoneValidationMessage] = useState("");

  const fileInputRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const imagesRef = useRef(null);
  const referringPhysicianRef = useRef(null);

  useEffect(() => {
    if (prescription.current) {
      prescription.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);



  useEffect(() => {
    // Fetch product list for autocomplete
    const fetchProducts = async () => {
      try {
        const products = await fetchProductList();
        setProductSuggestions(products.map(p => p.title));
      } catch (err) {
        setProductSuggestions([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getCustomerData();
        const customerData = response.data;
        
        // Update Redux state with full customer data
        dispatch(setProfileData(customerData));
        
        // Pre-fill form with customer data if not editing
        if (data?.key !== "edit") {
          setFormData((prev) => ({
            ...prev,
            firstName: prev.firstName || customerData?.firstName || "",
            lastName: prev.lastName || customerData?.lastName || "",
            phone: prev.phone || customerData?.primaryPhone || "",
            email: prev.email || customerData?.primaryEmail || "",
            address: prev.address || customerData?.address || "",
            city: "Karachi", // Always Karachi
            state: "Sindh", // Always Sindh
            patientName: prev.patientName || `${customerData?.firstName || 'my'} ${customerData?.lastName || 'self'}`,
          }));
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchCustomerData();
  }, [dispatch, data?.key]);

  // ✅ UPDATE: Fill form with OTP data when available (check both Redux and sessionStorage)
  useEffect(() => {
    // Also check sessionStorage as fallback
    const sessionMobile = sessionStorage.getItem('userMobile');
    const sessionEmail = sessionStorage.getItem('userEmail');
    
    console.log('🔍 OTP Data Debug:', { 
      otpMobile, 
      otpEmail, 
      sessionMobile,
      sessionEmail,
      formPhone: formData.phone, 
      formEmail: formData.email 
    });
    
    if (data?.key !== "edit") {
      setFormData((prev) => {
        const updates = {};
        
        // Check Redux first, then sessionStorage fallback
        const phoneToUse = otpMobile || sessionMobile;
        const emailToUse = otpEmail || sessionEmail;
        
        // Only update if data exists and current field is empty
        if (phoneToUse && !prev.phone) {
          updates.phone = phoneToUse;
        }
        if (emailToUse && !prev.email) {
          updates.email = emailToUse;
        }
        
        // If we have updates, apply them
        if (Object.keys(updates).length > 0) {
          console.log('📝 Updating form with OTP data:', updates);
          return { ...prev, ...updates };
        }
        
        return prev;
      });
    }
  }, [otpMobile, otpEmail, data?.key]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await editPreSorted({ orderNumber: data?.data }); // Updated to use orderNumber
        setOrderItems(response?.order_detail || []);
        setPreSortedOrderData(response?.order_info || {});
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (data?.key === "edit") {
      fetchOrderData();
    }
  }, [data?.data, data?.key]);

  useEffect(() => {
    if (preSortedOrderData && data?.key === "edit") {
      const initialData = {
        firstName: preSortedOrderData.firstName || "",
        lastName: preSortedOrderData.lastName || "",
        phone: preSortedOrderData.phone || "",
        email: otpEmail || preSortedOrderData.email || "",
        address: preSortedOrderData.address || "",
        durationType: preSortedOrderData.durationType || "",
        durationNumber: preSortedOrderData.durationNumber || "",
        orderingFor: preSortedOrderData.orderingFor || "",
        patientName: preSortedOrderData.patientName || "test",
        relationToPatient: preSortedOrderData.relationToPatient || "",
        state: "Sindh", // Always Sindh
        city: "Karachi", // Always Karachi
        nonPrescriptionMedicine: preSortedOrderData.nonPrescriptionMedicine || "",
        specialInstructions: preSortedOrderData.specialInstructions || "",
        recipientProfileName: preSortedOrderData.recipientProfileName || "",
      };
      setFormData((prev) => ({ ...prev, ...initialData }));
      setInitialFormData(initialData);
      setInitialOrderItems(orderItems);
    }
  }, [preSortedOrderData, data?.key, otpEmail]);

  const hasFormChanged = () => {
    if (!initialFormData) return false;
    const keys = Object.keys(initialFormData);
    for (const key of keys) {
      if ((formData[key] || "") !== (initialFormData[key] || "")) {
        return true;
      }
    }
    if (files.length > 0) return true;
    for (let i = 0; i < orderItems.length; i++) {
      if (
        orderItems[i].quantity !== initialOrderItems[i]?.quantity ||
        orderItems[i].total_price !== initialOrderItems[i]?.total_price
      ) {
        return true;
      }
    }
    return false;
  };

  const handleFileUpload = (uploadedFiles) => {
    const maxFileSize = 5 * 1024 * 1024;
    const validFiles = uploadedFiles.filter((file) => file.size <= maxFileSize);

    if (validFiles.length !== uploadedFiles.length) {
      Swal.fire({
        title: "File Too Large",
        text: "One or more files exceed the 5MB limit.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }

    setFiles(validFiles);
    setFormData((prev) => ({ ...prev, images: validFiles }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const cleanPhone = value.replace(/\D/g, '');
      let displayPhone = '';
      let validationMessage = '';
      
      if (cleanPhone === '') {
        displayPhone = '';
        validationMessage = '';
      } else if (cleanPhone === '0') {
        displayPhone = '0';
        validationMessage = '';
      } else if (cleanPhone.startsWith('03')) {
        displayPhone = cleanPhone;

        if (cleanPhone.length === 11) {
          const fullPattern = /^03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}$/;
          if (!fullPattern.test(cleanPhone)) {
            validationMessage = "Invalid phone number pattern. Please enter a valid number.";
          } else {
            validationMessage = '';
          }
        } else if (cleanPhone.length > 11) {
          validationMessage = "Phone number cannot exceed 11 digits";
        } else {
          validationMessage = '';
        }
      } else if (cleanPhone.startsWith('0') && cleanPhone.length >= 2) {

        if (cleanPhone.charAt(1) === '3') {
          displayPhone = cleanPhone; 
          validationMessage = '';
        } else {
          displayPhone = cleanPhone;
          validationMessage = "Please enter a valid Pakistani mobile number starting with 03";
        }
      } else if (cleanPhone.startsWith('3')) {

        displayPhone = '0' + cleanPhone;
        validationMessage = '';
      } else if (cleanPhone.startsWith('923')) {

        displayPhone = '0' + cleanPhone.substring(2);
        validationMessage = '';
      } else if (cleanPhone.startsWith('92')) {
   
        displayPhone = '0' + cleanPhone.substring(2);
        validationMessage = '';
      } else {
        
        displayPhone = cleanPhone;
        validationMessage = "Please enter a valid Pakistani mobile number starting with 03";
      }
      
      if (displayPhone.length > 11) {
        displayPhone = displayPhone.substring(0, 11);
        validationMessage = "Phone number cannot exceed 11 digits";
      }
      
      setFormData((prev) => ({ ...prev, [name]: displayPhone }));
      setPhoneValidationMessage(validationMessage);
    } else {

      if (name === 'city' || name === 'state') {
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPhoneForBackend = (phone) => {
    if (!phone) return phone;
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('03')) {
    
      return '923' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('92')) {

      if (cleanPhone.startsWith('923')) {
        return cleanPhone;
      } else {
        return '923' + cleanPhone.substring(2);
      }
    } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
    
      return '923' + cleanPhone;
    }
    
    return cleanPhone; 
  };

 
  const isValidPakistaniMobile = (phone) => {
    if (!phone || phone.length !== 11) return false;
    
    // Basic pattern check
    const phonePattern = /^03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}$/;
    if (!phonePattern.test(phone)) return false;
    

    const invalidPatterns = [
      /^03\d{2}0000000$/, 
      /^03\d{2}1111111$/, 
      /^03\d{2}2222222$/, 
      /^03\d{2}3333333$/, 
      /^03\d{2}4444444$/,
      /^03\d{2}5555555$/, 
      /^03\d{2}6666666$/, 
      /^03\d{2}7777777$/, 
      /^03\d{2}8888888$/, 
      /^03\d{2}9999999$/, 
      /^03\d{2}(\d)\1{6}$/, 
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(phone));
  };
  const handleNonPrescriptionChange = (selected) => {
    const medicinesWithDefaults = (selected || []).map(medicine => ({
      ...medicine,
      quantity: medicine.quantity || '1',
      quantityType: medicine.quantityType || 'Stripe'
    }));
    
    setFormData((prev) => ({
      ...prev,
      nonPrescriptionMedicine: medicinesWithDefaults,
    }));
  };

  const handleAddressSelect = (addressDetails) => {
    setFormData((prev) => ({
      ...prev,
      address: addressDetails.address,
      city: "Karachi", // Always set to Karachi
      state: "Sindh", // Always set to Sindh
    }));
  };


  const handleMedicineDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.nonPrescriptionMedicine];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, nonPrescriptionMedicine: updated };
    });
  };

  const handleOrderingForChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, orderingFor: value }));
    setIsForSomeoneElse(value === "someoneElse");
  };

  // reCAPTCHA handler
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const validateForm = () => {
    const validationErrors = {};
    let firstErrorRef = null;

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
      firstErrorRef = firstNameRef;
    }
    // Last name is optional - no validation required
    // if (!formData.lastName.trim()) {
    //   validationErrors.lastName = "Last name is required.";
    //   firstErrorRef = firstErrorRef || lastNameRef;
    // }
    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required.";
      firstErrorRef = firstErrorRef || phoneRef;
    } else if (!isValidPakistaniMobile(formData.phone)) {
      validationErrors.phone = "Please enter a valid Pakistani mobile number. Avoid test numbers like 1234567, 1111111, etc.";
      firstErrorRef = firstErrorRef || phoneRef;
    }

    if (!formData.address.trim()) {
      validationErrors.address = "Address is required.";
      firstErrorRef = firstErrorRef || addressRef;
    }


    if (data?.key !== "edit" && (!formData.images || formData.images.length === 0)) {
      validationErrors.images = "Please upload an image of your prescription.";
      firstErrorRef = firstErrorRef || imagesRef;
    }

    // reCAPTCHA validation
    if (!recaptchaToken) {
      validationErrors.recaptcha = "Please complete the reCAPTCHA verification.";
    }

    return { validationErrors, firstErrorRef };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { validationErrors, firstErrorRef } = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (firstErrorRef && firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ behavior: "smooth" });
        firstErrorRef.current.focus();
      }
      return;
    }

    setErrors({});
    
    const confirmOrder = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to place this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00909D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order!",
    });

    if (!confirmOrder.isConfirmed) return;

    setsubmitbtn(false);
    setLoader(true);

    try {

      const recipientName = formData.recipientName && formData.recipientName.trim() !== "" 
        ? formData.recipientName 
        : formData.lastName && formData.lastName.trim() !== ""
          ? `${formData.firstName} ${formData.lastName}`.trim()
          : formData.firstName;
      // Format nonPrescriptionMedicine as "Name (2 Stripe), Name2 (1 Box)"
      const nonPrescriptionMedicineString = (formData.nonPrescriptionMedicine || [])
        .filter((v) => v.label) // Only filter out completely empty entries
        .map((v) => {
          // Provide default values if quantity/type are missing
          const quantity = v.quantity || '1';
          const quantityType = v.quantityType || 'Stripe';
          return `${v.label} (${quantity} ${quantityType})`;
        })
        .join(", ");
      const finalFormData = {
        ...formData,
        phone: formatPhoneForBackend(formData.phone), // Convert 03 to 923 format for backend
        nonPrescriptionMedicine: nonPrescriptionMedicineString,
        recipientName, // send as recipientName
        email: formData.email || otpEmail, // ✅ Use form email or otpEmail
        orderItems, // ✅ NO STRINGIFY HERE
        recaptchaToken, // Include reCAPTCHA token
      };
      
      // Debug: Log the data being sent to backend
      console.log('🔍 Final Form Data being sent:', {
        ...finalFormData,
        images: finalFormData.images ? `${finalFormData.images.length} files` : 'No files'
      });
      
      // Debug: Log the nonPrescriptionMedicine data being sent
      console.log('🔍 NonPrescription Debug:', {
        originalArray: formData.nonPrescriptionMedicine,
        stringForBackend: nonPrescriptionMedicineString
      });
      
      // Only remove email if it's completely empty
      if (!finalFormData.email || finalFormData.email.trim() === "") {
        delete finalFormData.email;
      }
      
      // Handle empty lastName - set to empty string if not provided
      if (!finalFormData.lastName || finalFormData.lastName.trim() === "") {
        finalFormData.lastName = "";
      }

      const response = await submitOrderForm(finalFormData);
      localStorage.setItem("orderNumber", response.data.orderNumber); // ✅ Fixed: access data.orderNumber
      setFiles([]);

      Swal.fire({
        title: "Order Submitted Successfully!",
        text: "You will be notified shortly.",
        icon: "success",
        confirmButtonColor: "#00909D",
      }).then(() => {
        setsubmitbtn(true);
        setLoader(false);
        thankyou.current.className = "d-block";
        prescription.current.className = "d-none";
        
        // Scroll to thank you screen
        setTimeout(() => {
          thankyou.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          });
        }, 100);
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setsubmitbtn(true);
      setLoader(false);
      
      // Reset reCAPTCHA on error
      recaptchaRef.current.reset();
      setRecaptchaToken(null);
      
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        error.message;

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
      });
    }
  };


  useEffect(() => {
    if (data?.key === "edit") {
      setHasChanges(hasFormChanged());
    }
  }, [formData, files, orderItems]);


  return (
    <>
      <SMNavbar />
      <div className="row overflow-hidden">
     
        <img
          src={images?.NonSortedBg}
          className="d-none d-md-block" 
          style={{
            width: "100dvw",
            height: "80dvh",
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt="Prescription order background"
        />
        {/* --- MOBILE IMAGE: Shows only on mobile --- */}
        <img
          src={images?.NonsortedBgMobile}
          className="d-block d-md-none"
          style={{
            width: "100%",
            height: "23dvh",
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt="Prescription order background for mobile"
        />
      </div>
      {/* --------------------------------Form---------------------- */}
      <Container className="mt-5" id="prescription" ref={prescription}>
        <h6 id="error" style={{ color: "#00909D" }}>
          Please Enter Your Details
        </h6>
        {Object.keys(errors).length > 0 && (
          <Alert variant="danger">Please correct the highlighted fields.</Alert>
        )}
        <Form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="row">
            {/* Recipient Name Field */}
                
            <Form.Group className="mb-3 col-md-6" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                disabled={data?.key === "renew" || data?.key === "edit"}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                ref={firstNameRef}
                className={`${errors.firstName ? "is-invalid" : ""} inputs`}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3 col-md-6" controlId="formLastName">
              <Form.Label>Last Name <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
              <Form.Control
                disabled={data?.key === "renew" || data?.key === "edit"}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                ref={lastNameRef}
                className={`${errors.lastName ? "is-invalid" : ""} inputs`}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3 col-md-12" controlId="formRecipientName">
                  <Form.Label>Prescription Name <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="recipientName"
                    value={formData.recipientName || ""}
                    onChange={handleChange}
                    placeholder="Enter Prescription name (optional)"
                    className="inputs"
                    disabled={data?.key === "renew" || data?.key === "edit"}
                  />
                  <Form.Text muted>
                    If left blank, your own name will be used as the Prescription.
                  </Form.Text>
                </Form.Group>
          </div>
          <div className="row">
            <Form.Group className="mb-3 col-md-6" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                disabled={data?.key === "renew" || data?.key === "edit"}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                ref={phoneRef}
                className={`${errors.phone ? "is-invalid" : ""} inputs`}
                placeholder="Enter phone number (e.g., 03123456789)"
                maxLength="11"
                pattern="03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}"
                inputMode="numeric"
                title="Enter a valid Pakistani mobile number starting with 03"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
              {phoneValidationMessage && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                  {phoneValidationMessage}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3 col-md-6" controlId="formEmail">
              <Form.Label>Email <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
              <Form.Control
                disabled={data?.key === "renew" || data?.key === "edit"}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                ref={emailRef}
                className={`${errors.email ? "is-invalid" : ""} inputs`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </Form.Group>
          </div>
          <div className="row">
            <Form.Group className="mb-3 col-md-6" controlId="formAddress">
              <Form.Label>Delivery Address</Form.Label>
              <LocationIQAutocomplete
                value={formData.address}
                onChange={handleChange} 
                onSelect={handleAddressSelect}
                isInvalid={!!errors.address}
                disabled={data?.key === 'renew'}
              />
              {errors.address && (
                <div className="invalid-feedback d-block">{errors.address}</div>
              )}
            </Form.Group>

            <Form.Group className=" col-md-3" controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                value="Karachi"
                readOnly
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'not-allowed',
                  border: "1px solid grey",
                  borderRadius: "4px",
                }}
              />
            </Form.Group>

            <Form.Group className=" col-md-3" controlId="formState">
              <Form.Label>Province</Form.Label>
              <Form.Control
                name="state"
                value="Sindh"
                readOnly
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'not-allowed',
                  border: "1px solid grey",
                  borderRadius: "4px",
                }}
              />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Order Duration <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
              <Form.Select
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Duration
                </option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Number of Duration <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
              <Form.Select
                name="durationNumber"
                value={formData.durationNumber}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Number
                </option>
                {[...Array(31).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="row">
            {/* Ordering Medication For */}
            <Form.Group className="mb-3 col-md-12">
              <Form.Label>Ordering Medication For <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
              <Form.Select
                disabled={data?.key === "edit"}
                aria-label="Select ordering option"
                name="orderingFor"
                value={formData.orderingFor}
                onChange={handleOrderingForChange}
              >
                <option value="">Select Ordering For</option> {/* ✅ Default */}
                <option value="myself">Myself</option>
                <option value="someoneElse">Someone Else</option>
              </Form.Select>
            </Form.Group>

            {/* Conditional fields if "Someone Else" is selected */}
            {isForSomeoneElse && (
              <>
                {/* Patient's Name */}
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label htmlFor="patientName">Patient's Name <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span></Form.Label>
                  <Form.Control
                    disabled={data?.key === "renew" || data?.key === "edit"}
                    type="text"
                    id="patientName"
                    placeholder="Enter patient's name"
                    name="patientName" // Add name attribute
                    value={formData.patientName} // Bind value to state
                    onChange={handleChange} // Update state on change
                    className="inputs"
                  />
                </Form.Group>

                {/* Relation to Patient */}
                <Form.Group className="mb-3  col-md-6">
                  <Form.Label htmlFor="relationToPatient">
                    Relation to Patient <span style={{fontWeight: 'normal', color: '#888'}}>(optional)</span>
                  </Form.Label>
                  <Form.Select
                    disabled={data?.key === "renew" || data?.key === "edit"}
                    id="relationToPatient"
                    aria-label="Select relation"
                    name="relationToPatient" // Add name attribute
                    value={formData.relationToPatient} // Bind value to state
                    onChange={handleChange} // Update state on change
                  >
                    <option value="">Select Relation</option>
                    <option value="parent">Parent</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </div>
          {data?.key === "edit" && (
            <>
              <h5 style={{ marginTop: "1rem", color: "#00909D" }}>
                Order Items
              </h5>
              {orderItems?.length > 0 && (
                <div className="mt-4">
                  {/* Column Headers */}
                  <div
                    className="row font-weight-bold mb-2"
                    style={{ fontWeight: "bold" }}
                  >
                    <div className="col-md-6">Product Name</div>
                    <div className="col-md-2">Quantity</div>
                    <div className="col-md-2">Price</div>
                    <div className="col-md-2">Total Price</div>
                  </div>

                  {/* Input Rows */}
                  {orderItems?.map((item, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col-md-6">
                        <Form.Control
                          style={{
                            backgroundColor: "#d9d9d9",
                          }}
                          value={item.title}
                          disabled
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Control
                          style={{
                            backgroundColor: "#d9d9d9",
                          }}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const updatedItems = [...orderItems];
                            updatedItems[index].quantity = e.target.value;

                            // Optionally auto-update total price here
                            updatedItems[index].total_price = (
                              e.target.value * updatedItems[index].price_pu
                            ).toFixed(2);

                            setOrderItems(updatedItems);
                          }}
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Control
                          style={{
                            backgroundColor: "#d9d9d9",
                          }}
                          disabled
                          value={item.price_pu}
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Control
                          style={{
                            backgroundColor: "#d9d9d9",
                          }}
                          disabled
                          value={item.total_price}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <Form.Group className=" col-md-12" controlId="formAddress">
            <Form.Label>Referring Physician</Form.Label>
            <Form.Control
              name="referringPhysician"
              value={formData.referringPhysician}
              onChange={handleChange}
              isInvalid={!!errors.referringPhysician}
              ref={referringPhysicianRef}
              rows={2}
              style={{
                border: "1px solid grey",
                borderRadius: "4px",
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.state}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Prescription</Form.Label>
            <Dropzone
              onFileUpload={handleFileUpload}
              files={files}
              setFiles={setFiles}
            />
            {errors.images && (
              <div className="text-danger">{errors.images}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Medicine other than Prescription</Form.Label>
            <CreatableSelect
              isMulti
              isClearable
              name="nonPrescriptionMedicine"
              value={formData.nonPrescriptionMedicine}
              onChange={handleNonPrescriptionChange}
              options={productSuggestions.map((name) => ({ label: name, value: name }))}
              placeholder="Type or select medicines..."
              isDisabled={data?.key === "renew"}
              classNamePrefix="react-select"
            />
            {/* Inline quantity and type for each tag */}
            {formData.nonPrescriptionMedicine && formData.nonPrescriptionMedicine.length > 0 && (
              <div className="mt-2">
                {formData.nonPrescriptionMedicine.map((med, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
                    <span style={{ minWidth: 120 }}>{med.label}</span>
                    <Form.Control
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={med.quantity || ''}
                      onChange={e => handleMedicineDetailChange(idx, 'quantity', e.target.value)}
                      style={{ width: 70 }}
                    />
                    <Form.Select
                      value={med.quantityType || 'Stripe'}
                      onChange={e => handleMedicineDetailChange(idx, 'quantityType', e.target.value)}
                      style={{ width: 90 }}
                    >
                      <option value="Stripe">Strip</option>
                      <option value="Box">Box</option>
                    </Form.Select>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Special Instructions</Form.Label>
            <Form.Control
              as="textarea"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={3}
              className="inputs"
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Le5lfErAAAAAF9P1V4hJX7Bzub8zM9poYtJ2_lK"
              onChange={handleRecaptchaChange}
            />
            {errors.recaptcha && (
              <div className="text-danger mt-1">{errors.recaptcha}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="I agree to receive refill reminders and subscribe to the Smart Medics newsletter for updates and offers."
            />
          </Form.Group>
          
          {loader && (
            <>
              <LoadingSpinner />
            </>
          )}
          <Button
            disabled={!submitbtn || (data?.key === "edit" && !hasChanges)}
            type="submit"
            style={{ backgroundColor: "#00909D" }}
            className="w-100"
          >
            {data.key === "edit" ? "Proceed" : "Submit"}
          </Button>
        </Form>
      </Container>

      <div className="d-none" ref={thankyou}>
        <ThankYouScreen />
      </div>
      <Footer />
    </>
  );
}