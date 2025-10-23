import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
import "../App.css";

import SMNavbar from "../Components/SMNavbar";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const location = useLocation();
  const {
    id,
    desc,
    images = [],
    price,
    pname,
    specification,
    usageAndSafety,
    warnings,
    additionalInformation,
    precautions,
  } = location.state || {}; // Default images to an empty array
  console.log(images); // Debugging: Ensure the images array is received correctly
  const [isMobile, setIsMobile] = useState(false);
  const checked = true;
  useEffect(() => {
    console.log(location.state); // Check what data is being passed from the SearchBar
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const product = { id, desc, img: images[0], price, pname };
    dispatch(addItem(product));
  };

  const sectionRefs = {
    specifications: useRef(null),
    usage: useRef(null),
    precautions: useRef(null),
    warnings: useRef(null),
    additionalInfo: useRef(null),
  };

  const scrollToSection = (section) => {
    sectionRefs[section]?.current.scrollIntoView({ behavior: "smooth" });
  };

  const products = [
    {
      id: 1,
      name: "Nutrifactor Nori",
      price: "Rs. 700.50",
      desc: "Nutrifactor Nutin Tablets 2500Mcg(1 Bottle = 30 Tablets)",
      img: images[0],
      img2: "/path/to/panadol.png",
      img3: "/path/to/panadol.png",
    },
    {
      id: 2,
      name: "Panadol",
      price: "Rs. 300.00",
      desc: "Destina Tablets 5mg (1 Box = 1 Strip)(1 Strip = 10 Tablets)",
      img: images[0], // Replace with actual path to image
      // img2: '/path/to/panadol.png',
      // img3: '/path/to/panadol.png'
    },
    {
      id: 3,
      name: "Biotin Plus",
      price: "Rs. 400.00",
      desc: "Biotin Plus Tablets 2500Mcg (1Bottle = 30 Tablets)",
      img: images[0], // Replace with actual path to image
      // img2: '/path/to/panadol.png',
      // img3: '/path/to/panadol.png'
    },
    {
      id: 4,
      name: "Biotin Plus",
      price: "Rs. 400.00",
      desc: "Biotin Plus Tablets 2500Mcg (1Bottle = 30 Tablets)",
      img: images[0], // Replace with actual path to image
      // img2: '/path/to/panadol.png',
      // img3: '/path/to/panadol.png'
    },
  ];

  return (
    <>
      <SMNavbar />
      <Col
        xs={12}
        sm={10}
        md={10}
        className="container d-flex justify-content-center align-items-center"
      >
        <Row xs={12} sm={10} md={6} className="align-items-center p-3">
          <Col xs={12} md={4} className="d-flex justify-content-center">
            {/* Carousel for Images */}
            <Carousel>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={image}
                    alt={`Product Image ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col xs={12} md={8} className="d-flex flex-column">
            <div>
              <h6 className="card-text ps-2">{pname}</h6>
              <h5 className="card-title p-1">{desc}</h5>
              <p
                className="card-text pt-3"
                style={{ fontSize: "20px", fontWeight: "bolder" }}
              >
                {price}
              </p>
              <p
                className="card-text"
                style={{ fontSize: "20px", fontWeight: "lighter" }}
              >
                <label>
                  <input type="checkbox" checked={checked} readOnly />
                  <span className="custom-checkbox"></span>
                  <strong>Per Box</strong>
                </label>
              </p>
            </div>
            <div className="pt-4 mt-auto align-self-center">
              <button className="btn btn-primary " onClick={handleAddToCart}>
                ADD TO CART
              </button>
            </div>
          </Col>
        </Row>
      </Col>

      <Container id="specifications" ref={sectionRefs.specifications}>
        <Col xs={12} sm={7} md={"12"} className="pt-5">
          <Card.Body>
            <Card.Title style={{ fontSize: "25px", fontWeight: "bolder" }}>
              {pname} Specifications
            </Card.Title>
            <Card.Text>
              <div
                className="pt-2"
                dangerouslySetInnerHTML={{ __html: specification }}
              />
            </Card.Text>
          </Card.Body>
        </Col>
      </Container>

      <Container id="usage" ref={sectionRefs.usage}>
        <Col xs={12} sm={7} md={"12"} className="pt-2">
          <Card.Body>
            <Card.Title style={{ fontSize: "25px", fontWeight: "bolder" }}>
              {pname} Usage and Safety
            </Card.Title>
            <Card.Text>
              <div
                className="pt-2"
                dangerouslySetInnerHTML={{ __html: usageAndSafety }}
              />
            </Card.Text>
          </Card.Body>
        </Col>
      </Container>

      <Container id="precautions" ref={sectionRefs.precautions}>
        <Col xs={12} sm={7} md={"12"} className="pt-2">
          <Card.Body>
            <Card.Title style={{ fontSize: "25px", fontWeight: "bolder" }}>
              {pname} precautions
            </Card.Title>
            <Card.Text>
              <div
                className="pt-2"
                dangerouslySetInnerHTML={{ __html: precautions }}
              />
            </Card.Text>
          </Card.Body>
        </Col>
      </Container>

      <Container id="warnings" ref={sectionRefs.warnings}>
        <Col xs={12} sm={7} md={"12"} className="pt-2">
          <Card.Body>
            <Card.Title style={{ fontSize: "25px", fontWeight: "bolder" }}>
              {pname} Warnings
            </Card.Title>
            <Card.Text>
              <div
                className="pt-2"
                dangerouslySetInnerHTML={{ __html: warnings }}
              />
            </Card.Text>
          </Card.Body>
        </Col>
      </Container>

      <Container id="additionalInfo" ref={sectionRefs.additionalInfo}>
        <Col xs={12} sm={7} md={"12"} className="pt-2">
          <Card.Body>
            <Card.Title style={{ fontSize: "25px", fontWeight: "bolder" }}>
              {pname} additional Information
            </Card.Title>
            <Card.Text>
              <div
                className="pt-2"
                dangerouslySetInnerHTML={{ __html: additionalInformation }}
              />
            </Card.Text>
          </Card.Body>
        </Col>
      </Container>

      <div className="justify-center">
        <Container>
          <Row>
            <Card.Title
              style={{
                fontSize: "25px",
                paddingTop: "10px",
                fontWeight: "bolder",
              }}
            >
              Related Products
            </Card.Title>
          </Row>
          {isMobile ? (
            <Carousel>
              {products.map((data, index) => (
                <Carousel.Item key={index}>
                  <Card style={{ alignItems: "center" }}>
                    <Card.Img variant="top" src={data.img} alt={data.name} />
                    <Card.Body>
                      <Card.Title>{data.name}</Card.Title>
                      <Card.Text style={{ color: "#029BEB" }}>
                        <strong>{data.price}</strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Row>
              {products.map((data, index) => (
                <Col key={index} xs={12} sm={6} md={3} className="mb-4 pt-3">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/productdetails"
                    state={{
                      id: data.id,
                      desc: data.desc,
                      img: data.img,
                      img2: data.img2,
                      img3: data.img3,
                      price: data.price,
                    }}
                  >
                    <Card.Img variant="top" src={data.img} alt={data.name} />
                    <Card.Body>
                      <Card.Title>{data.name}</Card.Title>
                      <Card.Text style={{ color: "#029BEB" }}>
                        <strong>{data.price}</strong>
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}
