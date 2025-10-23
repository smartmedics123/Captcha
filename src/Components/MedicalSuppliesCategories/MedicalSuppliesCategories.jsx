import React, { useRef, useState, useEffect } from "react";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

// Static category icons mapping for medical supplies
const categoryIcons = {
  "First Aid Supplies": "first-aid.svg",
  "Incontinence Products": "urinary.png",
  "Surgical Supplies": "syringe.png",
  "Wound Care": "wound-care.svg",
  // "iv-drip" "syringe" "oxygen" 
  "Respiratory Supplies": "oxygen.png",
  "Temperature Control": "temperature.svg",
  "Diagnostic Tools": "diagnostic.svg",
  "Personal Care Items": "personal-care.svg",
  "Drips and Cannuals": "iv-drip.png",
  "Mobility Aids": "mobility.svg",
  "Orthopedic Supports": "orthopedic.svg"
};

const MedicalSuppliesCategories = ({ onCategorySelect, selectedCategory }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Set active index based on selected category
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const index = categories.findIndex(cat => cat.name === selectedCategory);
      setActiveIndex(index !== -1 ? index : null);
    }
  }, [selectedCategory, categories]);

  // Fetch medical supplies categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/medical-supplies/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
        const data = await response.json();
        
        if (data.status === 'success' && data.data.length > 0) {
          // Map categories with their icons
          const categoriesWithIcons = data.data.map(categoryName => ({
            name: categoryName,
            icon: getCloudinaryUrl(categoryIcons[categoryName] || 'first-aid.svg'),
            label: categoryName
          }));
          setCategories(categoriesWithIcons);
        } else {
          // No categories found
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching medical supplies categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  const handleCategoryClick = (category, index) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
    
    // Call parent callback if provided
    if (onCategorySelect) {
      onCategorySelect(activeIndex === index ? null : category.name);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <div className="container my-4 mt-5 position-relative">
      <h1 className="mb-4 text-black">Medical Supplies</h1>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {categories.length > 0 ? (
            <>
              {/* Right Arrow */}
              <div
                className="position-absolute end-0 d-none d-md-block"
                style={{ top: "66%", zIndex: 1 }}
              >
                <button className="custom-next2" onClick={handleScrollRight}>
                  <BsChevronRight size={14} />
                </button>
              </div>

              {/* Left Arrow */}
              {showLeftArrow && (
                <div
                  className="position-absolute start-0 d-none d-md-block"
                  style={{ top: "66%", zIndex: 1 }}
                >
                  <button className="custom-prev2" onClick={handleScrollLeft}>
                    <BsChevronLeft size={14} />
                  </button>
                </div>
              )}

              {/* Scrollable Categories */}
              <div
                ref={scrollRef}
                className="d-flex overflow-auto gap-3 py-2"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                }}
              >
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className={`d-flex align-items-center gap-2 px-3 py-2 madcine-category ${
                      activeIndex === index || selectedCategory === cat.name ? "active" : ""
                    }`}
                    style={{
                      flex: "0 0 auto",
                      scrollSnapAlign: "start",
                      whiteSpace: "nowrap",
                      cursor: "pointer"
                    }}
                    onClick={() => handleCategoryClick(cat, index)}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      style={{ width: "24px", height: "24px" }}
                    />
                    <span>{cat.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No medical supplies categories available.</p>
            </div>
          )}
        </>
      )}

      {/* Hide scrollbar (Webkit) */}
      <style>
        {`
          .overflow-auto::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default MedicalSuppliesCategories;