import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCloudinaryUrl } from "../../utils/cdnImage";

const deliveryData = [
  { publicId: "express.svg", title: "Express Delivery" },
  { publicId: "cashondelivery.svg", title: "Cash On Delivery" },
  { publicId: "realtime.svg", title: "Real-Time Tracking" },
  { publicId: "notification.svg", title: "Delivery Notification" },
  { publicId: "flexible.svg", title: "Flexible Delivery Options" },
];

const DeliverySection = () => {
  const [ref0, inView0] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.4 });

  const inViewRefs = [
    { ref: ref0, inView: inView0 },
    { ref: ref1, inView: inView1 },
    { ref: ref2, inView: inView2 },
    { ref: ref3, inView: inView3 },
    { ref: ref4, inView: inView4 },
  ];
  return (
    <div className="py-5 bg-white text-center">
      <div className="container">
        <h2 className="mb-5">
          How We <span className="text-primary">Deliver</span>
        </h2>

        <div className="row justify-content-center">
          {deliveryData.map((item, index) => {
            const { ref, inView } = inViewRefs[index];

            return (
              <motion.div
                className="col-md-2 mb-4"
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: -50 }}
                animate={inView && { opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              >
                <div
                  className="p-3 bg-white d-flex flex-column align-items-center justify-content-center"
                  style={{
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    minHeight: "200px",
                  }}
                >
                  <img
                    src={getCloudinaryUrl(item.publicId)}
                    alt={item.title}
                    className="img-fluid mb-3"
                    style={{ height: "80px", objectFit: "contain" }}
                  />
                  <p className="fw-medium mb-0">{item.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;
