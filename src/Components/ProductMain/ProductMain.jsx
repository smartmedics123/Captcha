import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import CustomSelectBox from "../CustomSelectBox/CustomSelectBox";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQuantity, increaseQuantity, addItem } from "../../features/cart/cartSlice";


// import { addItem } from "../../features/cart/cartSlice";


function ProductMain({ product, pageType = "medicine" }) {
  const {
    id,
    title,
    description,
    stripPrice,
    boxPrice,
    status,
    manufacturer,
    additionalInformation,
    category,
    packaging,
    precautions,
    specification,
    usageAndSafety,
    warnings,
    thumbnail,
    formula,
    isPrescrip,
    howItWorks,
    drugClass,
    boxQuantity,
    stripQuantity,
    isUnit,
    quantityLabel,
  } = product;

  // --- Functions ---
  const getDisplayLabel = (type, isUnit) => {
    if (type === "Unit" && isUnit) return "Pc";
    return type;
  };

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem("customerId");
    const handleIncrease = (id) => {
    // Find the cart item to check max available
    const cartItem = cartItems.find(item => item.id === id);
    if (cartItem && cartItem.maxAvailable && cartItem.quantity >= cartItem.maxAvailable) {
      alert(`Only ${cartItem.maxAvailable} ${cartItem.type}(s) available in stock`);
      return;
    }
    dispatch(increaseQuantity({ id }));
  };

  // const handleDecrease = (id) => {
  //   dispatch(decreaseQuantity({ id }));
  // };

  // const handleRemove = (id) => {
  //   dispatch(removeItem({ id }));
  // };

  const typeOptions = [];
  if ((boxQuantity || 0) > 0) typeOptions.push("Full Box");
  if ((stripQuantity || 0) > 0) typeOptions.push(quantityLabel || "Strip");

  const isOutOfStock = typeOptions.length === 0;

  const [selectedType, setSelectedType] = useState(typeOptions[0] || "Full Box");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(
    typeOptions[0] === "Strip" ? Number(stripPrice) : Number(boxPrice)
  );
  const [showMessage, setShowMessage] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);

  const getMaxQuantity = () => {
    return selectedType === "Strip" ? stripQuantity || 0 : boxQuantity || 0;
  };

  const getQuantityOptions = () => {
    const maxQty = getMaxQuantity();
    if (maxQty === 0) return [];
    const options = [];
    for (let i = 1; i <= Math.min(maxQty, 20); i++) {
      options.push(i.toString().padStart(2, "0"));
    }
    return options;
  };

  const handleTypeChange = (val) => {
    const type = typeof val === "string" ? val : val?.target?.value || val?.value;
    setSelectedType(type);
    setSelectedQuantity(1);
    setSelectedPrice(type === "Strip" ? Number(stripPrice) : Number(boxPrice));
  };

  const handleQuantityChange = (qty) => {
    const quantity = Number(qty);
    const maxQty = getMaxQuantity();
    setSelectedQuantity(quantity > maxQty ? maxQty : quantity);
  };

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleAddToCarts = () => {
    if (isOutOfStock) return alert("This product is out of stock");

    const maxQty = getMaxQuantity();
    if (selectedQuantity > maxQty)
      return alert(`Only ${maxQty} ${selectedType}(s) available in stock`);

    const displayType = getDisplayLabel(selectedType, isUnit);
    dispatch(
      addItem({
        id: `${id}-${selectedType.toLowerCase()}`,
        name: `${title} (${selectedType})`,
        price: selectedPrice,
        desc: description,
        img: thumbnail,
        quantity: selectedQuantity,
        pname: title,
        type: selectedType,
        displayType: displayType,
        stripPrice: Number(stripPrice),
        boxPrice: Number(boxPrice),
        isPrescrip: isPrescrip,
        maxAvailable: maxQty,
      })
    );
    setShowCartMessage(true);
    setTimeout(() => setShowCartMessage(false), 2500);
  };

