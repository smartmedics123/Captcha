import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import "swiper/css";
import "swiper/css/effect-fade";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import useIsMobile from "../../utils/useIsMobile";
import { getCloudinaryUrl } from "../../utils/cdnImage";

const images = [getCloudinaryUrl('calander.png', 600), getCloudinaryUrl('medicationImage2.png', 600), getCloudinaryUrl('medicationImage3.png',600)];

const MedicationSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const isMobile = useIsMobile();
  const swiperRef = useRef(null);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => {
      setFade(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const progressBar = (index) => (
    <div className="d-flex align-items-center mb-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          onClick={() => {
            swiperRef.current?.slideToLoop(i);
          }}
          className={i === index ? " me-2" : " me-2"}
          style={{
            width: "100px",
            height: "6px",
            borderRadius: "20px",
            transition: "background-color 0.3s",
            cursor: "pointer",
            backgroundColor: i === index ? "#0cb3a2" : "#e8e8e8",
          }}
        ></div>
      ))}
    </div>
  );

  const slideData = [
    {
      heading: (
        <>
          <span className="text-black">Let us handle</span>{" "}
          <span className="text-primary">sorting</span>{" "}
          <span className="text-black">
            your <span className="text-primary">medications</span> by{" "}
            <span className="text-primary">date and time</span>
          </span>
        </>
      ),
      description: "No more waiting, sorting, or hunting for refills.",
    },
    {
      heading: (
        <>
          <span className="text-black">We’ll</span>{" "}
          <span className="text-primary">bring</span>{" "}
          <span className="text-black">your</span>{" "}
          <span className="text-primary">medications</span>{" "}
          <span className="text-black">to you</span>{" "}
          <span className="text-primary">every week/month</span>
        </>
      ),
      description: "",
    },
    {
      heading: (
        <>
          <span className="text-black">Add any</span>{" "}
          <span className="text-primary">extra pharmacy items</span>{" "}
          <span className="text-black">you might need, </span>{" "}
          <span className="text-primary">like injections,</span>{" "}
          <span className="text-black">inhalers, medicated creams, </span>{" "}
          <span className="text-primary">and other medical essentials</span>
        </>
      ),
      description: "",
    },
  ];

  const [ref0, inView0] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });

  const inViewRefs = [
    { ref: ref0, inView: inView0 },
    { ref: ref1, inView: inView1 },
    { ref: ref2, inView: inView2 },
  ];

  return (
    <div className="py-3" style={{ background: "#F2FBFB" }}>
      <div className="container mt-4">
        {/* Mobile View */}
        <div className="d-md-none">
          <AnimatePresence mode="wait">
            {slideData.map((slide, index) => {
              const { ref, inView } = inViewRefs[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                  }
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 2 }}
                >
                  <div className="my-5" ref={ref}>
                    <h2 className="text-primary">{slide.heading}</h2>
                    <p className="mt-3">{slide.description}</p>
                    <img
                      src={images[index]}
                      alt="Medication"
                      className="img-fluid w-100 mb-3"
                      style={{ borderRadius: "10px" }}
                    />
                    <a
                      href="/how-it-works"
                      className="fw-semibold mt-2 d-flex text-decoration-none align-items-center gap-1 MedicationCard-btn"
                    >
                      See how it works <MdKeyboardDoubleArrowRight size={20} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Desktop View */}
        <div className="d-none d-md-block">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
            }}
            spaceBetween={30}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {slideData.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`fade-slide align-items-center row ${
                    activeIndex === index ? "active" : ""
                  }`}
                  style={{ position: "relative", zIndex: 1000 }}
                >
                  <div className="col-md-5">
                    <div className="d-none d-md-block">
                      {progressBar(activeIndex)}
                    </div>

                    <h2
                      className={`text-primary transition-text ${
                        activeIndex === index ? "fade-in" : "fade-out"
                      }`}
                    >
                      {slide.heading}
                    </h2>
                    <p className="mt-3">{slide.description}</p>
                    <a
                      href="/how-it-works"
                      className="fw-semibold mt-5 text-decoration-none d-flex align-items-center gap-1 MedicationCard-btn"
                    >
                      See how it works <MdKeyboardDoubleArrowRight size={20} />
                    </a>
                  </div>
                  <div className="col-md-2 d-none d-md-block" />
                  <div className="col-md-5">
                    <img
                      src={images[index]}
                      alt="Medication Package"
                      className="img-fluid w-100"
                      style={{ borderRadius: "3px" }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default MedicationSlider;