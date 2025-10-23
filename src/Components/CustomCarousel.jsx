import React, { useCallback, useEffect, useRef } from "react";
import { Carousel } from "react-bootstrap";

const MyCarousel = ({ slides = [], activeIndex, onSlideChange }) => {
  const players = useRef({});

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = initializePlayers;

    return () => {
      window.onYouTubeIframeAPIReady = null;
      Object.values(players.current).forEach((player) => {
        if (player && player.destroy) player.destroy();
      });
    };
  }, []);

  const initializePlayers = () => {
    slides.forEach((slide, index) => {
      if (slide.iframe && slide.iframe.includes("youtube")) {
        players.current[index] = new window.YT.Player(
          `youtube-player-${index}`,
          {
            events: {
              onReady: (event) => {
                if (index === activeIndex) {
                  event.target.playVideo();
                  hideYouTubeBranding(event.target);
                }
              },
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  event.target.playVideo();
                }
                hideYouTubeBranding(event.target);
              },
            },
          }
        );
      }
    });
  };

  const hideYouTubeBranding = (player) => {
    try {
      const iframe = player.getIframe();
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const logo = doc.querySelector(".ytp-title-channel-logo");
      if (logo) logo.style.display = "none";
      const watermark = doc.querySelector(".ytp-watermark");
      if (watermark) watermark.style.display = "none";
      const branding = doc.querySelectorAll(
        ".ytp-show-cards-title, .ytp-title-link"
      );
      branding.forEach((el) => (el.style.display = "none"));
    } catch (e) {
      console.log("Branding hiding failed due to cross-origin restrictions");
    }
  };

  const handleSelect = useCallback(
    (selectedIndex) => {
      if (onSlideChange) onSlideChange(selectedIndex);
    },
    [onSlideChange]
  );

  useEffect(() => {
    Object.keys(players.current).forEach((key) => {
      const player = players.current[key];
      if (player && typeof player.playVideo === "function") {
        if (parseInt(key) === activeIndex) {
          try {
            player.seekTo(0);
            player.playVideo();
          } catch (err) {
            console.warn("Player not ready yet", err);
          }
        } else {
          try {
            player.pauseVideo();
          } catch (err) {
            console.warn("Pause error", err);
          }
        }
      }
    });
  }, [activeIndex]);

  return (
    <div className="carousel-container mt-3" style={containerStyle}>
      <Carousel
        indicators={true}
        fade={true}
        wrap={false}
        interval={5000}
        pause={false}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        nextIcon={
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
            style={navIconStyle("right")}
          />
        }
        prevIcon={
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
            style={navIconStyle("left")}
          />
        }
      >
        {slides?.map((slide, index) => (
          <Carousel.Item key={index} style={itemStyle}>
            {slide.iframe ? (
              <div style={videoWrapperStyle}>
                <iframe
                  src={`${slide.iframe}?autoplay=1&muted=1&title=0&byline=0&portrait=0&badge=0&autopause=0`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={iframeStyle}
                  title={`vimeo-${index}`}
                />
              </div>
            ) : slide.component ? (
              React.cloneElement(slide.component, {
                isActive: activeIndex === index,
              })
            ) : (
              <div style={videoContainerStyle}>
                <img
                  className="media"
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    backgroundColor: "#000",
                  }}
                />
              </div>
            )}
            {slide.caption && (
              <Carousel.Caption style={captionStyle}>
                {/* ... */}
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

const containerStyle = {
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  maxWidth: "100vw",
  height: "100vh",
  margin: "auto",
  position: "relative",
};

const navIconStyle = (side) => ({
  position: "absolute",
  top: "calc(35vh)",
  [side]: "-0.5vw",
  transform: "translateY(-50%)",
  zIndex: 5,
  width: "6vw",
  height: "6vw",
  maxWidth: "40px",
  maxHeight: "40px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
});

const itemStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
};

const videoWrapperStyle = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
};

const videoContainerStyle = {
  width: "100%",
  height: "100vh",
  paddingBottom: "56.25%",
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#fff",
};

const iframeStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100%",
  border: "none",
  maxHeight: "80vh",
  objectFit: "cover",
  backgroundColor: "#000",
};

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "4px",
  padding: "8px",
  width: "90%",
  left: "5%",
  right: "5%",
  zIndex: 3,
};

export default MyCarousel;
