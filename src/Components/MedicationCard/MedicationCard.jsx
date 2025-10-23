import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaCirclePlay } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

const MedicationCard = ({ videoOpen }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile/desktop video
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loop with 2s delay after video ends
  const handleVideoEnd = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch((e) =>
            console.warn("Autoplay blocked by browser:", e.message)
          );
      }
    }, 2000); // 2 second delay
  };

  return (
    <div className="mt-4">
      <div className="row align-items-center">
        {/* Left side content */}
        <div className="col-md-6 text-center text-md-start p-5" ref={ref}>
          <motion.h2
            className="text-primary fw-semibold"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -60 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <span className="text-black">Your</span> Medication, Carefully{" "}
            <span className="text-black"> Arranged and Delivered</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -60 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            Simplify your medication routine with pre-sorted pills at no extra
            fee
          </motion.p>

          <motion.div
            className="mt-5 d-flex justify-content-center justify-content-md-start align-items-center gap-2 fw-semibold MedicationCard-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            onClick={videoOpen}
          >
            <FaCirclePlay size={30} /> Introducing Smart Medics Video (01:01)
          </motion.div>
        </div>

        {/* Right side video */}
        <div className="col-md-6">
          <motion.video
            key={isMobile ? "mobile" : "desktop"}
            ref={videoRef}
            className="img-fluid w-100"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 60 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              height: "440px",
              border: "none",
              outline: "none",
              objectFit: "cover",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
          >
            <source
              src={
                isMobile
                  ? "https://res.cloudinary.com/dc5nqer3i/video/upload/v1759819688/medication-package-mobile_p0z0rt.mp4"
                  : "https://res.cloudinary.com/dc5nqer3i/video/upload/v1759819682/medication-package_zarzrl.mp4"
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </motion.video>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
