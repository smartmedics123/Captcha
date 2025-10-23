// SearchModal.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { RxCross2 } from "react-icons/rx";
import { getCloudinaryUrl } from '../../utils/cdnImage';


import './SearchModal.css';
import { createProductSlug } from '../../utils/productUtils';

const TRENDING_BRANDS = ["Pfizer", "GSK", "Getz_Pharma", "Abbott", "Martin_Dow"];
const TRENDING_SEARCHES = ["Panadol", "Brufen", "Disprine", "Gaviscon", "Amoxil"];

function SearchModal({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch trending products once
  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/products/trending`, {
      headers: { 'x-api-key': import.meta.env.VITE_API_SECURITY_KEY }
    })
      .then(response => {
        const data = response.data.data || [];
        setTrendingProducts(data);
        setProducts(data);
        setSimilarProducts([]);
      })
      .catch(error => console.error("Error fetching trending products:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Clear state if query is empty
      setProducts(trendingProducts);
      setSimilarProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      axios.post(`${API_BASE_URL}/products/search`, { query: searchQuery }, {
        headers: { 'x-api-key': import.meta.env.VITE_API_SECURITY_KEY }
      })
        .then(response => {
          setProducts(response.data.data || []);
          setSimilarProducts(response.data.similar || []);
        })
        .catch(error => console.error("Error fetching search results:", error))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const noResultsFound = searchQuery && !isLoading && products.length === 0;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container bg-white shadow rounded-4" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="d-flex align-items-center border-bottom p-3">
          <div className="d-flex align-items-center border rounded-pill px-3 py-2 flex-grow-1">
            <FaSearch className="me-2 text-muted" />
            <input
              type="text"
              placeholder="Search for Medicines, Brands and More"
              className="form-control border-0 shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn ms-3 p-0 fs-4" onClick={onClose}>
            <RxCross2 size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="search-modal-body p-3">
          {/* Trending Searches */}
          {!searchQuery && (
            <div className="mb-4">
              <h6 className="fw-bold text-muted mb-3">Trending Searches</h6>
              <div className="d-flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(term => (
                  <button key={term} className="btn btn-light rounded-pill btn-sm" onClick={() => setSearchQuery(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-5">
              <CgSpinner className="spinner fs-1 text-primary" />
            </div>
          )}

          {/* No Results */}
          {noResultsFound && (
            <div className="text-center py-5">
              <p className="text-muted">No results found for "{searchQuery}"</p>
            </div>
          )}

          {/* Matching Products */}
          {!isLoading && products.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-muted mb-3">{searchQuery ? 'Matching Products' : 'Trending Products'}</h6>
              {products.map(product => {
                const productSlug = createProductSlug(product.title);
                return (
                  <Link to={`/product/${productSlug}`} key={product.id} className="text-decoration-none" onClick={onClose}>
                    <div className="d-flex align-items-center search-result-item p-2 rounded-3">
                      <img
                        src={getCloudinaryUrl(product.thumbnail) || getCloudinaryUrl('example-product.png')}
                        alt={product.title}
                        className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <div className='flex-grow-1'>
                      <p className="fw-bold mb-0 text-dark">{product.title}</p>
                      <small className='text-muted'>By {product.manufacturer}</small>
                    </div>
                  <p className="fw-bold text-primary mb-0 ms-auto">
  Rs. {Number(product.stripPrice) > 0
        ? Number(product.stripPrice).toFixed(2)
        : Number(product.boxPrice).toFixed(2)}
</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

          {/* Similar Formula Products */}
          {!isLoading && searchQuery && similarProducts.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-muted mb-3">Similar Formula from Different Brands</h6>
              {similarProducts.map(product => {
                const productSlug = createProductSlug(product.title);
                return (
                  <Link to={`/product/${productSlug}`} key={product.id} className="text-decoration-none" onClick={onClose}>
                    <div className="d-flex align-items-center search-result-item p-2 rounded-3">
                      <img
                        src={getCloudinaryUrl(product.thumbnail) || getCloudinaryUrl('example-product.png')}
                        alt={product.title}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <div className='flex-grow-1'>
                      <p className="fw-bold mb-0 text-dark">{product.title}</p>
                      <small className='text-muted'>By {product.manufacturer}</small>
                    </div>
<p className="fw-bold text-primary mb-0 ms-auto">
  Rs. {Number(product.stripPrice) > 0
        ? Number(product.stripPrice).toFixed(2)
        : Number(product.boxPrice).toFixed(2)}
</p>



                  </div>
                </Link>
              );
            })}
          </div>
        )}

          {/* Trending Brands */}
          {!searchQuery && !isLoading && (
            <div className="mb-4">
              <h6 className="fw-bold text-muted mb-3">Trending Brands</h6>
              <div className="d-flex flex-wrap justify-content-start gap-3">
                {TRENDING_BRANDS.map(brand => (
                  <div key={brand} className="text-center">
                    <div className="brand-logo-container border rounded-3 p-2 d-flex align-items-center justify-content-center">
                      <img
                        src={getCloudinaryUrl(`${brand}.png`)}
                        alt={`${brand} Logo`}
                        style={{ width: '80px', height: '40px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
