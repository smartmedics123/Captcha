import { useSelector, useDispatch } from "react-redux";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "../../features/cart/cartSlice";
// import WelcomeModal from "../WelcomModal/WelcomModal";
import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CartMain = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem("customerId");

  const handleIncrease = (id) => {
    // Find the cart item to check max available
    const cartItem = cartItems.find(item => item.id === id);
    if (cartItem && cartItem.maxAvailable && cartItem.quantity >= cartItem.maxAvailable) {
      alert(`Only ${cartItem.maxAvailable} ${cartItem.type}(s) available in stock`);
      return;
    }
    dispatch(increaseQuantity({ id }));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQuantity({ id }));
  };

  const handleRemove = (id) => {
    dispatch(removeItem({ id }));
  };

  const handleCheckoutClick = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      // Automatically create guest customer for nonsorted orders
      try {
        const res = await fetch(`${API_BASE_URL}/customer/guest-create`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_API_SECURITY_KEY }
        });
        const data = await res.json();
        if (data.status === "success" && data.customerId) {
          sessionStorage.setItem("customerId", data.customerId);
          navigate("/checkout");
        } else {
          alert("Guest checkout failed. Please try again.");
        }
      } catch (err) {
        alert("Guest checkout failed. Please try again.");
      }
    }
  };

  // const handleLogin = () => {
  //   setShowModal(false);
  //   navigate("/verification");
  // };

  // const handleGuest = async () => {
  // setShowModal(false);
  // try {
  //   const res = await fetch(`${API_BASE_URL}/customer/guest-create`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_API_SECURITY_KEY }
  //   });
  //   const data = await res.json();
  //   if (data.status === "success" && data.customerId) {
  //     sessionStorage.setItem("customerId", data.customerId);
  //     navigate("/checkout");
  //   } else {
  //     alert("Guest checkout failed. Please try again.");
  //   }
  // } catch (err) {
  //   alert("Guest checkout failed. Please try again.");
  // }
  // };

  const totalPrice = cartItems.reduce(
    (total, item) =>
     total + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-5">
      <h2 className="d-flex align-content-center gap-2 text-black my-5">
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <IoMdArrowBack />
        </span>
        Cart Overview
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <img
            src={getCloudinaryUrl("empty-cart.svg")}
            alt="Empty Cart"
            className="img-fluid mb-4"
            style={{ maxWidth: "200px" }}
            loading="lazy"
          />
          <h4 className="mb-3 text-black fw-semibold">Empty?</h4>
          <p className="mb-4" style={{ color: "#757575" }}>
            You haven’t added anything to your cart!
          </p>
        </div>
      ) : (
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-8 mb-4 shadow rounded p-4">
            <h3 className="mb-4 fw-semibold text-black">Your Items</h3>
            <div className="row">
              {cartItems.map((item) => (
                <div className="col-md-6" key={item.id}>
                  <div
                    className="card mb-3 border rounded-3 shadow-sm"
                    style={{ backgroundColor: "#fff", padding: "15px" }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6
                        className="m-0"
                        style={{
                          color: "#2D2D2D",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.quantity}x {item.name}
                      </h6>
                      {/* {item.maxAvailable && (
                        // <small className="text-muted">
                        //   Stock: {item.maxAvailable} available
                        // </small>
                      )} */}
                      <br/>
                      
                    </div>
                    <p
                        className="m-0"
                        style={{ color: "#757575", fontSize: "16px" }}
                      >
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                    
                      <div className="d-flex align-items-center border rounded-5">
                      
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => handleDecrease(item.id)}
                          style={{
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            marginRight: "10px",
                          }}
                        >
                          -
                        </button>
                        <span style={{ margin: "0 10px", color: "#2D2D2D" }}>
                          {item.quantity}
                        </span>
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => handleIncrease(item.id)}
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
                        onClick={() => handleRemove(item.id)}
                        style={{ padding: "5px 15px", borderRadius: "20px" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-4">
            <div
              className="shadow rounded p-4"
              style={{ backgroundColor: "#F8F9FA" }}
            >
              <h4 className="mb-4 text-black">Summary Details</h4>
              <div className="d-flex justify-content-between mb-3">
                <span style={{ color: "#757575" }}>
                  Subtotal ({cartItems.length} items)
                </span>
                <span style={{ color: "#757575" }}>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
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
                <span style={{ color: "#757575" }}>Rs. {Math.round(totalPrice + 10)}</span>
              </div>
              <Link
                to="#"
                onClick={handleCheckoutClick}
                className="btn w-100 bg-black text-white rounded-pill py-2"
              >
                Continue to Checkout
              </Link>
            </div>
          </div>
          {/* <WelcomeModal
  isOpen={showModal}
  setIsOpen={setShowModal}
  handleGuest={handleGuest}
  handleLogin={handleLogin}
/> */}
        </div>
      )}
    </div>
  );
};

export default CartMain;
