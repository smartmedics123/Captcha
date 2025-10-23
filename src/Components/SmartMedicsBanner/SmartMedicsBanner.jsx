import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import { Link } from "react-router-dom";

const SmartMedicsBanner = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div className="container mt-4 py-5 d-flex align-items-center justify-content-center">
      <div
        className="d-md-flex align-items-center justify-content-between pt-3 position-relative SmartMedicsBanner"
        ref={ref}
      >
        {/* Decorative background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Text Section */}
        <motion.div
          className="text-white p-3 py-5 p-md-5"
          initial={{ opacity: 0, x: -60 }}
          animate={inView && { opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="d-flex mt-5 mt-md-0 align-items-center mb-3">
            <h2 className="fw-semibold pe-5 pe-md-0">
              Smart Medics, Just a Tap Away
            </h2>
          </div>
          <ul className="list-unstyled">
            <li className="mb-2">
              • Get timely updates about your medications
            </li>
            <li>• Connect with our pharmacy for expert advice</li>
          </ul>
          <motion.button
            className="btn mt-3 bg-opacity-25 bg-white text-white get-started-btn"
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            initial={{ opacity: 0 }}
            animate={inView && { opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link to={"/verification"}>Get Started!</Link>
          </motion.button>
        </motion.div>

        {/* Main Image */}
        <motion.img
          src={getCloudinaryUrl('phone-hand.png', 300)}
          alt="Hand holding phone with Smart Medics logo"
          className="img-fluid mt-5 mt-md-0 me-md-5"
          style={{ maxWidth: "300px", height: "auto" }}
          initial={{ opacity: 0, x: 80 }}
          animate={inView && { opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />

        {/* Object1 (left in) */}
        <motion.img
          src={getCloudinaryUrl('object-2.png', 80)}
          alt="Object 1"
          className="img-fluid object1"
          style={{ maxWidth: "80px", height: "auto" }}
          initial={{ opacity: 0, x: -60 }}
          animate={inView && { opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Object3 (bottom in) */}
        <motion.img
          src={getCloudinaryUrl('object-4.png')}
          alt="Object 3"
          className="img-fluid object3"
          style={{ maxWidth: "80px", height: "auto" }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView && { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Object4 (static - no animation needed) */}
        <img
          src={getCloudinaryUrl('objects-3.png', 150)}
          alt="Object 4"
          className="img-fluid object4"
          style={{ maxWidth: "80px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default SmartMedicsBanner;
