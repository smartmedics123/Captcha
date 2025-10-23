import React from "react";
import { getCloudinaryUrl } from '../../utils/cdnImage';
import useIsMobile from "../../utils/useIsMobile";
const BikeSection = () => {
  const isMobile = useIsMobile();
  return (
    <div className="mb-5">
      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) -2.27%, #04ADA7 151.97%)",
            color: "#fff",
            borderRadius: "50px",
          }}
        >
          <img
            src={getCloudinaryUrl("bike.png", isMobile ? 400 : 800)}
            alt="bike"
            className="img-fluid"
            style={{ width: isMobile ? "100%" : "75%" }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default BikeSection;
