import React, { useState, useEffect } from "react";
import SMNavbar from "../Components/SMNavbar";
import Footer from "../Components/Footer";
import PrivacyPolicy from "../assets/Images/Careers.png";
import CareersMobile from "../assets/CareersMobile.png";

import JobCard from "../Components/JobCard/JobCard";
import Pagination from "../Components/Pagination/Pagination";
import useIsMobile from "../utils/useIsMobile";
import {getCloudinaryUrl} from "../utils/cdnImage";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 4;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const isMobile = useIsMobile();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setJobs(data.data.jobs);
          setTotalPages(data.data.pagination.totalPages);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs');
        // Fallback to static data if API fails
        const fallbackJobs = Array(60).fill({
          id: 1,
          title: "Pharmacist",
          category: "Pharmacy Operations",
          position: "Full-Time, On-site (Warehouse Dispensary)",
          postedAt: "2025-05-20T00:00:00.000Z",
          location: "Karachi",
        });
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setJobs(fallbackJobs.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(fallbackJobs.length / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, API_BASE_URL]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <div>
      <SMNavbar />
      <img
        src={isMobile ? getCloudinaryUrl('CareersMobile.png') : getCloudinaryUrl('Careers.png', 1600)}
        alt="Careers"
        className="img-fluid w-100 h-100"
      />
      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading job opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <div className="alert alert-warning">
              <h5>Unable to load jobs</h5>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {jobs.map((job, index) => (
              <JobCard 
                key={job.id || index} 
                job={{
                  ...job,
                  posted: formatDate(job.postedAt || job.posted || new Date())
                }} 
              />
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-5">
            <h4>No job openings available</h4>
            <p>Please check back later for new opportunities.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Careers;
