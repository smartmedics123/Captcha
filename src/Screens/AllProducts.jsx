import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomNavbar from "../Components/Navbar/CustomNavbar";

import MyCarousel from "../Components/CustomCarousel";
import Footer from "../Components/Footer";
import SearchBar from "../Components/SearchBar/SearchBar";
import images from "../assets/Images";
import { fetchProducts } from "../services/Prodcuts";
import LoadingSpinner from "../Components/Spinner/LoadingSpinner";
import DropDown from "../Components/CustomDropDown/DropDown";
import SMNavbar from "../Components/SMNavbar";
export default function AllProducts() {
  const slides = [
    // { iframe: 'https://www.youtube.com/embed/W3dj9E2C7PI'},
    { image: images.Banner },
    { image: images.Banner },
  ];
  const [loader, setLoader] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const productContainerRef = useRef(null);

  const fetchProductData = useCallback(async () => {
    try {
      const data = await fetchProducts(currentPage, itemsPerPage, searchTerm);
      setLoader(false);
      setMedicines(data.products);
      setTotalPages(data.totalPages);

      if (productContainerRef.current) {
        productContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <>
      <SMNavbar />
      {/* <div className='d-flex justify-content-center'> */}
      {/* <Col xs={5} className=' d-none d-md-block'>
          <DropDown/>
        </Col> */}
      {/* </div> */}
      {/* <SearchBar onSearch={handleSearch} onSearchClick={handleNext} /> */}

      <MyCarousel slides={slides} />
      <div
        className="justify-center"
        id="product-container"
        ref={productContainerRef}
      >
        {loader ? (
          <>
            <LoadingSpinner />
          </>
        ) : (
          <>
            <Container>
              <Row>
                {medicines.map((data) => (
                  <Col
                    key={data.id}
                    xs={6}
                    sm={6}
                    md={3}
                    className="mb-4 p-2 mt-5"
                  >
                    <Link
                      to={"/productdetails"}
                      style={{ textDecoration: "none", color: "black" }}
                      state={{
                        id: data.id,
                        pname: data.name,
                        desc: data.desc,
                        thumbnail: data.thumbnail,
                        images: data.images,
                        price: data.price,
                        specification: data.specification,
                        usageAndSafety: data.usageAndSafety,
                        warnings: data.warnings,
                        additionalInformation: data.additionalInformation,
                        precautions: data.precautions,
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={data.thumbnail}
                        alt={data.name}
                      />
                      <Card.Body className="p-3">
                        <Card.Title>{data.name}</Card.Title>
                        <Card.Text>{data.desc}</Card.Text>
                        <Card.Text>
                          <strong>{data.price}</strong>
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
            <div className="text-center">
              <button
                className="custom-button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button
                className="custom-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
