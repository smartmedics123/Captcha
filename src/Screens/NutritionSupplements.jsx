import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import MedicineCategories from "../Components/MedicineCategories/MedicineCategories";
import ProductCard from "../Components/ProductCard/ProductCard";
import Pagination from "../Components/Pagination/Pagination";
import { getCloudinaryUrl } from "../utils/cdnImage";
import { Helmet } from "react-helmet";
import { pageMeta } from "../metaConfig";

const meta = pageMeta["/nutrition-supplements"];

function NutritionSupplements() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // URL parameters ke liye
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromURL = searchParams.get('category');

  // Fetch all products initially - Only productType: "Nutrition&Supplement"
  useEffect(() => {
    fetch(`${API_BASE_URL}/products?limit=500`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    }) // Get all products by setting high limit
      .then((res) => res.json())
      .then((data) => {
        console.log('API Response:', data); // Debug log
        
        // Filter only products with productType: "Nutrition&Supplement"
        const nutritionProducts = data.data?.filter(product => 
          product.productType === 'Nutrition&Supplement'
        ) || [];
        
        console.log('Filtered Nutrition & Supplements:', nutritionProducts); // Debug log
        console.log('Total nutrition products found:', nutritionProducts.length); // Debug log
        console.log('Setting allProducts and filteredProducts...');
        
      setAllProducts(nutritionProducts);
      setFilteredProducts(nutritionProducts);
      setLoading(false);
    })
    .catch((error) => {
      console.error('API Error:', error);
      setAllProducts([]);
      setFilteredProducts([]);
      setLoading(false);
    });
}, []);

  // Handle URL category parameter
  useEffect(() => {
    if (categoryFromURL && categoryFromURL !== selectedCategory) {
      handleCategorySelect(categoryFromURL);
    }
  }, [categoryFromURL]);

  // Handle category selection
  const handleCategorySelect = async (category) => {
    setCurrentPage(1); // Reset to first page when category changes
    setSelectedCategory(category);
    
    // Update URL parameter
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    
    if (!category) {
      // No category selected, show all nutrition products
      const nutritionProducts = allProducts.filter(product => 
        product.productType === 'Nutrition&Supplement'
      );
      setFilteredProducts(nutritionProducts);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`,
        { headers: { 'x-api-key': import.meta.env.VITE_API_SECURITY_KEY } }
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        // Filter by both category and productType: "Nutrition&Supplement"
        const nutritionProducts = data.data?.filter(product => 
          product.productType === 'Nutrition&Supplement'
        ) || [];
        setFilteredProducts(nutritionProducts);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirst, indexOfLast) || [];

  console.log('Current state:', {
    loading,
    allProductsCount: allProducts.length,
    filteredProductsCount: filteredProducts.length,
    currentProductsCount: currentProducts.length,
    currentPage,
    totalPages
  });

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
    <div>
      <SMNavbar />
      <MedicineCategories 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        pageType="nutrition" // Pass pageType to handle different categories
      />
      <div className="container py-4">
        {selectedCategory && (
          <div className="mb-3">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleCategorySelect(null)}
            >
              Clear Filter
            </button>
          </div>
        )}
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product.id} product={{
                ...product,
                name: product.title, // ProductCard expects 'name'
                image: product.thumbnail
                    ? getCloudinaryUrl(product.thumbnail)
                    : getCloudinaryUrl("example-product.png"),
                price: Number(product.boxPrice || product.stripPrice || 0),
                boxQuantity: product.boxQuantity || 0,
                stripQuantity: product.stripQuantity || 0,
              }} />
            ))
          ) : (
            <div className="col-12 text-center py-4">
              <p>No nutrition products found in this category.</p>
            </div>
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <Footer />
    </div>
    </>
  );
}

export default NutritionSupplements;