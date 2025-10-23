import React, { useRef, useState, useEffect } from "react";
import { getCloudinaryUrl } from "../../utils/cdnImage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

// Map category names to appropriate icons and full labels
const getCategoryData = (categoryName) => {
  const categoryMap = {
    'Heart': {
      icon: 'heart.svg',
      label: 'Cardiovascular Health (Heart)'
    },
    'Cardio': {
      icon: 'heart.svg',
      label: 'Cardiovascular Health (Heart)'
    },
    'Cardiovascular': {
      icon: 'heart.svg',
      label: 'Cardiovascular Health (Heart)'
    },
    'Gastro': {
      icon: 'stomach.svg',
      label: 'Gastrointestinal Health (Stomach)'
    },
    'Stomach': {
      icon: 'stomach.svg',
      label: 'Gastrointestinal Health (Stomach)'
    },
    'Gastrointestinal': {
      icon: 'stomach.svg',
      label: 'Gastrointestinal Health (Stomach)'
    },
    'Eye': {
      icon: 'eye.svg',
      label: 'Ophthalmic Health (Eye)'
    },
    'Optic': {
      icon: 'eye.svg',
      label: 'Ophthalmic Health (Optic)'
    },
    'Ophthalmic': {
      icon: 'eye.svg',
      label: 'Ophthalmic Health (Optic)'
    },
    'Nero': {
      icon: 'brain.svg',
      label: 'Neurological Health (Brain)'
    },
    'Brain': {
      icon: 'brain.svg',
      label: 'Neurological Health (Brain)'
    },
    'Neurological': {
      icon: 'brain.svg',
      label: 'Neurological Health (Brain)'
    },
    'Neuro': {
      icon: 'brain.svg',
      label: 'Neurological Health (Brain)'
    },
    'Lung': {
      icon: 'lungs.svg',
      label: 'Respiratory Health (Lungs)'
    },
    'Lungs': {
      icon: 'lungs.svg',
      label: 'Respiratory Health (Lungs)'
    },
    'Respiratory': {
      icon: 'lungs.svg',
      label: 'Respiratory Health (Lungs)'
    },
    'Endo': {
      icon: 'harmonal.svg',
      label: 'Endocrine Health (Hormonal)'
    },
  
    'Endocrine': {
      icon: 'harmonal.svg',
      label: 'Endocrine Health (Hormonal)'
    },
    'Ortho': {
      icon: 'musculoskeletal.svg',
      label: 'Musculoskeletal Health (Bones and Muscles)'
    },
    'Bones': {
      icon: 'musculoskeletal.svg',
      label: 'Musculoskeletal Health (Bones and Muscles)'
    },
    'Muscle': {
      icon: 'musculoskeletal.svg',
      label: 'Musculoskeletal Health (Bones and Muscles)'
    },
    'Uro': {
      icon: 'urological.svg',
      label: 'Urological Health (Urinary System)'
    },
    'Urological': {
      icon: 'urological.svg',
      label: 'Urological Health (Urinary System)'
    },
    'Urinary': {
      icon: 'urological.svg',
      label: 'Urological Health (Urinary System)'
    },
    'Skin': {
      icon: 'dermatological.svg',
      label: 'Dermatological Health (Skin)'
    },
    'Dermatological': {
      icon: 'dermatological.svg',
      label: 'Dermatological Health (Skin)'
    },
    'Antibiotic': {
      icon: 'infectious.svg',
      label: 'Infectious Diseases (Antibiotics and Antivirals)'
    },
    'Antiviral': {
      icon: 'infectious.svg',
      label: 'Infectious Diseases (Antibiotics and Antivirals)'
    },
    'Antiallergy': {
      icon: 'immunology.svg',
      label: 'Immunology (Allergy and Immune Support)'
    },
    'Immune': {
      icon: 'immunology.svg',
      label: 'Immunology (Allergy and Immune Support)'
    },
    'Immunology': {
      icon: 'immunology.svg',
      label: 'Immunology (Allergy and Immune Support)'
    },
    'Mental': {
      icon: 'mental.svg',
      label: 'Mental Health (Psychiatric Medications)'
    },
    'Psychiatric': {
      icon: 'mental.svg',
      label: 'Mental Health (Psychiatric Medications)'
    },
    'Psychology': {
      icon: 'mental.svg',
      label: 'Mental Health (Psychiatric Medications)'
    }
  };

  
  const categoryLower = categoryName.toLowerCase();
  
  // First check for exact matches to avoid substring issues
  for (const [key, data] of Object.entries(categoryMap)) {
    if (categoryLower === key.toLowerCase()) {
      return {
        icon: getCloudinaryUrl(data.icon),
        label: data.label
      };
    }
  }
  
  // Then check for partial matches, but prioritize longer matches
  const sortedKeys = Object.keys(categoryMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const keyLower = key.toLowerCase();
    if (categoryLower.includes(keyLower) && categoryLower !== 'uro' && keyLower !== 'uro') {
      return {
        icon: getCloudinaryUrl(categoryMap[key].icon),
        label: categoryMap[key].label
      };
    }
  }
  
  // Special handling for "Uro" to prevent it from matching "Neuro"
  if (categoryLower === 'uro' || categoryLower === 'urological' || categoryLower === 'urinary') {
    return {
      icon: getCloudinaryUrl('urological.svg'),
      label: 'Urological Health (Urinary System)'
    };
  }
  
  // Default fallback if no match found
  return {
    icon: getCloudinaryUrl('heart.svg'),
    label: `${categoryName} Health`
  };
};



