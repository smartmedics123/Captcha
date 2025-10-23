import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomSelectBox = ({
  options,
  optionLabels, // Add this new prop for display labels
  label,
  onSelect,
  showRadio = false,
  isInputAllowed = false, // new prop
  value
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || ""); 
  const dropdownRef = useRef(null);

  // Use optionLabels if provided, otherwise fall back to options
  const displayLabels = optionLabels || options;

  useEffect(() => {
    setSelectedOption(value || "");
  }, [value]); // Initialize with value prop or empty string

  // Helper function to get display label for selected value
  const getDisplayLabel = (selectedValue) => {
    if (!selectedValue) return "";
    const index = options.indexOf(selectedValue);
    return index !== -1 ? displayLabels[index] : selectedValue;
  };

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onSelect) onSelect(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="dropdown-container"
      style={{ position: "relative", width:"100%"}}
    >
      <div
        className="dropdown-header d-flex align-items-center justify-content-between"
        onClick={!isInputAllowed ? handleToggle : undefined}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#fff",
          position: "relative",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {isInputAllowed ? (
          <input
            type="text"
            value={selectedOption}
            onChange={handleInputChange}
            placeholder={label}
            onClick={handleToggle}
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              background: "transparent",
            }}
          />
        ) : (
          <span>{getDisplayLabel(selectedOption) || label}</span>
        )}
        <FaChevronDown
          style={{
            marginLeft: "auto",
            pointerEvents: "none",
          }}
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-list"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fff",
            marginTop: "5px",
            zIndex: 1,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <p className="px-2 my-2 small-text">{label}</p>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              className="d-flex align-items-center px-3 mb-2"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {showRadio && (
                <input
                  type="radio"
                  name={label}
                  checked={selectedOption === option}
                  readOnly
                />
              )}
              {displayLabels[index]} {/* Use display label instead of raw option */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelectBox;
