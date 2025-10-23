import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RxEyeOpen } from "react-icons/rx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { addItem } from "../../features/cart/cartSlice";
import { createProductSlug } from "../../utils/productUtils";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const productUrl = createProductSlug(product.title, product.id);

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  
  // Check if product is out of stock
  const isOutOfStock = (product.boxQuantity || 0) === 0 && (product.stripQuantity || 0) === 0;

  const handleWishlistClick = () => {
    dispatch(toggleWishlist(product));

    const message = isWishlisted
      ? "Product removed from wishlist"
      : "Product added to wishlist";

    setMessageText(message);
    setShowMessage(true);

    setTimeout(() => setShowMessage(false), 3000);
  };
  
  const handleAddToCart = () => {
    if (isOutOfStock) return; // Don't add to cart if out of stock
    
    dispatch(addItem({
      id: `${product.id}-full-box`,
      name: `${product.name} (Full Box)`,
      price: Number(product.boxPrice),
      img: product.image,
      quantity: 1,
      pname: product.name,
      type: "Full Box",
      stripPrice: Number(product.stripPrice),
      boxPrice: Number(product.boxPrice),
      isPrescrip: product.isPrescrip,
    }));
  }

  return (
    <div className="col-6 p-2 p-md-2 col-md-6 col-lg-3  mb-2 mb-md-4">
      <div className="card rounded-4 h-100 border-0 position-relative overflow-hidden p-2 p-md-3 product-card-shadow">
        <div className="position-relative">
          <div className="image-wrapper">
          <Link to={`/product/${productUrl}`}>
            <img
              src={product.image}
              className="w-100 object-fit-cover image-hover-effect"
              alt={product.name}
            />
            </Link>
          </div>

          <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2 product-icon-hover">
            <button
              onClick={handleWishlistClick}
              className={`btn btn-white border flex justify-content-center align-items-center shadow-sm p-2 ${
                isWishlisted ? "active" : ""
              }`}
            >
              {isWishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            </button>
            <button className="btn btn-white border d-flex justify-content-center align-items-center shadow-sm p-2">
              <Link to={`/product/${productUrl}`}>
                <RxEyeOpen size={18} />
              </Link>
            </button>
          </div>
        </div>

        <div className="card-body p-0 mt-3">
          <h6 className="card-title fw-medium mb-1">{product.name}</h6>
          <p className="card-text text-muted small mb-2">
            {product.formula}<br/> {product.packaging}
          </p>
                           <p className="fw-bold text-primary mb-0 ms-auto">
  Rs. {Number(product.stripPrice) > 0
        ? Number(product.stripPrice).toFixed(2)
        : Number(product.boxPrice).toFixed(2)}
</p>
          {isOutOfStock ? (
            <button 
              className="btn border fw-medium w-100 rounded-pill"
              disabled
              style={{ backgroundColor: '#f8f9fa', color: '#6c757d', cursor: 'not-allowed' }}
            >
              Out of Stock
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="btn border fw-medium w-100 rounded-pill"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Animated Wishlist Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              backgroundColor: "#333",
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
            {messageText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductCard;
