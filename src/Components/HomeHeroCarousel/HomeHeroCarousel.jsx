import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    type: "image",
    text: (
      <>
        Doorstep <span className="text-primary">Delivery,</span>
        <br />
        Right <span className="text-primary">on Time</span>
      </>
    ),
    image: getCloudinaryUrl("slide2.png", 1000),
  },
  {
    type: "image",
    text: (
      <>
        More <span className="text-primary">Time for Life,</span>
        <br />
        <span className="text-primary">Less </span>
        <span>Worry</span> <span className="text-primary">About</span>
        <br />
        <span className="text-primary">Meds</span>
      </>
    ),
    image: getCloudinaryUrl("slide3.png",1000),
  },
  {
    type: "image",
    text: (
      <>
        Your <span className="text-primary">Trusted</span>
        <br />
        <span className="text-primary">Online Pharmacy</span>
      </>
    ),
    image: getCloudinaryUrl("slide4.png",1000),
  },
  {
    type: "image",
    text: (
      <>
        <span className="text-primary">Never Miss</span> a
        <br />
        Dose <span className="text-primary">Again</span>
      </>
    ),
    image: getCloudinaryUrl("slide5.png",1000),
  },
];

const HomeHeroCarousel = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref}>
      {inView && (
        <motion.div
          initial={{ opacity: 0, y: -60 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="container p-4 mb-5 mt-4 m-auto position-relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop={true}
              // autoplay={{
              //   delay: 3000,
              //   disableOnInteraction: false,
              // }}
             onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              className="mySwiper"
            >
              {slides.map((slide, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className={`fade-slide ${
                      activeIndex === idx ? "active" : ""
                    }`}
                  >
                    {slide.type === "video" ? (
                      <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-10 p-0">
                          {slide.content}
                        </div>
                      </div>
                    ) : (
                      <div className="carousel-item-inner">
                        <div
                          className={`text-area transition-text ${
                            activeIndex === idx ? "fade-in" : "fade-out"
                          }`}
                        >
                          <h2>{slide.text}</h2>
                     <button
                            type="button"
                            className="btn fw-medium rounded-pill px-3 py-2 order-now-btn nav-link"
                            onClick={() => navigate("/preSorted-order")} 
                          >
                            Get Started!
                          </button>
                        </div>
                        <img
                          src={slide.image}
                          className="d-block w-100"
                          alt="slide"
                          fetchPriority="high"
                        />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev">
              <BsChevronLeft size={16} />
            </button>
            <button className="custom-next">
              <BsChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomeHeroCarousel;