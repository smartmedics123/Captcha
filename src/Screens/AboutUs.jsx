import { Col, Container, Row } from "react-bootstrap";
import "../App.css";
import img1 from "../assets/A1.png";
import img2 from "../assets/A2.png";
import img3 from "../assets/A3.png";
import { getCloudinaryUrl } from "../utils/cdnImage";
import {
  FaPills,
  FaCapsules,
  FaSyringe,
  FaHeartbeat,
  FaLaptopMedical,
  FaUserMd,
} from "react-icons/fa";
import Footer from "../Components/Footer";
import SMNavbar from "../Components/SMNavbar";
import { Helmet } from "react-helmet";
import { pageMeta } from "../metaConfig";

const meta = pageMeta["/about-us"];

export default function AboutUs() {
  return (
    <>
      <SMNavbar />
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      {/* About Smart Medics-------------------------------- */}

      <Container fluid className="bg-aboutUs align-content-center  ">
        <Row className="ps-3">
          <Col
            xs={10}
            md={12}
            style={{ color: "#00909D", borderLeft: "5px solid #00909D" }}
          >
            <h1 className="fs-1  ">
              {" "}
              About Smart <br /> Medics{" "}
            </h1>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row
          xs={12}
          md={12}
          className="justify-content-center text-center m-3 pt-3 "
        >
          <p className=" fs-4">
            Welcome to Smart Medics, Pakistan's first pre-sorted medication and
            full-service digital pharmacy. We are dedicated to transforming the
            way you manage your medications, providing a better, simpler
            experience through innovative packaging, advanced technology, and
            personalized care.
          </p>
        </Row>
      </Container>
      {/* Our Mission---------------------------------------- */}

      <Container fluid>
  <Row className="m-3 mt-5 justify-content-center">
    <Col xs={12} md={8} className="text-center">
      <h1 style={{ color: "#00909D" }} className="fs-1 pt-4">
        | Our Mission
      </h1>
      <p className="fs-4 pt-2">
        At Smart Medics, our mission is to simplify your medication
        management, ensuring you receive the right medications at the
        right time, every time. We aim to reduce the stress and complexity
        often associated with managing multiple medications, allowing you
        to focus on what truly matters – your health and well-being.
      </p>
    </Col>
  </Row>
</Container>
      {/* What we Offer-------------------------- */}
      <Container fluid style={{ backgroundColor: "#D9D9D9" }}>
        <h1 className="text-center pt-4" style={{ color: "#00909D" }}>
          | What we Offer
        </h1>

        <Row className="m-3 pt-2">
          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaPills size={40} className="icon mb-3" />
              <h5>Pre-Sorted Medications</h5>
              <p className="fs-6">
                Each month, our customers receive a personalized packet of
                medications. Each packet is clearly labeled with the medication
                name, a picture of the pill, and instructions on how and when to
                take it.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaCapsules size={40} className="icon mb-3" />
              <h5>Convenient Dispensers</h5>
              <p className="fs-6 pb-4">
                Along with your pre-sorted medications, we provide a convenient
                dispenser to help keep your medications organized and easily
                accessible.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaSyringe size={40} className="icon mb-3" />
              <h5>Additional Medications</h5>
              <p className="fs-6 pb-4">
                For medications that cannot be pre-sorted into packets, such as
                liquids and inhalers, we ensure they are included in your
                shipment with clear usage instructions.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaHeartbeat size={40} className="icon mb-3" />
              <h5>Non-Sorted Medication</h5>
              <p className="fs-6 pb-4">
                We offer a comprehensive range of non-sorted medications for
                customers whose care requires traditional packaging. This
                includes access to all of our digital services to meet all your
                medication needs.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaLaptopMedical size={40} className="icon mb-3" />
              <h5>Advanced Technology</h5>
              <p className="fs-6">
                Our proprietary software platform manages your medications,
                coordinates refills and deliveries, and offers reminders and
                alerts. It also provides detailed information on your online
                dashboard, helping you control your medication management.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white d-flex flex-column justify-content-between text-center h-100">
              <FaUserMd size={40} className="icon mb-3" />
              <h5>Personalized Care</h5>
              <p className="fs-6 pb-5">
                Our team of in-house pharmacists is always available to assist
                you. You can reach us via email, text, or phone for any
                assistance you may need.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Why Choose Us-------------------------- */}
      <Container fluid className="">
        <h1 className="text-center pt-4" style={{ color: "#00909D" }}>
          | Why Choose Us
        </h1>

        <Row className="m-3 pt-2">
          <Col
            xs={12}
            sm={6}
            md={3}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white border-custom d-flex flex-column justify-content-between text-center h-100">
              <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                Avoid Queues
              </h5>
              <p className="pt-3">
                No more waiting in line at the pharmacy. We deliver your
                medications directly to your door.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={3}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white border-custom d-flex flex-column justify-content-between text-center h-100">
              <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                Accuracy
              </h5>
              <p className="pt-3 pb-4">
                Our pre-sorted packets ensure you take the correct dose at the
                correct time.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={3}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white border-custom d-flex flex-column justify-content-between text-center h-100">
              <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                Organization
              </h5>
              <p className="pt-3 pb-4">
                Our system reduces medicinal clutter, keeping your medications
                neatly organized.
              </p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={3}
            className="mb-4 d-flex align-items-stretch"
          >
            <div className="p-4 shadow-sm rounded bg-white border-custom d-flex flex-column justify-content-between text-center h-100">
              <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                Peace of Mind
              </h5>
              <p className="pt-3">
                With real-time notifications and a user-friendly online
                dashboard, you'll never miss a dose.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
