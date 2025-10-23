import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { getCloudinaryUrl } from "../../utils/cdnImage";

function FloatingButtons() {
  const [hovered, setHovered] = useState(null);

  // WhatsApp number environment variable se lein
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  // Pehle se likha hua message
  const prefilledText = "Hello, I would like to place an order.";

  // Message ko URL-encode karein
  const encodedText = encodeURIComponent(prefilledText);

  const buttons = [
    {
      id: "whatsapp",
      icon: <FaWhatsapp size={28} />,
      label: "Place order on Whatsapp",
      bgColor: "#25D366",
      // Yahan par mukammal link bana lein
      link: `https://wa.me/${whatsappNumber}?text=${encodedText}`,
    },
    {
      id: "support",
      icon: (
        <img
          src={getCloudinaryUrl("support.png")}
          alt="Support"
          style={{ width: 39, height: 39 }}
          loading="lazy"
          width="39"
          height="39"
        />
      ),
      label: "Support",
      bgColor: "#ffff",
      // Support button ke liye link, maslan /support page ya koi aur
      link: "/customer-support", 
    },
  ];

  return (
    <div className="floating-buttons">
      {buttons.map((btn) => (
        // div ki jagah <a> tag use karein taake yeh link ban jaye
        <a
          key={btn.id}
          href={btn.link}
          target="_blank" // Link ko naye tab mein kholne ke liye
          rel="noopener noreferrer" // Security ke liye zaroori
          className="floating-button-wrapper"
          onMouseEnter={() => setHovered(btn.id)}
          onMouseLeave={() => setHovered(null)}
          // Styling ke liye (agar <a> tag se style kharab ho)
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {hovered === btn.id && (
            <div className="custom-tooltip">
              <div className="tooltip-line" />
              <span>{btn.label}</span>
            </div>
          )}
          <div className="icon-circle" style={{ backgroundColor: btn.bgColor }}>
            {btn.icon}
          </div>
        </a>
      ))}
    </div>
  );
}

export default FloatingButtons;