import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import { IoIosArrowForward } from "react-icons/io";
import Facebook from "../assets/Images/Facebook.svg";
import Linkedin from "../assets/Images/Linkedin.svg";
import Whatsapp from "../assets/Images/Whatsapp.svg";
import Twitter from "../assets/Images/Twitter.svg";
import Linkimage from "../assets/Images/Link.svg";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getCloudinaryUrl } from "../utils/cdnImage";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setJob(data.data);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, API_BASE_URL]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim());
  };

  if (loading) {
    return (
      <div>
        <SMNavbar />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div>
        <SMNavbar />
        <div className="container py-5">
          <div className="text-center">
            <div className="alert alert-warning">
              <h5>Job Not Found</h5>
              <p>{error}</p>
              <Link to="/careers" className="btn btn-primary">
                Back to Careers
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <SMNavbar />
      
      <div className="py-4" style={{ backgroundColor: "#fafafa" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="d-flex align-items-center">
                <Link
                  to="/"
                  className="text-secondary text-decoration-none"
                  style={{ fontSize: "14px" }}
                >
                  Home
                </Link>
                <IoIosArrowForward className="mx-2" />
                <Link
                  to="/careers"
                  className="text-secondary text-decoration-none"
                  style={{ fontSize: "14px" }}
                >
                  Careers
                </Link>
                <IoIosArrowForward className="mx-2" />
                <span style={{ fontSize: "14px", color: "#00C7BE" }}>
                  {job.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h2 className="card-title text-dark mb-2">{job.title}</h2>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaLocationDot className="me-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="badge bg-primary">{job.type}</span>
                      <span className="badge bg-info">{job.level}</span>
                      <span className="badge bg-success">{job.department}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-muted mb-1" style={{ fontSize: "14px" }}>
                      Posted: {formatDate(job.createdAt)}
                    </p>
                    {job.deadline && (
                      <p className="text-warning mb-0" style={{ fontSize: "14px" }}>
                        Deadline: {formatDate(job.deadline)}
                      </p>
                    )}
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h5 className="text-dark mb-3">Job Description</h5>
                  <p className="text-muted" style={{ lineHeight: "1.8" }}>
                    {job.description}
                  </p>
                </div>

                {job.requirements && (
                  <div className="mb-4">
                    <h5 className="text-dark mb-3">Requirements</h5>
                    <ul className="text-muted">
                      {formatList(job.requirements).map((req, index) => (
                        <li key={index} className="mb-2">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.qualifications && (
                  <div className="mb-4">
                    <h5 className="text-dark mb-3">Qualifications</h5>
                    <ul className="text-muted">
                      {formatList(job.qualifications).map((qual, index) => (
                        <li key={index} className="mb-2">{qual}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits && (
                  <div className="mb-4">
                    <h5 className="text-dark mb-3">Benefits</h5>
                    <ul className="text-muted">
                      {formatList(job.benefits).map((benefit, index) => (
                        <li key={index} className="mb-2">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(job.salaryMin || job.salaryMax) && (
                  <div className="mb-4">
                    <h5 className="text-dark mb-3">Salary Range</h5>
                    <p className="text-muted">
                      ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} per year
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title text-dark mb-4">Apply for this Job</h5>
                
                <div className="d-grid gap-3 mb-4">
                  <Link
                    to={`/job-apply/${job.id}`}
                    className="btn btn-primary btn-lg"
                    style={{ backgroundColor: "#00C7BE", borderColor: "#00C7BE" }}
                  >
                    Apply Now
                  </Link>
                  
                  <Link
                    to="/careers"
                    className="btn btn-outline-secondary"
                  >
                    Back to Careers
                  </Link>
                </div>

                <hr />

                <div className="mb-4">
                  <h6 className="text-dark mb-3">Share this Job</h6>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <img src={Facebook} alt="Facebook" width="16" height="16" />
                    </button>
                    <button className="btn btn-outline-info btn-sm">
                      <img src={Linkedin} alt="LinkedIn" width="16" height="16" />
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <img src={Whatsapp} alt="WhatsApp" width="16" height="16" />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <img src={Twitter} alt="Twitter" width="16" height="16" />
                    </button>
                    <button className="btn btn-outline-dark btn-sm">
                      <img src={Linkimage} alt="Copy Link" width="16" height="16" />
                    </button>
                  </div>
                </div>

                <div className="bg-light rounded p-3">
                  <h6 className="text-dark mb-2">Job Summary</h6>
                  <div className="small text-muted">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Department:</span>
                      <span>{job.department}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Experience:</span>
                      <span>{job.level}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Type:</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Location:</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default JobDetail;
