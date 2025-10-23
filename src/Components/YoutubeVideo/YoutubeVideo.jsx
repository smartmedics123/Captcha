import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState } from "react";
import './YoutubeVideo.css';

function YoutubeVideo() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{
  maxWidth: 900,
  margin: '0 auto',
  width: '100%',
  minHeight: '300px',
  height: 'auto',
  padding: '16px 0'
}}
    >
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        Introduction to <span className="text-primary">Smart Medics</span>
      </motion.h2>

      <motion.div
        className="py-3 py-md-5 video-con"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="video-box" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div
            className="hero-video position-relative"
          style={{
    aspectRatio: "16/9",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    width: "100%",
    maxWidth: "900px",
    background: '#f8f9fa',
  }}
            onClick={() => setIframeLoaded(true)}
          >
            {!iframeLoaded ? (
              <>
                <img
                  src="https://res.cloudinary.com/dc5nqer3i/image/upload/w_1200,q_auto,f_auto/hqdefault.png"
                  alt="Smart Medics Intro"
                  className="top-0 start-0 w-100 h-100"
                  style={{ objectFit: "cover" }}
                  loading="eager"
                  fetchpriority="high"
                  width={800}
                  height={450}
                />
                <div
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{
                    
                    
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f03"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>
                </div>
              </>
            ) : (
        <iframe
  src="https://www.youtube.com/embed/W3dj9E2C7PI?autoplay=1"
  title="Smart Medics Intro"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
  loading="eager"
  className="position-absolute top-0 start-0 w-100 h-100"
  style={{ border: "none", width: "100%", height: "100%" }}
/>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default YoutubeVideo;