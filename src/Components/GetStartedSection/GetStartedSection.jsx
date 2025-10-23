import { Link } from "react-router-dom";

const GetStartedSection = () => {
  return (
    <div
      className="py-5"
      style={{
        background:
          "linear-gradient(107.85deg, #00969E 1.08%, #09C6B2 144.46%)",
        color: "#fff",
      }}
    >
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          {/* Left text */}
          <div className="col-md-5">
            <p className="mb-0 fs-5 ">
              There’s no charge for our service you just pay for the cost of
              your medications and delivery
            </p>
          </div>

          {/* Right button */}
          <div className="col-md-7 text-md-end mt-3 mt-md-0">
            <Link
              to={"/verification"}
              className="btn px-4 py-2 GetStartedSection-btn get-started-btn"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                color: "#fff",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              Get Started!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedSection;