const handleBuyNow = () => {
  if (isOutOfStock) return alert("This product is out of stock");

  const maxQty = getMaxQuantity();
  if (selectedQuantity > maxQty)
    return alert(`Only ${maxQty} ${selectedType}(s) available in stock`);

  const displayType = getDisplayLabel(selectedType, isUnit);

  dispatch(
    addItem({
      id: `${id}-${selectedType.toLowerCase()}`,
      name: `${title} (${selectedType})`,
      price: selectedPrice,
      desc: description,
      img: thumbnail,
      quantity: selectedQuantity,
      pname: title,
      type: selectedType,
      displayType: displayType,
      stripPrice: Number(stripPrice),
      boxPrice: Number(boxPrice),
      isPrescrip: isPrescrip,
      maxAvailable: maxQty,
    })
  );

  // Redirect to cart page
  navigate("/cart");
};


  // --- Lists for accordion sections ---
  const makeList = (text) =>
    text ? text.split(/\n|,/).map((e) => e.trim()).filter(Boolean) : [];

  const specificationList = makeList(specification);
  const warningsList = makeList(warnings);
  const precautionsList = makeList(precautions);
  const usageAndSafetyList = makeList(usageAndSafety);
  const howItWorksList = makeList(howItWorks);

  return (
    <div className="container mt-4 px-md-5">
      {/* Breadcrumb */}
      <div className="py-3">
        <Link
          to={pageType === "nutrition" ? "/nutrition-supplements" : "/medicines"}
          className="text-decoration-none"
        >
          <span className="text-muted">
            {pageType === "nutrition" ? "Nutrition & Supplements" : category || "Medicines"}
          </span>
        </Link>
        <IoIosArrowForward className="mx-2 text-muted" />
        <span>{title}</span>
      </div>

      <div className="row gap-4 gap-md-0">
        {/* Product Image */}
        <div className="col-md-6">
          <img src={thumbnail} alt={title} className="w-100 h-100 rounded-4" />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2>{title}</h2>
          <div className="my-3">
            <h6 className="fw-bold mb-1">Product Summary</h6>
            <ul className="text-muted" style={{ lineHeight: "1.8" }}>
              <li><span>Brand Name:</span> {title}</li>
              {formula && <li><span>Generic Name:</span> {formula}</li>}
              {manufacturer && <li><span>Manufacturer:</span> {manufacturer}</li>}
              {drugClass && <li><span>Drug Class:</span> {drugClass}</li>}
              {isPrescrip !== null && (
                <li>
                  <span>Prescription Required:</span> {isPrescrip ? "Yes" : "No"}
                </li>
              )}
              <li>
                <span>Availability:</span>{" "}
                {isOutOfStock ? (
                  <span className="text-danger">Out of Stock</span>
                ) : (
                  <span className="text-success">{status}</span>
                )}
              </li>
              {packaging && <li><span>Pack Size:</span> {packaging}</li>}
            </ul>
          </div>

          <h3 className="text-primary">
            {isOutOfStock ? (
              <span className="text-danger">Out of Stock</span>
            ) : (
              `Rs. ${selectedPrice}`
            )}
          </h3>

          {!isOutOfStock ? (
            <>
              <div className="row">
                {/* Type Radio Buttons */}
                <div className="col-6 mt-3">
                   {/* <p className="mb-2 small-text fw-medium">Type</p> */}
                  {typeOptions.map((option, index) => (
                    <div key={index} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`type-${index}`}
                        name="type"
                        value={option}
                        checked={selectedType === option}
                        onChange={() => handleTypeChange(option)}
                      />
                      <label className="form-check-label" htmlFor={`type-${index}`}>
                        {getDisplayLabel(option, isUnit)}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Quantity Selector */}
                <div className="col-6">
                  {/* <p className="mb-2 small-text fw-medium">Quantity</p> */}
                  {/* <CustomSelectBox
                    options={getQuantityOptions()}
                    label={`Max ${getMaxQuantity()}`}
                    isInputAllowed={true}
                    value={selectedQuantity}
                    onSelect={handleQuantityChange}
                  /> */}
<div
  className="d-flex justify-content-center align-items-center border rounded-pill px-3 py-1 mt-3"
  style={{
    width: "130px",
    height: "40px",
    backgroundColor: "#fff",
  }}
>
  <button
    className="border-0 bg-transparent  fs-5"
    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      lineHeight: "1",
      color: "#333",
    }}
  >
    −
  </button>

  <span
    style={{
      margin: "0 10px",
      minWidth: "30px",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "1rem",
      color: "#2D2D2D",
    }}
  >
    {selectedQuantity}
  </span>

  <button
    className="border-0 bg-transparent fs-5"
    onClick={() =>
      setSelectedQuantity(Math.min(selectedQuantity + 1, getMaxQuantity()))
    }
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      lineHeight: "1",
      color: "#333",
    }}
  >
    +
  </button>
