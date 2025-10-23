import React from "react";
import { Container, Row } from "react-bootstrap";
// 1. Import 'motion' from Framer Motion
import { motion } from "framer-motion";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import SMNavbar from "../Components/SMNavbar";
import Images from "../assets/Images";

export default function HowItWorks() {
  // 2. Define a reusable animation configuration object
  const animationProps = {
    initial: { opacity: 0, y: 50 }, // Start invisible and slightly below
    whileInView: { opacity: 1, y: 0 }, // Animate to fully visible and original position
    viewport: { once: true, amount: 0.3 }, // Trigger animation once 30% is visible
    transition: { duration: 0.6 }, // Animation duration
  };

  return (
    <>
      <SMNavbar />

      <Container fluid>
        {/* 3. Wrap each Row with motion.div and apply animation props */}
        <motion.div {...animationProps}>
          <Row>
            <img
              src={Images.HITWBanner0}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>

        <motion.div {...animationProps}>
          <Row className="py-5">
            <img
              src={Images.HITWBanner1}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>

        <motion.div {...animationProps}>
          <Row className="py-5">
            <img
              src={Images.HITWBanner2}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>

        <motion.div {...animationProps}>
          <Row className="py-5">
            <img
              src={Images.HITWBanner3}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>

        <motion.div {...animationProps}>
          <Row className="py-5">
            <img
              src={Images.HITWBanner4}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>

        <motion.div {...animationProps}>
          <Row className="py-5">
            <img
              src={Images.HITWBanner5}
              className={"img-fluid w-100"}
              loading="lazy"
              width="800"
              height="400"
            />
          </Row>
        </motion.div>
      </Container>

      <Footer />
    </>
  );
}