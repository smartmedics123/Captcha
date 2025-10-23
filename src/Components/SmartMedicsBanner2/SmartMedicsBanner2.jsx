import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import styles from "./SmartMedicsBanner2.module.css";

const SmartMedicsBanner2 = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <div className={styles.smartMedicsBanner2Container} ref={ref}>
      <div className={styles.smartMedicsBanner2Row}>
        <motion.div
          className={styles.smartMedicsBanner2Text}
          initial={{ opacity: 0, y: -60 }}
          animate={inView && { opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={getCloudinaryUrl('logo2.svg', 600)} alt="Smart Medics Logo" className={styles.smartMedicsBanner2Logo} />

          <h3 className={styles.smartMedicsBanner2Heading}>
            Simpler. Safer. Smarter
          </h3>

          <p className={styles.smartMedicsBanner2Paragraph}>
            We <span>sort</span>{" "}
            and{" "}
            <span>package</span>{" "}
            your{" "}
            <span>
              medications
            </span>{" "}
            in a spotless, regulated environment to{" "}
            <span>
              maintain the highest safety
            </span>{" "}
            and hygiene{" "}
            <span>standards</span>
            .
          </p>
        </motion.div>

        <motion.div
          className={styles.smartMedicsBanner2Image}
          initial={{ opacity: 0, x: -60 }}
          animate={inView && { opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <img
            src={getCloudinaryUrl('pharmacyImage.svg', 420)}
            alt="Pharmacy Illustration"
            className={styles.smartMedicsBanner2Img}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SmartMedicsBanner2;