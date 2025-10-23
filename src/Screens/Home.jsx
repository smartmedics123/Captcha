import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import Images from "../assets/Images";
import { Link } from "react-router-dom";
import CustomNavbar from "../Components/Navbar/CustomNavbar";
import { Modal } from "react-bootstrap";

import { Col, Container, Row, Button, Image } from "react-bootstrap";
import { FaCheckCircle, FaPlay } from "react-icons/fa"; // Removed unused icons for clarity
import Footer from "../Components/Footer";
import logo from "./../assets/SmartMedicslogo.png";
import MyCarousel from "../Components/CustomCarousel";
import SMNavbar from "../Components/SMNavbar";
import MenuBar from "../Components/MenuBar/MenuBar";
import MobileSearchBar from "../Components/MobileSearchBar/MobileSearchBar";
import HomeHeroCarousel from "../Components/HomeHeroCarousel/HomeHeroCarousel";
import FloatingButtons from "../Components/FloatingButtons/FloatingButtons";
import MedicationCard from "../Components/MedicationCard/MedicationCard";
import MedicationSlider from "../Components/MedicationSlider/MedicationSlider";
import SmartMedicsBanner from "../Components/SmartMedicsBanner/SmartMedicsBanner";
import SmartMedicsBanner2 from "../Components/SmartMedicsBanner2/SmartMedicsBanner2";
import GetStartedSection from "../Components/GetStartedSection/GetStartedSection";
import DeliverySection from "../Components/DeliverySection/DeliverySection";
import BikeSection from "../Components/BikeSection/BikeSection";
import YoutubeVideo from "../Components/YoutubeVideo/YoutubeVideo";
import { Helmet } from "react-helmet";
import { pageMeta } from "../metaConfig";

const meta = pageMeta["/"];
function Home() {
  const [showModal, setShowModal] = useState(false);
  const videoModalRef = useRef(null);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    if (videoModalRef.current) {
      videoModalRef.current.pause();
      videoModalRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      {/* <CustomNavbar /> */}
      <SMNavbar />
      <HomeHeroCarousel />
      <YoutubeVideo />
      <FloatingButtons />
      <MedicationCard videoOpen={handleOpen} />
      <MedicationSlider />
      <SmartMedicsBanner />
      <SmartMedicsBanner2 />
      <GetStartedSection />
      <DeliverySection />
      <BikeSection />
      <Footer />
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
        backdropClassName="white-backdrop"
        className="custom-video-modal"
      >
        <Modal.Body className="position-relative p-0 d-flex justify-content-center align-items-center">
          {/* Close Button */}
          <button
            aria-label="Close video"
            onClick={handleClose}
            style={{
              position: "fixed",
              top: "20px",
              right: "30px",
              zIndex: 1056, // Higher than modal
              fontSize: "2rem",
              background: "transparent",
              border: "none",
              color: "#000",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
          <div style={{ width: "90%", maxWidth: "960px", aspectRatio: "16/9" }}>

          <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/W3dj9E2C7PI?autoplay=1"
                title="Smart Medics Intro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
                style={{ borderRadius: "10px" }}
              />

            {/* <iframe
              src="https://player.vimeo.com/video/1080078885?h=c38f996ab1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "10px",
              }}
              title="SmartMedicsBannerVideo"
            ></iframe>

            <script src="https://player.vimeo.com/api/player.js"></script> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
