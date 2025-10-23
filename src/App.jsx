import RecipientOrders from "./Screens/CustomerDashboard/Components/RecipientOrders";
import React, { useEffect, useState, Suspense, lazy } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./Components/ScrollToTop";
import LoadingSpinner from "./Components/Spinner/LoadingSpinner";
import { NotificationProvider } from "./context/NotificationContext_optimized";

const AboutUs = lazy(() => import("./Screens/AboutUs"));
const AllProducts = lazy(() => import("./Screens/AllProducts"));
const ProductDetails = lazy(() => import("./Screens/ProductDetails"));
const CheckOut = lazy(() => import("./Screens/CheckOut"));
const PrescriptionOrder = lazy(() => import("./Screens/PreSortedOrder/PrescriptionOrder"));
const PrivacyPolicy = lazy(() => import("./Screens/PrivacyPolicy"));
const Conditions = lazy(() => import("./Screens/Conditions"));
const DeliveryPolicy = lazy(() => import("./Screens/DeliveryPolicy"));
const CancelationPolicy = lazy(() => import("./Screens/CancelationPolicy"));
const Home = lazy(() => import("./Screens/Home"));
const TrackOrder = lazy(() => import("./Screens/TrackOrder"));
const OrderConfirmation = lazy(() => import("./Screens/OrderConfirmation"));
const Verification = lazy(() => import("./Screens/VerificationScreen/Verification"));
const ThankYouScreen = lazy(() => import("./Screens/ThankYouScreen/ThankYouScreen"));
const OrderHistory = lazy(() => import("./Screens/OrdersHistory/OrderHistory"));
const Dashboard = lazy(() => import("./Screens/CustomerDashboard/Components/Dashboard/Dashboard"));
const Notifications = lazy(() => import("./Screens/CustomerDashboard/Components/Notifications/Notifications"));
const ProfileManagement = lazy(() => import("./Screens/CustomerDashboard/Components/ProfileManagement/ProfileManagement"));
const AddressBook = lazy(() => import("./Screens/CustomerDashboard/Components/AddressBook/AddressBook"));
const PaymentMethod = lazy(() => import("./Screens/CustomerDashboard/Components/PaymentMethod/PaymentMethod"));
const Default = lazy(() => import("./Screens/CustomerDashboard/Components/Dashboard/Default/Default"));
const PrescriptionManagement = lazy(() => import("./Screens/CustomerDashboard/Components/PrescriptionManagement/PrescriptionManagement"));
const RecipientProfile = lazy(() => import("./Screens/CustomerDashboard/Components/RecipientProfile/RecipientProfile"));
const OrderManagement = lazy(() => import("./Screens/CustomerDashboard/Components/OrderManagement/OrderManagement"));
const ContactUs = lazy(() => import("./Screens/ContactUs/ContactUs"));
const Careers = lazy(() => import("./Screens/Careers"));
const RenewOrder = lazy(() => import("./Screens/CustomerDashboard/Screens/RenewOrder"));
const HowItWorks = lazy(() => import("./Screens/HowItWorks"));
const Cart = lazy(() => import("./Screens/Cart"));
const Medicines = lazy(() => import("./Screens/Medicines"));
const NutritionSupplements = lazy(() => import("./Screens/NutritionSupplements"));
const SelfMedication = lazy(() => import("./Screens/SelfMedication"));
const MedicalSupplies = lazy(() => import("./Screens/MedicalSupplies"));
const ProductPage = lazy(() => import("./Screens/ProductPage"));
const PrivacyPolicy2 = lazy(() => import("./Screens/PrivacyPolicy2"));
const CancellationPolicy = lazy(() => import("./Screens/CancellationPolicy"));
const JobDetail = lazy(() => import("./Screens/JobDetail"));
const JobApply = lazy(() => import("./Screens/JobApply"));
const CustomerSupport = lazy(() => import("./Screens/CustomerSupport"));

function App() {
  const [isOtpVerified, setIsOtpVerified] = useState(null); // Default to null until checked

  // Check localStorage for OTP verification state on load
  useEffect(() => {
    const otpVerified = sessionStorage.getItem("isOtpVerified") === "true";
    setIsOtpVerified(otpVerified);
  }, []);

  // Update localStorage whenever the state changes
  useEffect(() => {
    if (isOtpVerified !== null) {
      // Only update if the state is set
      sessionStorage.setItem("isOtpVerified", isOtpVerified);
    }
  }, [isOtpVerified]);

  if (isOtpVerified === null) {
    // Render nothing or a loading spinner until OTP verification state is checked
    return <LoadingSpinner />;
  }

  return (
    <NotificationProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/recipient-orders/:recipientId" element={<RecipientOrders />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/nutrition-supplements" element={<NutritionSupplements />} />
          <Route path="/self-medication" element={<SelfMedication />} />
          <Route path="/medical-supplies" element={<MedicalSupplies />} />
          <Route path="/product/:slug" element={<ProductPage />} />

          {/* Protected Route */}
          <Route
            path="/preSorted-order"
            element={
              isOtpVerified ? (
                <PrescriptionOrder />
              ) : (
                <Navigate to="/verification" />
              )
            }
          />

          <Route path="/" element={<Home />} />
          <Route path="/productdetails" element={<ProductDetails />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy2 />} />
          <Route path="/terms-conditions" element={<Conditions />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/job-apply/:id" element={<JobApply />} />

          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Pass setIsOtpVerified to Verification for OTP verification */}

          {/* if otp is verified then user direct to pre-sorted form else verifiacation page loads */}
          <Route
            path="/verification"
            element={
              isOtpVerified ? (
                <Navigate to="/preSorted-order" />
              ) : (
                <Verification setIsOtpVerified={setIsOtpVerified} />
              )
            }
          />

          <Route path="/thankyou" element={<ThankYouScreen />} />
          <Route path="/history" element={<OrderHistory />} />

          <Route path="/spin" element={<LoadingSpinner />} />
          {/* if any route is not present  */}
          <Route path="*" element={<Navigate replace to="/" />} />

          {/* ------------------------Customer Dashboard-------------------------- */}

          {/* Dashboard route */}
          <Route
            path="/dashboard"
            element={isOtpVerified ? <Dashboard /> : <Navigate to="/" />}
          >
            {/* Default route to load when /dashboard is visited */}
            <Route index element={<Default />} />
            <Route path="renew-order/:orderId" element={<RenewOrder />} />
            {/* Additional routes */}
            <Route path="order-management" element={<OrderManagement />} />
            <Route path="customer-dashboard" element={<Default />} />
            <Route
              path="prescription-management"
              element={<PrescriptionManagement />}
            />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile-managment" element={<ProfileManagement />} />
            <Route path="address-book" element={<AddressBook />} />
            <Route path="payment-method" element={<PaymentMethod />} />
            <Route path="recipient-profile" element={<RecipientProfile />} />
          </Route>
        </Routes>
      </Suspense>
      </Router>
      
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificationProvider>
  );
}

export default App;
