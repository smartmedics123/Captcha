import logo from "../../assets/Images/logo3.png";
import { X } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const WelcomeModal = ({ isOpen, setIsOpen, handleGuest, handleLogin }) => {
  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content text-center align-items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-end w-100">
          <X onClick={handleClose} className="fs-3 cursor-pointer" />
        </div>
        <img
          src={logo}
          alt="logo"
          className="modal-checkmark img-fluid text-center mt-2"
        />
        <h2 className="modal-title">Hey There!</h2>
        <p className="modal-text">Login below to explore more</p>
        <div className="row w-100">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="border rounded-4 p-3 d-flex flex-column align-items-center h-100">
              <img
                src="/guest-illustration.svg"
                alt="guest"
                className="illustration-img" // Added class for styling
              />
              <p className="mt-2 text-center small">
                Jump right in—no sign-up needed.
              </p>
              <button className="modal-btn track-btn w-100" onClick={handleGuest}>
                Login as a Guest
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="border rounded-4 p-3 d-flex flex-column align-items-center h-100">
              <img
                src="/login-illustration.svg"
                alt="login"
                className="illustration-img" // Added class for styling
              />
              <p className="mt-2 text-center">Sign up to unlock full features</p>
              <button className="modal-btn track-btn w-100" onClick={handleLogin}>
                Signup for full access
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 15px;
          text-align: center;
          width: 90%; /* Default for mobile */
          max-width: 350px; /* Max-width for mobile */
          height: auto;
          max-height: 95vh;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: start;
          gap: 16px;
          overflow-y: auto; /* Add scroll for content that might exceed height */
        }

        @media (min-width: 768px) {
          .modal-content {
            max-width: 700px; /* Wider for desktop, as per your previous request */
            width: 100%;
            padding: 20px;
          }
        }

        .modal-content p {
          text-align: center;
        }

        .modal-checkmark {
          width: 160px; /* Increased size for mobile */
          margin-bottom: 10px;
        }

        @media (min-width: 768px) {
          .modal-checkmark {
            width: 220px; /* Increased size for desktop */
          }
        }

        .modal-title {
          color: #2d2d2d;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 20px;
          margin-bottom: 5px;
        }
        @media (min-width: 768px) {
          .modal-title {
            font-size: 24px;
          }
        }

        .modal-text {
          color: #757575;
          margin-bottom: 20px;
          font-size: 14px;
          margin-bottom: 10px;
        }
        @media (min-width: 768px) {
          .modal-text {
            font-size: 16px;
          }
        }

        /* Styling for the illustration images */
        .illustration-img {
          width: 100px; /* Default for mobile */
          height: auto;
          margin-bottom: 10px; /* Add some space below the image */
        }

        @media (min-width: 576px) { /* Small devices (sm in Tailwind) */
          .illustration-img {
            width: 120px;
          }
        }

        @media (min-width: 768px) { /* Medium devices (md in Tailwind, desktop breakpoint) */
          .illustration-img {
            width: 200px; /* Larger for desktop */
          }
        }

        .modal-btn {
          padding: 8px 20px;
          border-radius: 99999px;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .track-btn {
          background-color: #000;
          color: #fff;
        }

        .continue-btn {
          background-color: transparent;
          color: #000;
          border: 1px solid #ced4da;
          transition: background 0.3s ease;
        }

        .track-btn:hover {
          background: linear-gradient(
            107.85deg,
            #00969e 1.08%,
            #09c6b2 144.46%
          );
        }

        .continue-btn:hover {
          background: linear-gradient(
            107.85deg,
            #00969e 1.08%,
            #09c6b2 144.46%
          );
          color: #fff;
        }

        .border {
          padding: 10px; /* Adjusted padding for mobile */
        }

        @media (min-width: 768px) {
            .border {
                padding: 12px !important; /* Keep original for desktop */
            }
        }

        /* Ensure content within the border respects flex column and aligns items */
        .border.d-flex.flex-column.align-items-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between; /* Distribute space */
            text-align: center;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;