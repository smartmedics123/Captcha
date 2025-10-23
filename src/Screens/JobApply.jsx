import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import { FaFileUpload } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'resume' && files && files[0]) {
      const file = files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.resume) {
      alert('Please fill in all required fields and upload your resume');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('resume', formData.resume);

      const response = await fetch(`${API_BASE_URL}/jobs/${id}/apply`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess(true);
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate('/careers');
        }, 3000);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (error && !job) {
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

  if (success) {
    return (
      <div>
        <SMNavbar />
        <div className="container py-5">
          <div className="text-center">
            <div className="alert alert-success">
              <h4>Application Submitted Successfully!</h4>
              <p>Thank you for applying to {job?.title}. We'll review your application and get back to you soon.</p>
              <p className="mt-3">
                <Link to="/careers" className="btn btn-primary">
                  Back to Careers
                </Link>
              </p>
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
                <Link
                  to={`/job-detail/${id}`}
                  className="text-secondary text-decoration-none"
                  style={{ fontSize: "14px" }}
                >
                  {job?.title}
                </Link>
                <IoIosArrowForward className="mx-2" />
                <span style={{ fontSize: "14px", color: "#00C7BE" }}>
                  Apply
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex justify-content-center mt-5">
        <div
          className="product-card-shadow job-apply-card p-4"
          style={{
            borderRadius: "15px",
            maxWidth: "800px",
            width: "100%"
          }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-medium mb-2">Apply for {job?.title}</h2>
            <p className="mb-3 fs-6 text-muted">
              Fill the form below to apply for this position
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <label className="form-label">
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="mb-3 col-12 col-md-6">
                <label className="form-label">
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div className="mb-3 col-12 col-md-6">
                <label className="form-label">
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3 col-12 col-md-6">
                <label className="form-label">
                  Phone <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-3 col-12">
                <label className="form-label">
                  Resume/CV <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <span className="input-group-text">
                    <FaFileUpload />
                  </span>
                </div>
                <div className="form-text">
                  Upload your resume (PDF, DOC, or DOCX format, max 5MB)
                </div>
              </div>

              <div className="mb-3 col-12">
                <label className="form-label">
                  Cover Letter (Optional)
                </label>
                <textarea
                  className="form-control"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us why you're interested in this position..."
                  rows="4"
                />
              </div>

              <div className="mb-3 col-12">
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: submitting ? "#6c757d" : "#00C7BE",
                    color: "#fff",
                    borderRadius: "50px",
                    padding: "12px",
                    border: "none"
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>

              <div className="mb-3 col-12 text-center">
                <Link
                  to={`/job-detail/${id}`}
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: "50px", padding: "8px 24px" }}
                >
                  Back to Job Details
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default JobApply;
