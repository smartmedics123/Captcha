import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import useIsMobile from "../../utils/useIsMobile";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const isMobile = useIsMobile();
  
  // Handle both dynamic and static job data
  const jobData = {
    id: job.id || 1,
    title: job.title || "Job Title",
    category: job.category || "Category",
    position: job.position || "Position",
    posted: job.posted || "Recently",
    location: job.location || "Location",
    salary: job.salary || "Competitive"
  };

  return (
    <div className="card shadow-sm p-3 mb-4 rounded-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end">
        <div className={`flex-grow-1 ${isMobile && "w-100"}`}>
          <h5 className="d-flex align-items-center justify-content-between mb-3">
            <span>{jobData.title}</span>
            <p className="text-muted d-flex d-md-none align-items-center gap-1 mb-0">
              <FaLocationDot />
              {jobData.location}
            </p>
          </h5>
          <p className="mb-2">
            <span className="fw-medium">Category:</span>{" "}
            <span className="text-muted">{jobData.category}</span>
          </p>
          <p className="mb-2">
            <span className="fw-medium">Position:</span>{" "}
            <span className="text-muted">{jobData.position}</span>
          </p>
          <p className="mb-0">
            <span className="fw-medium">Posted:</span>{" "}
            <span className="text-muted">{jobData.posted}</span>
          </p>
        </div>
        <div className="text-md-end d-flex flex-column  align-items-end justify-content-start  gap-3 mt-3 mt-md-0">
          <p className="text-muted d-none d-md-flex align-items-center gap-1 mb-0">
            <FaLocationDot />
            {jobData.location}
          </p>
          <div className="d-flex gap-5 gap-md-2">
            <Link
              to={`/job-detail/${jobData.id}`}
              className="btn btn-outline-dark rounded-pill px-4 py-2 fw-medium"
            >
              View Details
            </Link>
            <Link
              to={`/job-apply/${jobData.id}`}
              className="btn btn-dark rounded-pill px-4 fw-medium"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
