
import { useEffect, useState } from 'react';
import { Container,Form, Row, Col, Button } from 'react-bootstrap';
import './ProfileManagement.css';
import { FaCamera } from "react-icons/fa";
import { getCustomerData, UserProfile } from '../../../../services/CustomerDashboard/profileManagement';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setProfileData } from '../../../../features/profile/profileSlice';
import InputMask from "react-input-mask";
import "react-phone-input-2/lib/style.css";
const ProfileManagement = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    address: "",
    primaryEmail: "",
    secondaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
  });
  const [isPrimaryPhoneDisabled, setIsPrimaryPhoneDisabled] = useState(false);
  const [isPrimaryEmailDisabled, setIsPrimaryEmailDisabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Development helper: Set up test customer if not available
        const customerIdOrNumber = sessionStorage.getItem('customerNumber') || sessionStorage.getItem('customerId');
        if (!customerIdOrNumber && import.meta.env.DEV) {
          console.log('🔧 Development mode: Setting up test customer');
          sessionStorage.setItem('customerNumber', 'WA-1');
          sessionStorage.setItem('customerId', '4');
        }

        const response = await getCustomerData(); // Fetch customer data using the POST method
        dispatch(setProfileData(response.data)); // Update Redux state

        // Check and log the full response structure
        console.log("👤 ProfileManagement Full Response:", response);
  
        if (response?.data?.customer) {
          const customerData = response.data.customer; // Extract the correct customer object
          console.log("👤 ProfileManagement Customer Data:", customerData);

          // check signup method 
          if(customerData.signupMethod === "email"){
            setIsPrimaryEmailDisabled(customerData.primaryEmail !== null);
          }
  
          // Update formData state with the fetched customer data
          // Note: Backend returns firstName and lastName separately
          setFormData({
            firstName: customerData.firstName || "",
            lastName: customerData.lastName || "",
            address: customerData.address || "",
            primaryEmail: customerData.primaryEmail || "",
            secondaryEmail: customerData.secondaryEmail || "",
            primaryPhone: customerData.primaryPhone || "",
            secondaryPhone: customerData.secondaryPhone || "",
          });
          
          console.log("👤 ProfileManagement Form Data Set:", {
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            primaryEmail: customerData.primaryEmail,
            secondaryEmail: customerData.secondaryEmail,
            primaryPhone: customerData.primaryPhone,
            secondaryPhone: customerData.secondaryPhone
          });
          
          // Determine whether the primaryPhone input should be disabled
          setIsPrimaryPhoneDisabled(customerData.primaryPhone !== null);

        } else {
          console.error("❌ Customer data structure is not as expected:", response);
        }
      } catch (error) {
        console.error("❌ Error fetching customer data:", error);
        
        // Show user-friendly error message
        if (error.message.includes('Customer identification')) {
          Swal.fire({
            title: "Authentication Error",
            text: "Please login to access your profile.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    };
  
    fetchData();
  }, [dispatch]);
  
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email regex
    
    // Basic required field validations - only essential fields
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    }

    if (!formData.primaryEmail || !emailRegex.test(formData.primaryEmail)) {
      newErrors.primaryEmail = "Valid Primary Email is required.";
    }
  
    // Optional secondary email validation only if provided
    if (formData.secondaryEmail && formData.secondaryEmail.trim() && !emailRegex.test(formData.secondaryEmail)) {
      newErrors.secondaryEmail = "Please enter a valid email address.";
    }

    // Basic phone validation - only if primary phone exists
    if (!formData.primaryPhone || !formData.primaryPhone.trim()) {
      newErrors.primaryPhone = "Primary Phone Number is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if customer identification is available
    try {
      const customerIdOrNumber = sessionStorage.getItem('customerNumber') || sessionStorage.getItem('customerId');
      console.log('👤 ProfileManagement: Customer identifier check:', customerIdOrNumber);
      
      if (!customerIdOrNumber) {
        Swal.fire({
          title: "Authentication Error",
          text: "Customer identification not found. Please login again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }
    } catch (error) {
      console.error('❌ Customer identification error:', error);
      Swal.fire({
        title: "Authentication Error", 
        text: "Unable to verify customer identity. Please login again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    console.log('👤 ProfileManagement: Form data before validation:', formData);

    // Validate form before showing confirmation
    if (!validate()) {
      console.log('❌ Form validation failed. Errors:', errors);
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // User confirmed to save changes
        try {
          console.log('👤 ProfileManagement: Submitting form data:', formData);
          const response = await UserProfile(formData); // Pass the form data
          Swal.fire({
            title: "Profile Updated!",
            text: "Your profile has been updated successfully.",
            icon: "success",
            confirmButtonColor: "#00909D",
          }).then(() => {
             // Reload the page
             window.location.reload();
            // Optionally reload the page or perform any additional actions
            setIsEditing(false); // Exit edit mode
          });
        } catch (error) {
          console.error("❌ Error submitting profile:", error);
          console.error("❌ Form data that was submitted:", formData);
          
          // Handle backend validation errors
          if (error.response?.data?.errors) {
            const backendErrors = {};
            error.response.data.errors.forEach(err => {
              backendErrors[err.path] = err.msg;
            });
            setErrors(backendErrors);
            
            const errorMessages = error.response.data.errors.map(err => err.msg).join("\n");
            Swal.fire({
              title: "Validation Error",
              text: errorMessages,
              icon: "error",
              confirmButtonColor: "#d33",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "An error occurred while updating your profile.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        }
      } else {
        // User canceled, no further action
        Swal.fire({
          title: "Cancelled",
          text: "Your changes were not saved.",
          icon: "info",
          confirmButtonColor: "#00909D",
        });
      }
    });
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  
  return (
 <Container>
  <h1 className="fw-bold">Profile Management</h1>

  <div className="profile-card d-flex flex-column flex-md-row p-3">
    {/* Left Side - Profile Image */}
   

    {/* Right Side - Form */}
    <Form onSubmit={handleSubmit} className="flex-grow-1">
      {/* First Name */}
<Form.Group as={Row} className="mb-3">
  {/* First Name */}
  <Col sm={12} md={6}>
    <Form.Label>First Name *</Form.Label>
    <Form.Control
      type="text"
      placeholder="First Name"
      name="firstName"
      className="custom-input-bg"
      value={formData.firstName}
      disabled={!isEditing}
      onChange={handleChange}
      isInvalid={!!errors.firstName}
    />
    <Form.Control.Feedback type="invalid">
      {errors.firstName}
    </Form.Control.Feedback>
  </Col>

  {/* Last Name */}
  <Col sm={12} md={6}>
    <Form.Label>Last Name</Form.Label>
    <Form.Control
      type="text"
      placeholder="Last Name"
      name="lastName"
      className="custom-input-bg"
      value={formData.lastName}
      disabled={!isEditing}
      onChange={handleChange}
      isInvalid={!!errors.lastName}
    />
    <Form.Control.Feedback type="invalid">
      {errors.lastName}
    </Form.Control.Feedback>
  </Col>
</Form.Group>
    {/* Emails */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Primary Email Address *</Form.Label>
            <Form.Control
              type="email"
              placeholder="Primary Email"
              className="custom-input-bg"
              disabled={isPrimaryEmailDisabled}
              name="primaryEmail"
              value={formData.primaryEmail}
              onChange={handleChange}
              isInvalid={!!errors.primaryEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.primaryEmail}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Secondary Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Secondary Email"
              className="custom-input-bg"
              disabled={!isEditing}
              name="secondaryEmail"
              value={formData.secondaryEmail}
              onChange={handleChange}
              isInvalid={!!errors.secondaryEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.secondaryEmail}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Phones */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Primary Phone Number *</Form.Label>
            <InputMask
              className="custom-input-bg"
              mask="9999-9999999"
              value={formData.primaryPhone}
              disabled={isPrimaryPhoneDisabled}
              onChange={(e) =>
                setFormData({ ...formData, primaryPhone: e.target.value })
              }
            >
              {(inputProps) => (
                <Form.Control
                  {...inputProps}
                  type="text"
                  placeholder="Primary Phone"
                  name="primaryPhone"
                  isInvalid={!!errors.primaryPhone}
                />
              )}
            </InputMask>
            {errors.primaryPhone && (
              <div className="invalid-feedback d-block">
                {errors.primaryPhone}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Secondary Phone Number</Form.Label>
            <InputMask
              className="custom-input-bg"
              disabled={!isEditing}
              mask="9999-9999999"
              value={formData.secondaryPhone}
              onChange={(e) =>
                setFormData({ ...formData, secondaryPhone: e.target.value })
              }
            >
              {(inputProps) => (
                <Form.Control
                  {...inputProps}
                  type="text"
                  placeholder="Secondary Phone"
                  name="secondaryPhone"
                  isInvalid={!!errors.secondaryPhone}
                />
              )}
            </InputMask>
            {errors.secondaryPhone && (
              <div className="invalid-feedback d-block">
                {errors.secondaryPhone}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>


      {/* Address */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={12} md={4}>
          Full Address
        </Form.Label>
        <Col sm={12} md={12}>
          <Form.Control
            type="text"
            placeholder="Enter full address"
            name="address"
            className="custom-input-bg"
            value={formData.address}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </Col>
      </Form.Group>

  

      {/* Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-md-end justify-content-center mt-4">
        {isEditing ? (
          <>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="me-2 savebtn"
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            className="savebtn"
            variant="primary"
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </Form>
  </div>
</Container>

  );
};

export default ProfileManagement;
