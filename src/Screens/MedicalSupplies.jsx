import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard/ProductCard";
import Pagination from "../Components/Pagination/Pagination";
import MedicalSuppliesCategories from "../Components/MedicalSuppliesCategories/MedicalSuppliesCategories";
import { getCloudinaryUrl } from "../utils/cdnImage";
import { Helmet } from "react-helmet";
import { pageMeta } from "../metaConfig";

const meta = pageMeta["/medical-supplies"];

function MedicalSupplies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const itemsPerPage = 8;

  // Fetch medical supplies products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory 
          ? `${API_BASE_URL}/products/medical-supplies?category=${encodeURIComponent(selectedCategory)}`
          : `${API_BASE_URL}/products/medical-supplies`;
          
        const response = await fetch(url, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setProducts(data.data || []);
          setFilteredProducts(data.data || []);
        } else {
          console.error('Failed to fetch medical supplies products:', data.message);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching medical supplies products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, API_BASE_URL]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    
    // Update URL parameters
    if (category) {
      setSearchParams({ category: category });
    } else {
      setSearchParams({});
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
    <div>
      <SMNavbar />
      <MedicalSuppliesCategories 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading medical supplies products...</p>
          </div>
        ) : (
          <>
            {selectedCategory && (
              <div className="mb-3">
                <h5 className="text-muted">
                  Category: {selectedCategory} ({filteredProducts.length} products)
                </h5>
              </div>
            )}
            
            {currentProducts.length > 0 ? (
              <div className="row">
                {currentProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      name: product.title,
                      image: product.thumbnail 
                        ? getCloudinaryUrl(product.thumbnail)
                        : getCloudinaryUrl("example-product.png"),
                      price: Number(product.boxPrice || product.stripPrice || 0),
                      boxQuantity: product.boxQuantity || 0,
                      stripQuantity: product.stripQuantity || 0,
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <h4>No Products Found</h4>
                <p className="text-muted">
                  {selectedCategory 
                    ? `No medical supplies products found in "${selectedCategory}" category.`
                    : "No medical supplies products available at the moment."
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      
      <Footer />
    </div>
    </>
  );
}

export default MedicalSupplies;