// Static categories for medicines and nutrition
const getStaticCategories = (pageType = 'medicine') => {
  if (pageType === 'nutrition') {
    return [
      {
        name: 'Vitamins and Minerals',
        icon: getCloudinaryUrl('vitamin-d.png'), // Using placeholder icon
        label: 'Vitamins and Minerals'
      },
      {
        name: 'Probiotics',
        icon: getCloudinaryUrl('digestive-system.png'), // Using placeholder icon
        label: 'Probiotics'
      },
      {
        name: 'Dietary Supplements',
        icon: getCloudinaryUrl('dietary-suplement.png'), // Using placeholder icon
        label: 'Dietary Supplements'
      },
      {
        name: 'Nutraceuticals',
        icon: getCloudinaryUrl('cereal.png'), // Using placeholder icon
        label: 'Nutraceuticals'
      }
    ];
  }
  
  // Default medicine categories
  return [
    {
      name: 'Heart ',
      icon: getCloudinaryUrl('heart.svg'),
      label: 'Cardiovascular Health (Heart)'
    },
    {
      name: 'Gastro',
      icon: getCloudinaryUrl('stomach.svg'),
      label: 'Gastrointestinal Health (Stomach)'
    },
    {
      name: 'Eye',
      icon: getCloudinaryUrl('eye.svg'),
      label: 'Ophthalmic Health (Optic)'
    },
    {
      name: 'Neuro',
      icon: getCloudinaryUrl('brain.svg'),
      label: 'Neurological Health (Brain)'
    },
    {
      name: 'Respiratory',
      icon: getCloudinaryUrl('lungs.svg'),
      label: 'Respiratory Health (Lungs)'
    },
    {
      name: 'Endo',
      icon: getCloudinaryUrl('harmonal.svg'),
      label: 'Endocrine Health (Hormonal)'
    },
    {
      name: 'Ortho',
      icon: getCloudinaryUrl('musculoskeletal.svg'),
      label: 'Musculoskeletal Health (Bones and Muscles)'
    },
    {
      name: 'Uro',
      icon: getCloudinaryUrl('urological.svg'),
      label: 'Urological Health (Urinary System)'
    },
    {
      name: 'Skin',
      icon: getCloudinaryUrl('dermatological.svg'),
      label: 'Dermatological Health (Skin)'
    },
    {
      name: 'Antibiotic',
      icon: getCloudinaryUrl('infectious.svg'),
      label: 'Infectious Diseases (Antibiotics and Antivirals)'
    },
    {
      name: 'Antiallergy',
      icon: getCloudinaryUrl('immunology.svg'),
      label: 'Immunology (Allergy and Immune Support)'
    },
    {
      name: 'Mental',
      icon: getCloudinaryUrl('mental.svg'),
      label: 'Mental Health (Psychiatric Medications)'
    }
  ];
};

const MedicineCategories = ({ onCategorySelect, selectedCategory, pageType = 'medicine' }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Dynamic categories disabled; using static categories only

  // Set active index based on selected category
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const index = categories.findIndex(cat => cat.name === selectedCategory);
      setActiveIndex(index !== -1 ? index : null);
    } else if (!selectedCategory) {
      // Clear active index when no category is selected
      setActiveIndex(null);
    }
  }, [selectedCategory, categories]);

  // Use static categories only (no API fetch)
  useEffect(() => {
    try {
      if (pageType === 'nutrition') {
        setCategories(getStaticCategories('nutrition'));
      } else {
        setCategories(getStaticCategories('medicine'));
      }
    } catch (e) {
      console.error('Error setting static categories:', e);
      setCategories(getStaticCategories('medicine'));
    } finally {
      setLoading(false);
    }
  }, [pageType]);

  const handleCategoryClick = (category, index) => {
    const newActiveIndex = activeIndex === index ? null : index;
    setActiveIndex(newActiveIndex);
    
    // Call parent callback if provided
    if (onCategorySelect) {
      onCategorySelect(newActiveIndex === null ? null : category.name);
    }
  };

const handleScrollRight = () => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    setTimeout(checkScroll, 350); // scroll hone ke baad state update
  }
};

const handleScrollLeft = () => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    setTimeout(checkScroll, 350); // scroll hone ke baad state update
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
      <h1 className="mb-4 text-black">
        {pageType === 'nutrition' ? 'Nutrition & Supplements' : 'Medicines'}
      </h1>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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

export default MedicineCategories;