</div>


                </div>
              </div>

              {/* Buttons */}
              <div className="row mt-4 product-icon-hover opacity-100">
                <div className="col-10">
              
                  <button
                    className="btn w-100 fw-normal border text-black rounded-5"
                    onClick={() => handleAddToCarts(selectedQuantity)}
                  >
                    Add to Cart
                  </button>
             <button
  className="btn w-100 mt-2 fw-normal border text-light rounded-5 bg-dark "
  onClick={handleBuyNow}
>
  Buy Now
</button>

                </div>
                <button
                  onClick={handleClick}
                  className="btn rounded-5 col-2 btn-white border d-flex justify-content-center align-items-center shadow-sm p-2 mt-3"
                >
                  <FaRegHeart size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="row mt-4">
              <div className="col-12">
                <button
                  className="btn w-100 fw-normal border text-white bg-secondary rounded-5"
                  disabled
                >
                  Currently Out of Stock
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="mt-4">
        <h4 className="text-center my-5">{title} - Easy Guide</h4>
        <div className="accordion" id="descriptionAccordion">
          {description && (
            <AccordionItem title={`What is ${title}?`} content={<p>{description}</p>} id="Specs" />
          )}
          {usageAndSafetyList.length > 0 && (
            <AccordionItem
              title="What is it used for?"
              content={usageAndSafetyList.map((e, i) => <li key={i}>{e}</li>)}
              id="Usage"
            />
          )}
          {howItWorksList.length > 0 && (
            <AccordionItem
              title="How does it work?"
              content={howItWorksList.map((e, i) => <li key={i}>{e}</li>)}
              id="HowItWorks"
            />
          )}
          {precautionsList.length > 0 && (
            <AccordionItem
              title="Use with care if you"
              content={precautionsList.map((e, i) => <li key={i}>{e}</li>)}
              id="Precautions"
            />
          )}
          {warningsList.length > 0 && (
            <AccordionItem
              title={`Don't use ${title} if`}
              content={warningsList.map((e, i) => <li key={i}>{e}</li>)}
              id="Warnings"
            />
          )}
          {specificationList.length > 0 && (
            <AccordionItem
              title="Common Side Effects"
              content={
                <>
                  <p>You may feel:</p>
                  <ul>{specificationList.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  <p className="text-muted mt-2" style={{ fontSize: "0.95em" }}>
                    These side effects are usually mild. Let your doctor know if they continue or worsen.
                  </p>
                </>
              }
              id="Specification"
            />
          )}
          {additionalInformation && (
            <AccordionItem
              title="How to store"
              content={<p>{additionalInformation}</p>}
              id="Store"
            />
          )}
        </div>
      </div>

      {/* Toast Messages */}
      <AnimatePresence>
        {showMessage && (
          <Toast text="Product added to wishlist" bg="#333" bottom="20px" />
        )}
        {showCartMessage && (
          <Toast text="Product added to cart" bg="#00909D" bottom="60px" />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Small Reusable Components ---
const AccordionItem = ({ title, content, id }) => (
  <div className="accordion-item custom-accordion-item">
    <h2 className="accordion-header" id={`heading${id}`}>
      <button
        className="accordion-button custom-accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse${id}`}
        aria-expanded="false"
        aria-controls={`collapse${id}`}
      >
        {title}
      </button>
    </h2>
    <div
      id={`collapse${id}`}
      className="accordion-collapse collapse"
      aria-labelledby={`heading${id}`}
      data-bs-parent="#descriptionAccordion"
    >
      <div className="accordion-body custom-accordion-body">
        {Array.isArray(content) ? <ul>{content}</ul> : content}
      </div>
    </div>
  </div>
);

const Toast = ({ text, bg, bottom }) => (
  <motion.div
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={{
      position: "fixed",
      bottom,
      left: "50%",
      backgroundColor: bg,
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "6px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      zIndex: 9999,
    }}
    initial={{ y: 100, x: "-50%", opacity: 0 }}
    animate={{ y: 0, x: "-50%", opacity: 1 }}
    exit={{ y: 100, x: "-50%", opacity: 0 }}
  >
    {text}
  </motion.div>
);

export default ProductMain;
