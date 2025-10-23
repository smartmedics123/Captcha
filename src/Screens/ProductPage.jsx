import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import SMNavbar from "../Components/SMNavbar";
import ProductMain from "../Components/ProductMain/ProductMain";
import ProductCard from "../Components/ProductCard/ProductCard";
import { getCloudinaryUrl } from "../utils/cdnImage";
import { Helmet } from 'react-helmet';

const ProductPage = () => {
  const { slug } = useParams();
  // const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    // Get product by slug
    fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
        // Dispatch render event for prerendering
        if (typeof window !== 'undefined') {
          document.dispatchEvent(new Event('render-event'));
        }
      });
    // Get all products for related (you can filter later)
    fetch(`${API_BASE_URL}/products`,{
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setRelated(data.data || []);
      });
  }, [slug]);

  if (loading || !product) return <div>Loading...</div>;

  // Check if product is nutrition type
  const isNutritionProduct = product.productType === "Nutrition&Supplement";

  return (
    <div>
      <Helmet>
        <title>{product.metaTitle || product.title}</title>
        <meta name="description" content={product.metaDescription || product.description} />
      </Helmet>
      <SMNavbar />
      <ProductMain
        product={{
          ...product,
          // isUnit: product.isUnit,
          quantityLabel: product.quantityLabel,
          thumbnail: product.thumbnail
            ? getCloudinaryUrl(product.thumbnail)
            : getCloudinaryUrl("example-product.png"),
        }}
        pageType={isNutritionProduct ? 'nutrition' : 'medicine'}
      />
      <div className="container py-4">
        <h2 className="my-3">Related Products</h2>
        <div className="row">
          {related
            .filter((p) => p.id !== product.id && p.productType === product.productType) // Filter by same product type
            .slice(0, 4)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  name: p.title,
                  image: p.thumbnail
                    ? getCloudinaryUrl(p.thumbnail)
                    : getCloudinaryUrl("example-product.png"),
                  price: Number(p.boxPrice || p.stripPrice || 0),
                  boxQuantity: p.boxQuantity || 0,
                  stripQuantity: p.stripQuantity || 0,
                }}
              />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;